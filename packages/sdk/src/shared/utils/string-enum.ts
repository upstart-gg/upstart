import { TypeRegistry, Kind, type TSchema, type SchemaOptions, Type } from "@sinclair/typebox";

export type StringEnumOptions = Partial<SchemaOptions> & {
  enumNames?: string[];
};

// -------------------------------------------------------------------------------------
// TStringEnum
// -------------------------------------------------------------------------------------
export interface TStringEnum<T extends readonly string[]> extends TSchema {
  [Kind]: "StringEnum";
  static: T[number];
  enum: T;
}

function StringEnumCheck(schema: TStringEnum<string[]>, value: unknown) {
  return typeof value === "string" && schema.enum.includes(value);
}

TypeRegistry.Set("StringEnum", StringEnumCheck);

// -------------------------------------------------------------------------------------
// UnionEnum
// -------------------------------------------------------------------------------------
/** `[Experimental]` Creates a Union type with a `enum` schema representation  */
export function StringEnum<T extends readonly string[]>(values: [...T], options: StringEnumOptions = {}) {
  return Type.Unsafe<T[number]>({
    [Kind]: "StringEnum",
    type: "string",
    enum: values,
    ...options,
  }) as TStringEnum<T>;
}
