import {
  Client,
  type CreateDatabaseResponse,
  type DatabaseObjectResponse,
  type GetPageResponse,
  type PageObjectResponse,
} from "@notionhq/client";
import type { TObject, TProperties } from "@sinclair/typebox";
import { nanoid } from "nanoid";
import type { ListPagesResponse, NotionOptions, NotionPage, NotionPages } from "./types";

const MAX_CALL = 10;
const MAX_PAGES = 1000;

export type { CreateDatabaseResponse, DatabaseObjectResponse, ListPagesResponse };

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

async function searchPages(
  client: Client,
  pages: NotionPages,
  parameters: {
    maxResults?: number;
    maxCalls?: number;
  },
  offset?: string,
  resultIndex?: number,
): Promise<ListPagesResponse> {
  const nextIndex = resultIndex ? resultIndex + 1 : 1;
  // Notion API has a hard limit of 300 results (3 requests of 100 results)
  if (nextIndex > (parameters?.maxCalls ?? MAX_CALL)) {
    return {
      status: "max_call_reached",
      pages,
    };
  }
  try {
    const response = await client.search({
      filter: {
        property: "object",
        value: "page",
      },
      start_cursor: offset,
      page_size: 100, // default
    });
    if (!response) {
      return {
        status: "error",
        pages,
      };
    }
    for (const d in response.results) {
      const p = response.results[d] as PageObjectResponse;

      if (p.parent.type !== "database_id") {
        const page = {
          id: p.id,
          name:
            p.properties.title &&
            p.properties.title.type === "title" &&
            Array.isArray(p.properties.title.title) &&
            p.properties.title.title[0]?.plain_text
              ? p.properties.title.title[0].plain_text
              : "No Title",
        };
        pages.push(page);
        if (pages.length >= (parameters?.maxResults ?? MAX_PAGES)) {
          return {
            status: "max_pages_reached",
            pages: pages,
          };
        }
      }
    }
    if (response.has_more && response.next_cursor) {
      const moreResults = await searchPages(client, pages, parameters, response.next_cursor, nextIndex);
      if (moreResults.status !== "success") {
        return {
          status: moreResults.status,
          pages: pages,
        };
      }
      return moreResults;
    }
  } catch (error) {
    console.error("Error searching Notion pages:", error);
  }
  return {
    status: "success",
    pages,
  };
}

export async function listPages(
  accessToken: string,
  parameters?: {
    maxResults?: number;
    maxCalls?: number;
  },
): Promise<ListPagesResponse> {
  try {
    const client = new Client({
      auth: accessToken,
    });

    const response = await searchPages(client, [], { ...parameters });
    return response;
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
              name: fieldName,
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

export async function checkPage({
  pageId,
  accessToken,
}: {
  pageId: string;
  accessToken: string;
}): Promise<NotionPage | undefined> {
  const client = new Client({
    auth: accessToken,
  });
  try {
    const response = (await client.pages.retrieve({ page_id: pageId })) as GetPageResponse;
    if (!response) {
      console.log("Failed to retrieve Notion page");
      return;
    }
    if (response) {
      // Convert the complex Notion response to a simple type
      const page = response as PageObjectResponse;
      return {
        id: page.id,
        name:
          page.properties.title &&
          page.properties.title.type === "title" &&
          Array.isArray(page.properties.title.title) &&
          page.properties.title.title[0]?.plain_text
            ? page.properties.title.title[0].plain_text
            : "No Title",
      };
    }
  } catch (e) {
    console.error("Error retrieving Notion page:", e);
  }
  return;
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
