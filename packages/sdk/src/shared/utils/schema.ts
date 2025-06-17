import { type Static, Type, type TSchema, type UnsafeOptions } from "@sinclair/typebox";
import { jsonDefault } from "json-schema-default";

type StringEnumOptions = Partial<UnsafeOptions> & {
  enumNames?: string[];
};

export const StringEnum = <T extends string[]>(values: [...T], options: StringEnumOptions = {}) =>
  Type.Unsafe<T[number]>({
    type: "string",
    enum: values,
    ...options,
  });

export function getLitteralFromEnum(schema: ReturnType<typeof StringEnum> | TSchema) {
  if (!("enum" in schema)) {
    return schema.anyOf ?? schema.oneOf;
  }
  const { enum: enumValues, enumNames } = schema as unknown as { enum: string[]; enumNames?: string[] };
  // combine to key-value pairs
  return enumValues.map((value, index) => ({
    const: value,
    title: enumNames ? enumNames[index] : value,
  }));
}

/**
 * @warning DOES NOT HANDLE ARRAYs, just OBJECTs
 */
export function getSchemaObjectDefaults<T extends TSchema>(schema: T) {
  return jsonDefault(schema) as Static<T>;
}
