import {
  Client,
  type CreateDatabaseResponse,
  type DatabaseObjectResponse,
  type PageObjectResponse,
} from "@notionhq/client";
import type { TObject, TProperties } from "@sinclair/typebox";
import { nanoid } from "nanoid";
import type { NotionOptions, NotionPages } from "./types";
export type { CreateDatabaseResponse, DatabaseObjectResponse };

export async function saveRecord({
  formData,
  options,
  properties,
  accessToken,
}: {
  formData: FormData;
  options: NotionOptions;
  properties: TProperties;
  accessToken: string;
}) {
  const client = new Client({
    auth: accessToken,
  });
  const notionData = buildCreatePageParameters(formData, options.properties);

  try {
    return client.pages.create({
      parent: { database_id: options.id },
      properties: {
        ...notionData,
      },
    });
  } catch (e) {
    return;
  }
}

export async function listPages(accessToken: string): Promise<unknown> {
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

    const results = [] as NotionPages;
    for (const d in pages.results) {
      const p = pages.results[d] as PageObjectResponse;

      if (p.parent.type !== "database_id") {
        const notionPageProperties = {
          id: p.id,
          name:
            p.properties.title &&
            p.properties.title.type === "title" &&
            Array.isArray(p.properties.title.title) &&
            p.properties.title.title[0]?.plain_text
              ? p.properties.title.title[0].plain_text
              : "No Title",
          // data: p.properties,
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

/**
 * In Notion, databases column are sorted by alphabetical order
 * @param schema
 * @returns
 */
function buildDatabaseProperties(schemaProperties: TProperties, requiredFields: string[] = []) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const properties: Record<string, any> = {};

  for (const [fieldName, field] of Object.entries(schemaProperties)) {
    if (field.type === "string") {
      if (fieldName in (requiredFields ?? []) && fieldName === "id") {
        properties[fieldName] = {
          title: {},
          name: fieldName,
          type: "title",
        };
      } else {
        if (field.format === "email") {
          properties[fieldName] = {
            type: "email",
            name: fieldName,
            email: {},
          };
        } else if (field.format === "uri") {
          properties[fieldName] = {
            type: "url",
            name: fieldName,
            url: {},
          };
        } else if (field.format === "date" || field.format === "date-time") {
          properties[fieldName] = {
            type: "date",
            name: fieldName,
            date: {},
          };
        } else {
          if (field.enum && Array.isArray(field.enum) && field.enum.length > 0) {
            if (field.metadata?.["ui:widget"] === "checkbox") {
              properties[fieldName] = {
                type: "multi_select",
                name: fieldName,
                multi_select: {
                  options: field.enum.map((option) => ({
                    name: option,
                  })),
                },
              };
            } else {
              properties[fieldName] = {
                type: "select",
                name: fieldName,
                select: {
                  options: field.enum.map((option) => ({
                    name: option,
                  })),
                },
              };
            }
          } else {
            properties[fieldName] = {
              rich_text: {},
              name: field.title || fieldName,
              type: "rich_text",
            };
          }
        }
      }
    } else if (field.type === "number") {
      properties[fieldName] = {
        number: {},
      };
    } else if (field.type === "boolean") {
      properties[fieldName] = {
        checkbox: {},
      };
    }
  }

  // if no id field of type title, add one
  if (!properties.id) {
    properties.id = {
      title: {},
      name: "id",
      type: "title",
    };
  }
  return properties;
}

export async function updateTable({
  id,
  newName,
  newProperties,
  accessToken,
}: {
  id: string;
  newName?: string;
  newProperties?: TProperties;
  accessToken: string;
}): Promise<NotionOptions> {
  const client = new Client({
    auth: accessToken,
  });

  const properties = newProperties ? buildDatabaseProperties(newProperties) : {};
  const response = (await client.databases.update({
    database_id: id,
    ...(newName
      ? {
          title: [
            {
              type: "text" as const,
              text: {
                content: newName,
              },
            },
          ],
        }
      : {}),
    ...(Object.keys(properties).length > 0 ? { properties } : {}),
  })) as DatabaseObjectResponse;
  if (!response) {
    throw new Error("Failed to update Notion database");
  }
  return {
    id: response.id,
    name: response.title[0]?.plain_text,
    properties: response.properties,
    url: response.url,
  };
}

export async function createTable({
  name,
  schema,
  pageId,
  accessToken,
}: {
  name: string;
  schema: TObject;
  pageId: string;
  accessToken: string;
}): Promise<NotionOptions> {
  const properties = buildDatabaseProperties(schema.properties, schema.required);
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

function buildCreatePageParameters(data: FormData, databaseProperties: NotionOptions["properties"]) {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const notionData: Record<string, any> = {};
  for (const [key, value] of data.entries()) {
    if (value === null || value === undefined || value === "") continue;
    if (key in databaseProperties) {
      switch (databaseProperties[key].type) {
        case "title":
          notionData[key] = {
            title: [
              {
                text: {
                  content: String(value),
                },
              },
            ],
          };
          break;
        case "rich_text":
          notionData[key] = {
            rich_text: [
              {
                text: {
                  content: String(value),
                },
              },
            ],
          };
          break;
        case "email":
          notionData[key] = {
            email: String(value),
          };
          break;
        case "phone_number":
          notionData[key] = {
            phone_number: String(value),
          };
          break;
        case "url":
          notionData[key] = {
            url: String(value),
          };
          break;
        case "number":
          notionData[key] = {
            number: Number(value),
          };
          break;
        case "checkbox":
          notionData[key] = {
            checkbox: value === "true" || value === "1",
          };
          break;
        case "date":
          notionData[key] = {
            date: value ? { start: String(value) } : null,
          };
          break;
        case "select":
          notionData[key] = {
            select: {
              name: String(value),
            },
          };
          break;
        case "multi_select": {
          const getValues = (value: string) => {
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
          };
          const values = getValues(String(value));
          notionData[key] = {
            multi_select: values.map((v: string) => ({
              name: v,
            })),
          };
          break;
        }
        default:
          console.warn(`Unsupported property type for key "${key}": ${databaseProperties[key].type}`);
          notionData[key] = {
            rich_text: [
              {
                text: {
                  content: String(value),
                },
              },
            ],
          };
      }
    }
  }
  if (!("id" in notionData)) {
    notionData.id = {
      title: [
        {
          text: {
            content: nanoid(5),
          },
        },
      ],
    };
  }
  return notionData;
}
