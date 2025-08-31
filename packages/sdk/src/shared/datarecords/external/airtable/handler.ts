import type { Schema } from "../../types";
import getClient from "./client";
import type { AirtableOptions } from "./options";
import type { CreateAirtableTableResponse } from "./types";

export async function saveRecord(
  formData: FormData,
  options: AirtableOptions,
  accessToken: string,
): Promise<{ id: string } | null> {
  try {
    const client = getClient(accessToken);
    const records: Record<string, unknown> = {};
    for (const [key, value] of formData.entries()) {
      records[key] = value;
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

export async function createTable(
  name: string,
  schema: Schema,
  baseId: string,
  accessToken: string,
): Promise<CreateAirtableTableResponse | null> {

  const fields = Object.entries(schema.properties).map(([fieldName, field]) => {
    // Seulement 3 cas : string, number, boolean
    if (field.type === "string") {
      if (field.format === "email") {
        return {
          name: field.title,
          type: "email",
        };
      }
      if (field.format === "url") {
        return {
          name: field.title,
          type: "url",
        };
      }
      if (field.format === "date") {
        return {
          name: field.title,
          type: "date",
        };
      }
      if (field.format === "date-time") {
        return {
          name: field.title,
          type: "dateTime",
        };
      }
      if (field.metadata?.["ui:multiline"]) {
        return {
          name: field.title,
          type: "multilineText",
        };
      }
      if (field.enum) {
        return {
          name: field.title,
          type: "singleSelect",
          options: field.enum.map((value) => ({
            id: value,
            name: value,
          })),
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
      };
    }
    if (field.type === "number") {
      return {
        name: field.title,
        type: "number",
      };
    }
  });
  const data = {
    name,
    description: `Table created by Upstart for ${name}`,
    fields,
  };
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
    }>(`v0/meta/bases/${baseId}/tables`, "POST", data);

    if (!response.success) {
      throw new Error(
        `Failed to create Airtable table: ${response.status} - ${JSON.stringify(response.data)}`,
      );
    }

    return response.data as CreateAirtableTableResponse;
  } catch (error) {
    console.error("Error creating Airtable table:", error);
  }

  return null;
}
