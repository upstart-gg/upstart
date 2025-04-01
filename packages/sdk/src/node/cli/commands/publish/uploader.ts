import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";
import fg from "fast-glob";
import { API_BASE_URL, DEFAULT_UPLOAD_MAX_CONCURRENCY } from "../../constants";
import http from "node:http";
import https from "node:https";
import { pipeline } from "node:stream";
import type { GenericApiError } from "../../types";
import { logger } from "~/node/shared/logger";
import chalk from "chalk";
import FormData from "form-data";
import parseGitIgnore from "./parse-gitignore";
import PQueue from "p-queue";
import ora from "ora";
import { customAlphabet } from "nanoid";
import { post } from "../../api";

interface UploadStats {
  fileName: string;
  fileSize: number;
  uploadDuration: number;
  statusCode: number;
  serverResponse: string;
}

class UploadError extends Error implements GenericApiError {
  constructor(
    public error: string,
    public error_description: string,
    public filename: string,
  ) {
    super(`${error}: ${error_description}`);
    this.name = "UploadError";
  }
}

interface UploadConfig {
  maxDataSize: number;
  retryAttempts: number;
  retryDelay: number;
}

const defaultConfig: UploadConfig = {
  maxDataSize: 12 * 1024 * 1024, // 12MB
  retryAttempts: 2,
  retryDelay: 1000,
};

const agent = new http.Agent({
  keepAlive: true,
  maxSockets: 10,
  keepAliveMsecs: 3000, // Keep connections open for 3 seconds
});

async function discoverFiles(templateDir: string): Promise<string[]> {
  const gitignore = path.join(templateDir, ".gitignore");
  const gitignoreExists = fs.existsSync(gitignore);
  const gitignored = gitignoreExists ? parseGitIgnore(fs.readFileSync(gitignore, "utf-8")).patterns : [];

  return fg("**/*", {
    cwd: templateDir,
    onlyFiles: true,
    dot: true,
    absolute: true,
    ignore: [
      "node_modules/**",
      ".cache/**",
      "**/.DS_Store",
      ".gitignore",
      ".env",
      ".env.*",
      ".git/**",
      "dist/**",
      ...gitignored,
    ],
  });
}

async function uploadFile(
  filePath: string,
  relativePath: string,
  uploadUrl: string,
  templateId: string,
  spinner: ReturnType<typeof ora>,
  token: string,
  config: UploadConfig,
): Promise<UploadStats> {
  const uploadWithRetry = async (attempt: number): Promise<UploadStats> => {
    try {
      return await performUpload(filePath, relativePath, uploadUrl, templateId, spinner, token, config);
    } catch (error) {
      if (attempt < config.retryAttempts) {
        logger.warn(`Retrying upload for ${relativePath} (attempt ${attempt + 1})`);
        await new Promise((resolve) => setTimeout(resolve, config.retryDelay));
        return uploadWithRetry(attempt + 1);
      }
      throw error;
    }
  };

  return uploadWithRetry(0);
}

async function performUpload(
  filePath: string,
  relativePath: string,
  uploadUrl: string,
  templateId: string,
  spinner: ReturnType<typeof ora>,
  token: string,
  config: UploadConfig,
): Promise<UploadStats> {
  return new Promise<UploadStats>((resolve, reject) => {
    const stats = fs.statSync(filePath);
    const fileName = path.basename(filePath);
    const startTime = Date.now();

    const form = new FormData({
      maxDataSize: config.maxDataSize,
    });
    const fileStream = fs.createReadStream(filePath);
    let totalUploaded = 0;

    const updateProgress = (chunk: Buffer) => {
      totalUploaded += chunk.length;
    };

    fileStream.on("data", updateProgress);
    form.append("file", fileStream, {
      filename: fileName,
      knownLength: stats.size,
    });

    const options: https.RequestOptions = {
      agent,
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "x-upstart-template-file-path": relativePath,
        "x-upstart-template-id": templateId,
        ...form.getHeaders(),
      },
    };

    const protocol = uploadUrl.startsWith("https") ? https : http;
    const req = protocol.request(uploadUrl, options, (res) => {
      let responseBody = "";
      res.on("data", (chunk) => {
        responseBody += chunk;
      });

      res.on("end", () => {
        const endTime = Date.now();
        const uploadStats: UploadStats = {
          fileName,
          fileSize: stats.size,
          uploadDuration: endTime - startTime,
          statusCode: res.statusCode ?? 0,
          serverResponse: responseBody,
        };

        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          spinner.text = `Uploaded ${relativePath}`;
          resolve(uploadStats);
        } else {
          let errorObject: UploadError;
          if (res.headers["content-type"]?.startsWith("application/json")) {
            const parsedError = JSON.parse(responseBody);
            errorObject = new UploadError(
              parsedError.error || "unknown_error",
              parsedError.error_description || "Unknown error occurred",
              relativePath,
            );
          } else {
            errorObject = new UploadError(
              "unknown_error",
              responseBody || "Unknown error occurred",
              relativePath,
            );
          }

          spinner.fail(
            `Failed to upload ${relativePath} [${errorObject.error}] ${errorObject.error_description}`,
          );

          reject(errorObject);
        }
      });
    });

    req.on("error", (error) => {
      reject(new UploadError("request_error", error.message, relativePath));
    });

    pipeline(form, req, (err) => {
      if (err) {
        reject(
          new UploadError("pipeline_error", `Pipeline failed for ${fileName}: ${err.message}`, relativePath),
        );
      }
    });
  });
}

function reportUploadStatistics(
  templateId: string,
  uploadedFiles: UploadStats[],
  failedFiles: PromiseRejectedResult[],
) {
  if (failedFiles.length > 0) {
    logger.error(chalk.red(`Failed to upload ${failedFiles.length} files:`));
    failedFiles.forEach((failure) => {
      const error = failure.reason as UploadError;
      logger.error(`- ${error.filename}: ${error.error_description} (${error.error})`);
    });
  } else {
    logger.info(
      chalk.green(`Uploaded ${uploadedFiles.length} files successfully for template ${templateId}.\n`),
    );
  }
}

export async function uploadTemplate(
  templateId: string,
  templateDir: string,
  token: string,
  dryRun = false,
  config: Partial<UploadConfig> = {},
) {
  const fullConfig = { ...defaultConfig, ...config };
  const queue = new PQueue({ concurrency: DEFAULT_UPLOAD_MAX_CONCURRENCY });
  const files = await discoverFiles(templateDir);
  const filesCount = files.length;
  const signatures: Record<string, string> = {};
  // generate a upload id
  const uploadId = generateUploadId();
  let completedUploads = 0;

  // compute signatures
  for (const file of files) {
    const relativePath = path.relative(templateDir, file);
    const md5 = await sha1sum(file);
    signatures[relativePath] = md5;
  }

  if (dryRun) {
    logger.info("Dry run mode enabled. Skipping upload.\n");
    logger.info("The following files would have been uploaded:");
    files.forEach((file) => logger.info(`- ${file}`));
    process.exit(0);
  }

  const spinner = ora(`Uploading ${filesCount} files...`).start();

  // upload files
  const uploadPromises = files.map((file) => {
    const fullPath = path.resolve(templateDir, file);
    const relativePath = path.relative(templateDir, file);
    const url = `${API_BASE_URL}/v1/templates/${templateId}/upload/${uploadId}`;
    return queue.add(async () => {
      const result = await uploadFile(fullPath, relativePath, url, templateId, spinner, token, fullConfig);
      completedUploads++;
      return result;
    });
  });

  const results = await Promise.allSettled(uploadPromises);
  spinner.stop();

  const uploadedFiles = results.filter(
    (result): result is PromiseFulfilledResult<UploadStats> => result.status === "fulfilled",
  );

  const failedFiles = results.filter(
    (result): result is PromiseRejectedResult => result.status === "rejected",
  );

  reportUploadStatistics(
    templateId,
    uploadedFiles.map((r) => r.value),
    failedFiles,
  );

  // finalize upload
  if (!failedFiles.length && uploadedFiles.length) {
    const finalizeUrl = `${API_BASE_URL}/v1/templates/${templateId}/upload/${uploadId}/finalize`;
    const finalizePayload = {
      signatures,
    };

    const finalizeResponse = await post(finalizeUrl, finalizePayload);

    if (finalizeResponse.isError) {
      logger.error(
        `Failed to finalize upload: ${finalizeResponse.data.error_description} (${finalizeResponse.data.error})`,
      );
      return {
        filesCount,
        uploadedFiles: uploadedFiles.map((r) => r.value),
        failedFiles: [],
        success: false,
      };
    }
  }

  return {
    filesCount,
    uploadedFiles: uploadedFiles.map((r) => r.value),
    failedFiles,
    success: failedFiles.length === 0,
  };
}

async function sha1sum(filePath: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-1", fs.readFileSync(filePath));
  // convert arrayBuffer to hex
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateUploadId(): string {
  const randomId = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 5);
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = now.getUTCDate().toString().padStart(2, "0");
  const hours = now.getUTCHours().toString().padStart(2, "0");
  const minutes = now.getUTCMinutes().toString().padStart(2, "0");
  const seconds = now.getUTCSeconds().toString().padStart(2, "0");
  return `${year}${month}${day}${hours}${minutes}${seconds}_${randomId()}`;
}
