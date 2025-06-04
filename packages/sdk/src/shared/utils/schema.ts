import type { JSONSchemaType } from "ajv";
import {
  Type,
  Kind,
  type TSchema,
  type TUnion,
  type TObject,
  type TArray,
  type TTuple,
  type TOptional,
  type TReadonly,
  TLiteral,
  type UnsafeOptions,
} from "@sinclair/typebox";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function typeboxSchemaToJSONSchema<T extends Record<string, any>>(schema: TObject): JSONSchemaType<T> {
  return JSON.parse(JSON.stringify(schema));
}

type StringEnumOptions = Partial<UnsafeOptions> & {
  enumNames?: string[];
};

export const StringEnum = <T extends string[]>(values: [...T], options: StringEnumOptions = {}) =>
  Type.Unsafe<T[number]>({
    type: "string",
    enum: values,
    ...options,
  });
/**
 * Vertex AI does not support unions in the schema.
 * This function rewrites the schema to use enums instead of unions.
 * It will replace all unions in the schema with enums
 * @param schema
 */
export function rewriteSchemaUnionsToEnums<T extends TArray | TObject>(schema: T): T {
  function processSchema(node: TSchema): TSchema {
    // Handle unions
    if (node[Kind] === "Union") {
      const unionNode = node as TUnion;

      // Extract literal values from union members
      const enumValues: string[] = [];
      let allLiterals = true;

      for (const member of unionNode.anyOf) {
        if (member[Kind] === "Literal" && typeof member.const === "string") {
          enumValues.push(member.const);
        } else {
          allLiterals = false;
          break;
        }
      }

      // If all union members are string literals, convert to enum
      if (allLiterals && enumValues.length > 0) {
        return StringEnum(enumValues as [...string[]], {
          ...(node.title ? { title: node.title } : {}),
          ...(node.description ? { description: node.description } : {}),
        });
      }

      // Otherwise, keep the union but process its members
      return Type.Union(
        unionNode.anyOf.map((member) => processSchema(member)),
        node,
      );
    }

    // Handle objects
    if (node[Kind] === "Object") {
      const objectNode = node as TObject;
      const processedProperties: Record<string, TSchema> = {};

      for (const [key, value] of Object.entries(objectNode.properties)) {
        processedProperties[key] = processSchema(value);
      }

      return Type.Object(processedProperties, {
        ...node,
        additionalProperties: objectNode.additionalProperties,
        required: objectNode.required,
      });
    }

    // Handle arrays
    if (node[Kind] === "Array") {
      const arrayNode = node as TArray;
      return Type.Array(processSchema(arrayNode.items), node);
    }

    // Handle tuples
    if (node[Kind] === "Tuple") {
      const tupleNode = node as TTuple;
      return Type.Tuple(tupleNode.items?.map((item) => processSchema(item)) || [], node);
    }

    // Handle optional
    if (node[Kind] === "Optional") {
      const optionalNode = node as TOptional<TSchema>;
      return Type.Optional(processSchema(optionalNode.nested));
    }

    // Handle readonly
    if (node[Kind] === "Readonly") {
      const readonlyNode = node as TReadonly<TSchema>;
      return Type.Readonly(processSchema(readonlyNode.nested));
    }

    // Return other types as-is
    return node;
  }

  return processSchema(schema) as T;
}
