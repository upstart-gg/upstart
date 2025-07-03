import type { TSchema } from "@sinclair/typebox";

export interface BaseFieldProps {
  fieldName: string;
  fieldSchema: TSchema;
  value: unknown;
  onChange: (value: unknown) => void;
  title: string;
  required: boolean;
  description?: string;
}
