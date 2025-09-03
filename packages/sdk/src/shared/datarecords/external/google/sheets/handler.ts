import type { TObject, TProperties } from "@sinclair/typebox";
import getClient from "./client";
import type { GoogleSheetsOptions } from "./types";

async function downloadGoogleSheetsData(spreadsheetId: string, accessToken: string): Promise<string> {
  try {
    const client = getClient(accessToken);
    const response = await client.callDriveApi<string>(
      `https://www.googleapis.com/drive/v3/files/${spreadsheetId}/export?mimeType=text/csv`,
      "GET",
    );

    if (!response.success) {
      throw new Error(`Failed to download spreadsheet: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error downloading Google Sheets data:", error);
    throw error;
  }
}

async function uploadGoogleSheetsData(
  spreadsheetId: string,
  csvLines: string[],
  accessToken: string,
): Promise<boolean> {
  try {
    const client = getClient(accessToken);
    // Use resumable upload to ensure the content is properly converted
    const initResponse = await client.callDriveApi<string>(
      `https://www.googleapis.com/upload/drive/v3/files/${spreadsheetId}?uploadType=resumable`,
      "PATCH",
      {
        mimeType: "application/vnd.google-apps.spreadsheet",
      },
    );

    if (!initResponse.success) {
      const errorText = initResponse.data;
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
      body: csvLines.map((line) => line.replace("\r", "")).join("\n"),
    });
    return uploadResponse.ok;
  } catch (error) {
    console.error("Error uploading Google Sheets data:", error);
    throw error;
  }
}

export async function saveRecord({
  formData,
  options,
  properties,
  accessToken,
}: {
  formData: FormData;
  options: GoogleSheetsOptions;
  properties: TProperties;
  accessToken: string;
}): Promise<boolean> {
  try {
    if (!accessToken) {
      throw new Error("Access token is required");
    }

    if (!options.spreadsheetId) {
      throw new Error("Spreadsheet ID is required");
    }

    // Download existing CSV data
    const existingCsv = await downloadGoogleSheetsData(options.spreadsheetId, accessToken);
    const csvLines = existingCsv.trim().split("\n");

    // Convert FormData to a record object
    const record: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      record[key] = value;
    }

    // build new csv line using the metadata.order of properties
    const orderedHeaders = buildGoogleSheetHeaders(properties);
    const newCsvRow = orderedHeaders
      .map((header) => {
        const value = record[header]?.toString() || "";
        // Escape CSV values that contain commas, quotes, or newlines
        if (value.includes(",") || value.includes('"') || value.includes("\n")) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(",");

    // Add new rows to CSV
    csvLines.push(newCsvRow);

    return uploadGoogleSheetsData(options.spreadsheetId, csvLines, accessToken);
  } catch (error) {
    console.error("Error pushing data to Google Sheets:", error);
    return false;
  }
}

/**
 * Create a spreadsheet in Google Sheets
 * @param title
 * @param schema
 * @param accessToken
 * @returns
 */
export async function createTable({
  name,
  schema,
  accessToken,
}: {
  name: string;
  schema: TObject;
  accessToken: string;
}): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  try {
    const client = getClient(accessToken);

    // First create the file
    const createResponse = await client.callDriveApi<{ id: string }>(
      "https://www.googleapis.com/drive/v3/files",
      "POST",
      {
        name: name,
        mimeType: "application/vnd.google-apps.spreadsheet",
      },
    );

    if (!createResponse.success) {
      throw new Error(`Failed to create spreadsheet: ${createResponse.status}`);
    }

    const spreadsheetId = createResponse.data.id;

    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    const headers = buildGoogleSheetHeaders(schema.properties as TProperties);
    const headerLine = headers.join(",");

    await uploadGoogleSheetsData(spreadsheetId, [headerLine], accessToken);
    return {
      spreadsheetId,
      spreadsheetUrl,
    };
  } catch (error) {
    console.error("Error creating Google Sheets spreadsheet:", error);
    throw error;
  }
}

function buildGoogleSheetHeaders(properties: TProperties) {
  // Sort fields by metadata.order (ascending), then fields without order
  const sortedEntries = Object.entries(properties).sort(([, fieldA], [, fieldB]) => {
    const orderA = fieldA.metadata?.order;
    const orderB = fieldB.metadata?.order;

    // If both have order, sort by order value
    if (orderA !== undefined && orderB !== undefined) {
      return orderA - orderB;
    }

    // Fields with order come first
    if (orderA !== undefined && orderB === undefined) {
      return -1;
    }

    if (orderA === undefined && orderB !== undefined) {
      return 1;
    }

    // Both without order, maintain original order
    return 0;
  });

  const fields = sortedEntries.map(([fieldName, field]) => {
    return fieldName;
  });
  return fields;
}

export async function updateTable({
  spreadsheetId,
  newName,
  newProperties,
  accessToken,
}: {
  spreadsheetId: string;
  newName?: string;
  newProperties?: TProperties;
  accessToken: string;
}): Promise<void> {
  try {
    // rename spreadsheet
    if (newName) {
      const client = getClient(accessToken);
      await client.callDriveApi<string>(
        `https://www.googleapis.com/drive/v3/files/${spreadsheetId}`,
        "PATCH",
        {
          name: newName,
        },
      );
    }

    if (newProperties) {
      const newHeaders = buildGoogleSheetHeaders(newProperties);
      // const headerLine = newHeaders.join(",");

      // first, download the existing data
      const existingData = await downloadGoogleSheetsData(spreadsheetId, accessToken);

      // add new header for first line, and empty value for other
      const currentLines = existingData.split("\n");
      const csvLines = currentLines.map((line, index) => {
        if (index === 0) {
          const currentHeaders = line.split(",");
          const allHeaders = [...currentHeaders, ...newHeaders];
          return allHeaders.join(",");
        } else {
          const currentValues = line.split(",");
          const newValues = newHeaders.map(() => "");
          const updatedValues = [...currentValues, ...newValues];
          return updatedValues.join(",");
        }
      });

      // upload updated data
      await uploadGoogleSheetsData(spreadsheetId, csvLines, accessToken);
    }
  } catch (error) {
    console.error("Error updating Google Sheets spreadsheet:", error);
    throw error;
  }
}
