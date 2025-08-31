import type { NotionOptions } from "./options";

type NotionDatabaseProperties = NotionOptions["properties"];

export function buildCreatePageParameters(data: FormData, databaseProperties: NotionDatabaseProperties) {
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
            checkbox: Boolean(value),
          };
          break;
        case "date":
          notionData[key] = {
            date: value ? { start: String(value) } : null,
          };
          break;
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
  return notionData;
}
