import type { TObject, TProperties } from "@sinclair/typebox";
import type { AirtableBases, AirtableFieldType, AirtableOptions } from "./types";

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

function getClient(token: string) {
  if (!token) {
    throw new Error("Missing Airtable API token");
  }

  return {
    async callApi<R, P extends Record<string, unknown> = Record<string, unknown>>(
      path: string,
      method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH" = "GET",
      body: P | null = null,
    ) {
      const url = `https://api.airtable.com/${path}`;
      const maxRetries = 5;
      const retryDelay = 30000; // 30 seconds

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const res = await fetch(url, {
            method,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: body ? JSON.stringify(body) : undefined,
          });

          // if 429 is rate limit exceeded
          if (res.status === 429 && attempt < maxRetries) {
            console.warn(
              `Airtable rate limit hit (429) on attempt ${attempt}/${maxRetries}. Waiting ${retryDelay / 1000}s before retry...`,
            );
            await sleep(retryDelay);
            continue; // Retry
          }

          const data = await res.json();

          // for any other response (success or definitive error)
          return {
            status: res.status,
            success: res.ok,
            data: data as R,
          };
        } catch (error) {
          // In case of network error, we also retry except on the last attempt
          if (attempt < maxRetries) {
            console.warn(
              `Network error on attempt ${attempt}/${maxRetries}. Waiting ${retryDelay / 1000}s before retry...`,
              error,
            );
            await sleep(retryDelay);
            continue;
          }
          // On the last attempt, we rethrow the error
          console.error(`Error on attempt ${attempt}/${maxRetries}:`, error);
          throw error;
        }
      }

      // If we reach here, it means we exhausted all attempts with 429
      throw new Error(`Airtable API rate limit exceeded after ${maxRetries} attempts`);
    },
  };
}

/**
 * Convert a FormData value based on Airtable field type
 */
function convertValueForAirtableField(value: string, fieldType: AirtableFieldType): unknown {
  switch (fieldType) {
    case "checkbox":
      return value === "true" || value === "1" || value.toLowerCase() === "on";

    case "number": {
      const numValue = Number(value);
      return Number.isNaN(numValue) ? value : numValue;
    }

    case "date":
    case "dateTime":
      // Airtable expects ISO format strings
      return value;

    case "email":
    case "url":
    case "singleLineText":
    case "multilineText":
      return value;

    case "singleSelect":
      return value;

    case "multipleSelects": {
      // Handle comma-separated values or JSON array strings
      if (value.startsWith("[") && value.endsWith("]")) {
        try {
          return JSON.parse(value);
        } catch {
          return [value];
        }
      }
      if (value.includes(",")) {
        return value
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v.length > 0);
      }
      return [value];
    }

    default:
      console.warn(`Unknown Airtable field type: ${fieldType}, treating as text`);
      return value;
  }
}

/**
 * Fallback conversion based on value patterns (when field type is unknown)
 */
function convertValueByPattern(value: string): unknown {
  // Handle boolean-like values
  if (value === "true" || value === "false") {
    return value === "true";
  }

  // Handle number-like values
  if (/^\d+\.?\d*$/.test(value)) {
    const numValue = Number(value);
    if (!Number.isNaN(numValue)) {
      return numValue;
    }
  }

  // Handle date formats
  if (/^\d{4}-\d{2}-\d{2}$/.test(value) || /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
    return value;
  }

  // Handle comma-separated values (potential multiple select)
  if (value.includes(",")) {
    const values = value
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);
    if (values.length > 1) {
      return values;
    }
  }

  // Default to string
  return value;
}

export async function saveRecord({
  formData,
  options,
  properties,
  accessToken,
}: {
  formData: FormData;
  options: AirtableOptions;
  properties: TProperties;
  accessToken: string;
}): Promise<{ id: string } | null> {
  try {
    const client = getClient(accessToken);
    const records: Record<string, unknown> = {};

    for (const [key, value] of formData.entries()) {
      // Skip empty values
      if (value === null || value === undefined || value === "") continue;

      // Skip Files for now as they need special handling
      if (value instanceof File) {
        console.warn(`File upload not yet supported for field: ${key}`);
        continue;
      }

      // Find the field definition in options.fields
      const fieldDef = options.fields?.find((field) => field.name === key);

      if (fieldDef) {
        // Use field type information for precise conversion
        records[key] = convertValueForAirtableField(value, fieldDef.type as AirtableFieldType);
      } else {
        // Fallback to pattern-based conversion if field definition not found
        records[key] = convertValueByPattern(value);
      }
    }
    const response = await client.callApi<{
      records: Array<{ id: string; fields: Record<string, unknown> }>;
    }>(`v0/${options.baseId}/${options.tableId}`, "POST", {
      records: [
        {
          fields: records,
        },
      ],
    });

    if (!response.success) {
      throw new Error(
        `Failed to push data to Airtable: ${response.status} - ${JSON.stringify(response.data)}`,
      );
    }

    return response.data.records[0] ? { id: response.data.records[0].id } : null;
  } catch (error) {
    console.error("Error pushing data to Airtable:", error);
  }

  return null;
}

/**
 * Build Airtable table creation data from schema
 */
function buildAirtableTableData(properties: TProperties) {
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
    // Seulement 3 cas : string, number, boolean
    if (field.type === "string") {
      if (field.format === "email") {
        return {
          name: field.title,
          type: "email",
        };
      }
      if (field.format === "uri") {
        return {
          name: field.title,
          type: "url",
        };
      }
      if (field.format === "date") {
        return {
          name: field.title,
          type: "date",
          options: {
            dateFormat: {
              name: "local",
            },
          },
        };
      }
      if (field.format === "date-time") {
        return {
          name: field.title,
          type: "dateTime",
          options: {
            dateFormat: {
              name: "local",
            },
            timeFormat: {
              name: "24hour",
            },
            timeZone: "client",
          },
        };
      }
      if (field.metadata?.["ui:multiline"]) {
        return {
          name: field.title,
          type: "multilineText",
        };
      }
      if (field.enum) {
        if (field.metadata?.["ui:widget"] === "checkbox") {
          return {
            name: field.title,
            type: "multipleSelects",
            options: {
              choices: (field.enum as Array<string>).map((value) => ({
                name: value,
              })),
            },
          };
        }
        return {
          name: field.title,
          type: "singleSelect",
          options: {
            choices: (field.enum as Array<string>).map((value) => ({
              name: value,
            })),
          },
        };
      }
      return {
        name: field.title,
        type: "singleLineText",
      };
    }
    if (field.type === "boolean") {
      return {
        name: field.title,
        type: "checkbox",
        options: {
          icon: "check",
          color: "grayBright",
        },
      };
    }
    if (field.type === "number") {
      return {
        name: field.title,
        type: "number",
        options: {
          precision: 8,
        },
      };
    }
  });

  return fields;
}

export async function createTable({
  name,
  schema,
  baseId,
  accessToken,
}: {
  name: string;
  schema: TObject;
  baseId: string;
  accessToken: string;
}): Promise<AirtableOptions | null> {
  const fields = buildAirtableTableData(schema.properties);
  const tableCreationData = {
    name,
    description: `Table created by Upstart for ${name}`,
    fields: fields,
  };
  // console.dir(data);
  try {
    const client = getClient(accessToken);
    const response = await client.callApi<{
      id: string;
      name: string;
      description: string;
      primaryFieldId: string;
      fields: Array<{
        id: string;
        name: string;
        type: string;
      }>;
    }>(`v0/meta/bases/${baseId}/tables`, "POST", tableCreationData);

    if (!response.success) {
      console.error(
        "Error while creating Airtable table with:",
        JSON.stringify(tableCreationData, null, 2),
        "from schema: ",
        JSON.stringify(schema, null, 2),
      );
      throw new Error(
        `Failed to create Airtable table: ${response.status} - ${JSON.stringify(response.data)}`,
      );
    }

    return {
      tableId: response.data.id,
      fields: response.data.fields,
      tableName: response.data.name,
      externalUrl: `https://airtable.com/${baseId}/${response.data.id}`,
    } as AirtableOptions;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unknown error occurred while creating Airtable table", error);
    }
    throw error;
  }
}

export async function updateTable({
  baseId,
  tableId,
  newName,
  newProperties,
  accessToken,
}: {
  baseId: string;
  tableId: string;
  newName: string;
  newProperties?: TProperties;
  accessToken: string;
}): Promise<AirtableOptions | null> {
  const client = getClient(accessToken);
  if (newProperties) {
    try {
      const fields = buildAirtableTableData(newProperties);
      for (const field of fields) {
        const response = await client.callApi<{
          id: string;
          name: string;
          description: string;
          type: string;
        }>(`v0/meta/bases/${baseId}/tables/${tableId}/fields`, "POST", field);
        if (!response.success) {
          console.error("Error while adding field to Airtable table with:", JSON.stringify(field, null, 2));
          throw new Error(
            `Failed to update Airtable table: ${response.status} - ${JSON.stringify(response.data)}`,
          );
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Unknown error occurred while updating Airtable table", error);
      }
      throw error;
    }
  }

  try {
    const tableUpdateData = {
      name: newName,
      description: `Table updated by Upstart for ${newName}`,
    };
    const response = await client.callApi<{
      id: string;
      name: string;
      description: string;
      primaryFieldId: string;
      fields: Array<{
        id: string;
        name: string;
        type: string;
      }>;
    }>(`v0/meta/bases/${baseId}/tables/${tableId}`, "PATCH", tableUpdateData);

    if (!response.success) {
      console.error("Error while updating Airtable table with:", JSON.stringify(tableUpdateData, null, 2));
      throw new Error(
        `Failed to update Airtable table: ${response.status} - ${JSON.stringify(response.data)}`,
      );
    }

    return {
      tableId: response.data.id,
      fields: response.data.fields,
      tableName: response.data.name,
      externalUrl: `https://airtable.com/${baseId}/${response.data.id}`,
    } as AirtableOptions;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unknown error occurred while creating Airtable table", error);
    }
    throw error;
  }
}

export async function fetchAirtableBases(accessToken: string): Promise<AirtableBases> {
  try {
    const client = getClient(accessToken);
    const response = await client.callApi<{
      bases: AirtableBases;
    }>("v0/meta/bases");

    if (response.success) {
      return response.data.bases;
    } else {
      throw new Error(`Failed to fetch bases: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching Airtable bases:", error);
    return [];
  }
}
