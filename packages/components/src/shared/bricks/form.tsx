import type { TObject, TProperties, TSchema } from "@sinclair/typebox";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/form.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { resolveSchema } from "@upstart.gg/sdk/shared/utils/schema-resolver";
import { toast } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import get from "lodash-es/get";
import type { ReactNode } from "react";
import { forwardRef, useState } from "react";
import { useDatarecord } from "../../editor/hooks/use-datarecord";
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
} from "./form/Fields";

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

  // Sort fields by metadata.order, then by field name
  const sortedFields = Object.entries(schema.properties).sort(([aName, aSchema], [bName, bSchema]) => {
    const aField = resolveSchema(aSchema);
    const bField = resolveSchema(bSchema);

    const aOrder = aField.metadata?.order as number | undefined;
    const bOrder = bField.metadata?.order as number | undefined;

    // If both have order, sort by order
    if (aOrder !== undefined && bOrder !== undefined) {
      return aOrder - bOrder;
    }

    // If only one has order, prioritize the one with order
    if (aOrder !== undefined) return -1;
    if (bOrder !== undefined) return 1;

    // If neither has order, sort alphabetically by field name
    return aName.localeCompare(bName);
  });

  sortedFields.forEach(([fieldName, fieldSchema]) => {
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

const WidgetForm = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  const { brick } = props;
  const {
    title,
    intro,
    datarecordId,
    align = "vertical",
    padding,
    backgroundColor,
    color,
    buttonLabel,
    editable = true,
  } = brick.props;

  const { datarecord, schema, error } = useDatarecord(datarecordId);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const handleFieldChange = (data: Record<string, unknown>, fieldPath: string) => {
    const newData = { ...formData, ...data };
    setFormData(newData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    console.log("editable value", editable);
    e.preventDefault();
    if (editable) {
      console.warn("Form is editable, submission is disabled");
      // toast.success("Edit mode is enabled, form submission is disabled");
      toast(`This form is not clickable in edit mode but will lead to form submission when published.`, {
        style: {
          minWidth: "max-content",
        },
      });
      return;
    }

    console.log("Form submitted:", formData);

    // Créer un FormData à partir des données du formulaire
    const data = new FormData(e.target as HTMLFormElement);
    fetch(window.location.href, {
      method: "POST",
      body: data,
    })
      .then((response) => {
        if (response.ok) {
          console.log("Form submitted successfully");
        } else {
          console.error("Form submission failed");
        }
      })
      .catch((error) => {
        console.error("Form submission error:", error);
      });
  };

  if (error) {
    return (
      <div ref={ref} className="p-4 border border-red-200 bg-red-50 text-red-600 rounded">
        Error loading datarecord: {error.message}
      </div>
    );
  }

  if (!datarecord || !schema) {
    return (
      <div ref={ref} className="p-4 border border-gray-200 bg-gray-50 text-gray-600 rounded">
        {datarecordId ? "Loading datarecord..." : "Please select a datarecord to display the form"}
      </div>
    );
  }

  if (!schema || schema.type !== "object" || !schema.properties) {
    console.error("Invalid datarecord schema format", schema);
    return <div className="text-red-500 text-sm">Invalid datarecord schema format</div>;
  }

  // Convertir le schema en format TypeBox
  const typeboxSchema = schema as unknown as TObject<TProperties>;
  const fields = processDatarecordSchemaToFields(typeboxSchema, formData, handleFieldChange);

  return (
    <div
      ref={ref}
      className={tx("max-w-full")}
      style={{
        padding,
        backgroundColor,
        color,
      }}
    >
      {title && <h2 className="form-title text-xl font-semibold mb-4">{title}</h2>}
      {intro && <p className="form-intro text-gray-600 mb-6">{intro}</p>}

      <div className={tx(align === "horizontal" ? "space-x-4" : "space-y-4")}>
        <form onSubmit={handleSubmit} className="datarecord-form">
          <input id={"datarecord-id"} type="hidden" value={(formData.id as string) || ""} />
          {fields}
          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "1rem" }}>
            <button type="submit" style={{ backgroundColor: "blue", color: "white" }}>
              {buttonLabel || "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default WidgetForm;
