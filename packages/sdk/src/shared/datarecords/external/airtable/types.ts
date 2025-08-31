import { Type, type Static } from "@sinclair/typebox";

const createAirtableTableResponseSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  description: Type.String(),
  primaryFieldId: Type.String(),
  fields: Type.Array(
    Type.Object({
      id: Type.String(),
      name: Type.String(),
      type: Type.String(),
    }),
  ),
});

export type CreateAirtableTableResponse = Static<typeof createAirtableTableResponseSchema>;
