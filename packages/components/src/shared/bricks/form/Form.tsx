import type { TObject, TProperties, TSchema } from "@sinclair/typebox";
import type { AnySchemaObject } from "@upstart.gg/sdk/shared/ajv";
import { resolveSchema } from "@upstart.gg/sdk/shared/utils/schema-resolver";
import get from "lodash-es/get";
import type { FC, ReactNode } from "react";
import { useState } from "react";
import {
  BooleanField,
  DateField,
  DateTimeField,
  EmailField,
  NumberField,
  SelectField,
  StringField,
  TextareaField,
  UrlField,
  type BaseFieldProps,
} from "./Fields";

// Helper function to detect datarecord field types
function getDatarecordFieldType(schema: TSchema): string | null {
  // Si c'est un enum, c'est un select
  if (schema.enum && Array.isArray(schema.enum) && schema.enum.length > 0) {
    return "datarecord-select";
  }

  // Si c'est un champ multiline
  if (schema.type === "string" && !schema.format && schema.metadata?.["ui:multiline"]) {
    return "datarecord-textarea";
  }

  // Recherche par type et format
  if (schema.type === "string") {
    switch (schema.format) {
      case "email":
        return "datarecord-email";
      case "uri":
        return "datarecord-url";
      case "date":
        return "datarecord-date";
      case "date-time":
        return "datarecord-datetime";
      default:
        return "datarecord-string";
    }
  }

  if (schema.type === "number") {
    return "datarecord-number";
  }

  if (schema.type === "boolean") {
    return "datarecord-boolean";
  }

  return null;
}

// Helper function to create datarecord field components
function createDatarecordFieldComponent(
  fieldType: string,
  fieldName: string,
  fieldSchema: TSchema,
  formSchema: TObject<TProperties>,
  formData: Record<string, unknown>,
  id: string,
  onChange: (data: Record<string, unknown>, id: string) => void,
): ReactNode {
  const currentValue = get(formData, id) ?? fieldSchema.default;
  const required = Array.isArray(formSchema.required) ? formSchema.required.includes(fieldName) : false;
  const title = (fieldSchema.title ?? fieldSchema["ui:title"]) as string | undefined;
  const description = (fieldSchema.description ?? fieldSchema["ui:description"]) as string | undefined;

  const datarecordProps: BaseFieldProps = {
    fieldName,
    fieldSchema,
    value: currentValue,
    onChange: (value: unknown) => onChange({ [id]: value }, id),
    title: title || fieldName,
    required,
    description,
  };

  switch (fieldType) {
    case "datarecord-string":
      return <StringField key={`field-${id}`} {...datarecordProps} />;
    case "datarecord-textarea":
      return <TextareaField key={`field-${id}`} {...datarecordProps} />;
    case "datarecord-select":
      return <SelectField key={`field-${id}`} {...datarecordProps} />;
    case "datarecord-number":
      return <NumberField key={`field-${id}`} {...datarecordProps} />;
    case "datarecord-boolean":
      return <BooleanField key={`field-${id}`} {...datarecordProps} />;
    case "datarecord-email":
      return <EmailField key={`field-${id}`} {...datarecordProps} />;
    case "datarecord-url":
      return <UrlField key={`field-${id}`} {...datarecordProps} />;
    case "datarecord-date":
      return <DateField key={`field-${id}`} {...datarecordProps} />;
    case "datarecord-datetime":
      return <DateTimeField key={`field-${id}`} {...datarecordProps} />;
    default:
      return null;
  }
}

// Function to process datarecord schema to fields
function processDatarecordSchemaToFields(
  schema: TObject<TProperties>,
  formData: Record<string, unknown>,
  onChange: (data: Record<string, unknown>, fieldPath: string) => void,
): ReactNode[] {
  const fields: ReactNode[] = [];

  Object.entries(schema.properties).forEach(([fieldName, fieldSchema]) => {
    const field = resolveSchema(fieldSchema);

    // Skip hidden fields
    if (field["ui:field"] === "hidden") {
      return;
    }

    // Apply per field filter
    if (field.metadata?.filter) {
      // field filter should be called with the current formData and the schema
      const filter = field.metadata.filter as (
        propsSchema: TObject,
        formData: Record<string, unknown>,
      ) => boolean;
      if (!filter(schema, formData)) {
        console.warn("processDatarecordSchemaToFields: Field filter returned false for", fieldName);
        return;
      }
    }

    // Build the field ID
    const id = fieldName;

    // Detect the field type
    const datarecordFieldType = getDatarecordFieldType(field);
    if (datarecordFieldType) {
      const fieldComponent = createDatarecordFieldComponent(
        datarecordFieldType,
        fieldName,
        field,
        schema,
        formData,
        id,
        onChange,
      );

      if (fieldComponent) {
        fields.push(fieldComponent);
      } else {
        console.log("!!! No datarecord field component created for", fieldName);
      }
    } else {
      console.log("!!! Unknown datarecord field type for", fieldName, field);
    }
  });

  return fields;
}

interface FormProps {
  schema?: AnySchemaObject;
  initialData?: Record<string, unknown>;
  onSubmit?: (data: Record<string, unknown>) => void;
  onChange?: (data: Record<string, unknown>) => void;
  showSubmitButton?: boolean;
  buttonLabel?: string;
}

export const Form: FC<FormProps> = ({
  schema,
  initialData = {},
  onSubmit,
  onChange,
  showSubmitButton = false,
  buttonLabel = "Submit",
}) => {
  const [formData, setFormData] = useState<Record<string, unknown>>(initialData);

  const handleFieldChange = (data: Record<string, unknown>, fieldPath: string) => {
    const newData = { ...formData, ...data };
    setFormData(newData);
    onChange?.(newData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  if (!schema || schema.type !== "object" || !schema.properties) {
    console.error("Invalid datarecord schema format", schema);
    return <div className="text-red-500 text-sm">Invalid datarecord schema format</div>;
  }

  // Convertir le schema en format TypeBox
  const typeboxSchema = schema as unknown as TObject<TProperties>;

  const fields = processDatarecordSchemaToFields(typeboxSchema, formData, handleFieldChange);

  return (
    <form onSubmit={handleSubmit} className="datarecord-form">
      <input
        id={"datarecord-id"}
        type="hidden"
        value={formData.id as string || ""}
      />
      {fields}
      {showSubmitButton && onSubmit && (
        <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "1rem" }}>
          <button type="submit" style={{ backgroundColor: "blue", color: "white" }}>
            {buttonLabel}
          </button>
        </div>
      )}
    </form>
  );
};
