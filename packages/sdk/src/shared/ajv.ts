import Ajv, { type ErrorObject } from "ajv";
import addFormats from "ajv-formats";

export type { JSONSchemaType, AnySchemaObject, SchemaObject, JSONType } from "ajv";

export const ajv = new Ajv({
  useDefaults: true,
  strictSchema: false,
  validateSchema: false,
  coerceTypes: true,
  allErrors: true,
  inlineRefs: false,
});

export const jsonStringsSupportedFormats = [
  "date-time",
  "time",
  "date",
  "email",
  "hostname",
  "ipv4",
  "ipv6",
  "uri",
  "uri-reference",
  "uuid",
  "uri-template",
  "json-pointer",
  "relative-json-pointer",
  "regex",
] as const;

// Add formats to Ajv
addFormats(ajv, [...jsonStringsSupportedFormats]);

ajv.addFormat("date-object", {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  validate: (data: any) => data instanceof Date && !Number.isNaN(data.getTime()),
  async: false,
});

ajv.addFormat("richtext", {
  validate: (data: string) => typeof data === "string",
  async: false,
});

ajv.addFormat("markdown", {
  validate: (data: string) => typeof data === "string",
  async: false,
});

ajv.addFormat("multiline", {
  validate: (data: string) => typeof data === "string",
  async: false,
});

ajv.addFormat("password", {
  validate: (data: string) => typeof data === "string",
  async: false,
});

export function serializeAjvErrors(errors: ErrorObject[] | null | undefined): string {
  if (!errors || errors.length === 0) {
    return "Unknown validation error";
  }
  return errors
    .map((error) => {
      const { instancePath, message, params } = error;
      const path = instancePath || "root";
      const details = Object.entries(params || {})
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
      return `${path} ${message} (${details})`;
    })
    .join("; ");
}
