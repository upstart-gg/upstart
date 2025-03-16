import type { ReactNode } from "react";
import type { TObject, TProperties, TSchema } from "@sinclair/typebox";
import get from "lodash-es/get";

// Import field components
import ColorField from "./fields/color";
import EnumField from "./fields/enum";
import ImageField from "./fields/image";
import { BorderField } from "./fields/border";
import { PathField, StringField } from "./fields/string";
import { NumberField, SliderField } from "./fields/number";
import SwitchField from "./fields/switch";
import { PagePaddingField, type TempPadding } from "./fields/padding";
import BackgroundField from "./fields/background";
import { FlexField } from "./fields/flex";
import { AlignBasicField } from "./fields/align-basic";
import DatasourceRefField from "./fields/datasource-ref";
import { GridField } from "./fields/grid";

// Import types
import type { BorderSettings } from "@upstart.gg/sdk/shared/bricks/props/border";
import type { AlignBasicSettings } from "@upstart.gg/sdk/shared/bricks/props/align";
import type { DatasourceRefSettings } from "@upstart.gg/sdk/shared/bricks/props/datasource";
import type { FlexSettings, GridSettings } from "@upstart.gg/sdk/shared/bricks/props/container";
import type { BackgroundSettings } from "@upstart.gg/sdk/shared/bricks/props/background";
import type { ImageProps } from "@upstart.gg/sdk/shared/bricks/props/image";

export interface FieldProps {
  brickId?: string;
  schema: TSchema;
  formSchema: TObject<TProperties>;
  formData: Record<string, unknown>;
  required: boolean;
  title?: string;
  description?: string;
  placeholder?: string;
}

export interface FieldFactoryOptions {
  brickId?: string;
  fieldName: string;
  fieldSchema: TSchema;
  formSchema: TObject<TProperties>;
  formData: Record<string, unknown>;
  id: string;
  onChange: (data: Record<string, unknown>, id: string) => void;
  parents?: string[];
}

export interface GroupedFields {
  [groupName: string]: {
    title: string;
    fields: ReactNode[];
  };
}

// Helper function to get field group information
export function getFieldGroupInfo(field: TSchema): { group: string; groupTitle: string } {
  const group = (field["ui:group"] ?? "other") as string;
  const groupTitle = (field["ui:group:title"] ?? "Other") as string;

  return { group, groupTitle };
}

// Helper function to get common props for fields
export function getCommonFieldProps(options: FieldFactoryOptions, fieldSchema: TSchema): FieldProps {
  const { brickId, fieldName, formSchema, formData } = options;
  return {
    brickId,
    schema: fieldSchema,
    formSchema,
    formData,
    required: formSchema.properties.required?.includes(fieldName) ?? false,
    title: (fieldSchema.title ?? fieldSchema["ui:title"]) as string | undefined,
    description: (fieldSchema.description ?? fieldSchema["ui:description"]) as string | undefined,
    placeholder: fieldSchema["ui:placeholder"] as string | undefined,
  };
}

// Main function to create a field component based on type
export function createFieldComponent(options: FieldFactoryOptions): ReactNode {
  const { brickId, fieldName, fieldSchema, formSchema, formData, id, onChange } = options;

  const commonProps = getCommonFieldProps(
    {
      brickId,
      fieldName,
      fieldSchema,
      formSchema,
      formData,
      id,
      onChange,
    },
    fieldSchema,
  );

  // Determine field type
  const fieldType = (fieldSchema["ui:field"] ??
    fieldSchema.type ??
    (fieldSchema.anyOf ? "anyOf" : "")) as string;

  switch (fieldType) {
    case "hidden":
      return null;

    case "color": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
      return (
        <ColorField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value?: string | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "border": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as BorderSettings;
      return (
        <BorderField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: BorderSettings | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "align-basic": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as AlignBasicSettings;
      return (
        <AlignBasicField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: AlignBasicSettings | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "datasource-ref": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as DatasourceRefSettings;
      return (
        <DatasourceRefField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: DatasourceRefSettings | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "flex": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as FlexSettings;
      return (
        <FlexField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: FlexSettings | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "grid": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as GridSettings;
      return (
        <GridField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: GridSettings | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "padding": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as TempPadding;
      return (
        <PagePaddingField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: TempPadding | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "background": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as BackgroundSettings;
      return (
        <BackgroundField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: BackgroundSettings | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "enum": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
      return (
        <EnumField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: string | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "image": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as ImageProps;
      return (
        <ImageField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: ImageProps | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "path": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
      return (
        <PathField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: string | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "slider": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as number;
      return (
        <SliderField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: number | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "boolean":
    case "dynamic-content-switch":
    case "switch": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as boolean;
      return (
        <SwitchField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: boolean | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "string": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
      return (
        <StringField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: string | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "integer":
    case "number": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as number;
      return (
        <NumberField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: number | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "anyOf": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
      return (
        <EnumField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: string | null) => onChange({ [id]: value }, id)}
          {...commonProps}
          options={fieldSchema.anyOf}
        />
      );
    }

    case "Function":
      return null;

    default:
      console.warn("Unknown field type", { fieldType, fieldSchema });
      return null;
  }
}

// Process schema to create grouped fields
export function processObjectSchemaToFields(
  schema: TObject<TProperties>,
  formData: Record<string, unknown>,
  onChange: (data: Record<string, unknown>, id: string) => void,
  options: {
    brickId?: string;
    filter?: (field: TSchema) => boolean;
    parents?: string[];
  },
): ReactNode[] {
  console.log({ schema, formData, onChange, options });
  const { brickId, filter, parents = [] } = options;
  const fields: ReactNode[] = [];

  Object.entries(schema.properties).forEach(([fieldName, fieldSchema]) => {
    const field = fieldSchema;

    // Apply filter if provided
    if (filter && field.type !== "object" && !filter(field)) {
      return;
    }

    // Build the field ID
    const id = parents.length ? `${parents.join(".")}.${fieldName}` : fieldName;

    // Handle object type differently
    // if (field.type === "object" && field["ui:field"] !== "object") {
    //   console.log("Skipping object field", field);
    //   // This is just a placeholder for recursive field rendering
    //   // The actual rendering happens in FormRenderer
    //   return;
    // }

    console.log("Using field %o", field);

    // Create field component
    const fieldComponent = createFieldComponent({
      brickId,
      fieldName,
      fieldSchema: field,
      formSchema: schema,
      formData,
      id,
      onChange,
      parents,
    });

    // If we have a field component, add it to the appropriate group
    if (fieldComponent) {
      fields.push(fieldComponent);
    }
  });

  return fields;
}

function shemaToField(schema: TSchema) {}
