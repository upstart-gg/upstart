import {
  Client,
  type CreateDatabaseResponse,
  type DatabaseObjectResponse,
  type PageObjectResponse,
} from "@notionhq/client";
import type { Table, TablesList } from "../../types";
import type { NotionOptions } from "./options";
import { buildCreatePageParameters } from "./utils";
import type { TObject } from "@sinclair/typebox";
export type { CreateDatabaseResponse, DatabaseObjectResponse };

export async function saveRecord(formData: FormData, options: NotionOptions, accessToken: string) {
  const client = new Client({
    auth: accessToken,
  });
  const notionData = buildCreatePageParameters(formData, options.properties);
  const response = await client.pages.create({
    parent: { database_id: options.id },
    properties: {
      ...notionData,
    },
  });
  if (!response) {
    throw new Error("Failed to push data to Notion");
  }
  return response;
}

export async function listTables(accessToken: string): Promise<TablesList> {
  try {
    const client = new Client({
      auth: accessToken,
    });
    const databases = await client.search({
      filter: {
        property: "object",
        value: "database",
      },
    });
    const results = [] as TablesList;
    for (const d in databases.results) {
      const database = databases.results[d] as DatabaseObjectResponse;
      const notionDatabaseProperties: NotionOptions = {
        id: database.id,
        name: database.title[0]?.plain_text,
        properties: database.properties,
        url: database.url,
      };
      const table = {
        id: database.id,
        name: database.title[0]?.plain_text,
        data: notionDatabaseProperties,
      };
      results.push(table);
    }
    return results;
  } catch (error) {
    console.error("Error listing Notion databases:", error);
    throw error;
  }
}

export async function listPages(accessToken: string): Promise<TablesList> {
  try {
    const client = new Client({
      auth: accessToken,
    });

    // Alternative 1: Utiliser une requête search avec un filter composé
    const pages = await client.search({
      filter: {
        property: "object",
        value: "page",
      },
    });

    const results = [] as TablesList;
    for (const d in pages.results) {
      const p = pages.results[d] as PageObjectResponse;

      if (p.parent.type !== "database_id") {
        const notionPageProperties: Table = {
          id: p.id,
          name:
            p.properties.title &&
            p.properties.title.type === "title" &&
            Array.isArray(p.properties.title.title) &&
            p.properties.title.title[0]?.plain_text
              ? p.properties.title.title[0].plain_text
              : "No Title",
          data: p.properties,
        };
        results.push(notionPageProperties);
      }
    }
    return results;
  } catch (error) {
    console.error("Error listing Notion databases:", error);
    throw error;
  }
}

function buildDatabaseProperties(schema: TObject) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const properties: Record<string, any> = {};

  for (const [fieldName, field] of Object.entries(schema.properties)) {
    if (field.type === "string") {
      if (fieldName === schema.required?.[0]) {
        properties[fieldName] = {
          title: {},
          name: fieldName,
          type: "title",
        };
      } else {
        properties[fieldName] = {
          rich_text: {},
          name: fieldName,
          type: "rich_text",
        };
      }
    }
    if (field.type === "number") {
      properties[fieldName] = {
        number: {},
      };
    }
    if (field.type === "boolean") {
      properties[fieldName] = {
        checkbox: {},
      };
    }
  }
  return properties;
}

export async function createTable(
  name: string,
  schema: TObject,
  pageId: string,
  accessToken: string,
): Promise<NotionOptions> {
  const properties = buildDatabaseProperties(schema);
  const data = {
    parent: { type: "page_id" as const, page_id: pageId },
    title: [
      {
        type: "text" as const,
        text: {
          content: name,
        },
      },
    ],
    properties,
  };
  const client = new Client({
    auth: accessToken,
  });
  const response = (await client.databases.create(data)) as CreateDatabaseResponse;
  if (!response) {
    throw new Error("Failed to create Notion database");
  }
  const table = (await client.databases.retrieve({ database_id: response.id })) as DatabaseObjectResponse;
  if (!table) {
    throw new Error("Failed to retrieve Notion database after creation");
  }
  return {
    id: table.id,
    name: table.title[0]?.plain_text,
    properties: table.properties,
    url: table.url,
  };
}
