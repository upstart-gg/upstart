import type { TablesList } from "../../../types";
import getClient from "./client";
import type { GoogleSheetsOptions } from "./options";

export async function saveRecord(
  formData: FormData,
  options: GoogleSheetsOptions,
  accessToken: string,
): Promise<boolean> {
  try {
    if (!accessToken) {
      throw new Error("Access token is required");
    }

    if (!options.spreadsheetId) {
      throw new Error("Spreadsheet ID is required");
    }

    const client = getClient(accessToken);

    // 1. Download the current spreadsheet as CSV
    const downloadResponse = await client.callDriveApi<string>(
      `https://www.googleapis.com/drive/v3/files/${options.spreadsheetId}/export?mimeType=text/csv`,
      "GET",
    );

    if (!downloadResponse.success) {
      throw new Error(`Failed to download spreadsheet: ${downloadResponse.status}`);
    }

    // 2. Parse the existing CSV data
    const existingCsv = downloadResponse.data;
    const existingLines = existingCsv.trim().split("\n");

    // 3. Convert FormData to a record object
    const record: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      record[key] = value;
    }
    const headers = Object.keys(record);

    // 4. Check if headers exist in CSV, if not add them
    let csvLines: string[] = [];

    if (existingLines.length === 0 || existingLines[0].trim() === "") {
      // No data exists, add headers
      csvLines.push(headers.join(","));
    } else {
      // Keep existing data
      csvLines = [...existingLines];
    }

    // 5. Convert record to CSV row
    const newCsvRows = [
      headers
        .map((header) => {
          const value = record[header]?.toString() || "";
          // Escape CSV values that contain commas, quotes, or newlines
          if (value.includes(",") || value.includes('"') || value.includes("\n")) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        })
        .join(","),
    ];

    // 6. Add new rows to CSV
    csvLines.push(...newCsvRows);

    // 7. Convert back to CSV string
    const newCsvContent = csvLines.join("\n");

    // Use resumable upload to ensure the content is properly converted
    const initResponse = await client.callDriveApi<string>(
      `https://www.googleapis.com/upload/drive/v3/files/${options.spreadsheetId}?uploadType=resumable`,
      "PATCH",
      {
        mimeType: "application/vnd.google-apps.spreadsheet",
      },
    );

    if (!initResponse.success) {
      const errorText = await initResponse.data;
      throw new Error(`Failed to initiate upload: ${initResponse.status} - ${errorText}`);
    }

    const uploadUrl = initResponse.headers.get("Location");

    if (!uploadUrl) {
      throw new Error("No upload URL returned from Google Drive");
    }

    // Upload the CSV content
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "text/csv",
      },
      body: newCsvContent,
    });

    return uploadResponse.ok;
  } catch (error) {
    console.error("Error pushing data to Google Sheets:", error);
    return false;
  }
}

export async function getSchema(
  accessToken: string,
  options: GoogleSheetsOptions,
): Promise<Record<string, unknown> | null> {
  try {
    const client = getClient(accessToken);
    const response = await client.callDriveApi<Record<string, unknown>>(
      `files/${options.spreadsheetId}/export?mimeType=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`,
      "GET",
    );

    if (!response.success) {
      throw new Error(`Failed to get spreadsheet schema: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error getting Google Sheets schema:", error);
    return null;
  }
}

export async function listTables(accessToken: string): Promise<TablesList> {
  try {
    if (!accessToken) {
      throw new Error("Access token is required");
    }

    const client = getClient(accessToken);

    // Search for Google Sheets files using Google Drive API
    const response = await client.callDriveApi<{
      files: Array<{
        id: string;
        name: string;
        mimeType: string;
        createdTime: string;
        modifiedTime: string;
        webViewLink?: string;
      }>;
    }>(
      "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet'&fields=files(id,name,mimeType,createdTime,modifiedTime,webViewLink)",
      "GET",
    );

    if (!response.success) {
      throw new Error(`Failed to list Google Sheets: ${response.status}`);
    }

    // Transform Google Sheets files into TablesList format
    const tables: TablesList = response.data.files.map((file) => ({
      id: file.id,
      name: file.name,
      data: {
        mimeType: file.mimeType,
        createdTime: file.createdTime,
        modifiedTime: file.modifiedTime,
        webViewLink: file.webViewLink,
      },
    }));

    return tables;
  } catch (error) {
    console.error("Error listing Google Sheets:", error);
    return [];
  }
}
