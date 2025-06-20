import type { TSchema } from "@sinclair/typebox";
import { ajv } from "../ajv";

export function resolveSchema(schema: TSchema) {
  if (!schema.$ref) {
    return schema;
  }
  const resolved = ajv.getSchema(schema.$ref!)?.schema;
  if (!resolved || typeof schema !== "object") {
    throw new Error(`Schema not found for reference: ${schema.$ref}`);
  }
  const { $ref, ...rest } = schema as TSchema;
  return {
    ...(resolved as object),
    ...rest,
  } as TSchema;
}
