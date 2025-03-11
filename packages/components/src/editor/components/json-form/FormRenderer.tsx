import { useMemo, type ReactNode } from "react";
import { tx, css } from "@upstart.gg/style-system/twind";
import type { TObject, TProperties, TSchema } from "@sinclair/typebox";
import get from "lodash-es/get";
import { sortJsonSchemaProperties } from "~/shared/utils/sort-json-schema-props";

// Import field components
import ColorField from "./fields/color";
import { LayoutField } from "./fields/layout";
import EnumField from "./fields/enum";
import ImageField from "./fields/image";
import RichTextField from "./fields/rich-text";
import { BorderField } from "./fields/border";
import { PathField, StringField } from "./fields/string";
import { NumberField, SliderField } from "./fields/number";
import SwitchField from "./fields/switch";
import { EffectsField } from "./fields/effects";
import { PagePaddingField, type TempPadding } from "./fields/padding";
import { TextField } from "./fields/text";
import BackgroundField from "./fields/background";
import { FlexField } from "./fields/flex";
import { AlignBasicField } from "./fields/align-basic";
import DatasourceRefField from "./fields/datasource-ref";
import { GridField } from "./fields/grid";

// Import types
import type { BorderSettings } from "@upstart.gg/sdk/shared/bricks/props/border";
import type { EffectsSettings } from "@upstart.gg/sdk/shared/bricks/props/effects";
import type { LayoutSettings } from "@upstart.gg/sdk/shared/bricks/props/layout";
import type { AlignBasicSettings } from "@upstart.gg/sdk/shared/bricks/props/align";
import type { TextContent, TextStyleProps } from "@upstart.gg/sdk/shared/bricks/props/text";
import type { DatasourceRef } from "@upstart.gg/sdk/shared/bricks/props/datasource";
import type { FlexSettings, GridSettings } from "@upstart.gg/sdk/shared/bricks/props/container";
import type { BackgroundSettings } from "@upstart.gg/sdk/shared/bricks/props/background";
import type { ImageProps } from "@upstart.gg/sdk/shared/bricks/props/image";
import type { Attributes } from "@upstart.gg/sdk/shared/attributes";

interface FormRendererProps {
  brickId?: string;
  formSchema: TObject<TProperties>;
  formData: Record<string, unknown>;
  onChange: (data: Record<string, unknown>, id: string) => void;
  onSubmit?: (data: Record<string, unknown>) => void;
  submitButtonLabel?: string;
  filter?: (field: TSchema) => boolean;
  previewMode?: string;
  parents?: string[];
}

interface FormGroupProps {
  groupTitle: string;
  groupName: string;
  children: React.ReactNode;
}

const FormGroup: React.FC<FormGroupProps> = ({ groupTitle, groupName, children }) => {
  return (
    <>
      <h3
        className={tx(
          "text-sm font-semibold !dark:bg-dark-600 bg-upstart-100 px-2 py-1 sticky top-0 z-[999] -mx-3",
        )}
      >
        {groupTitle}
      </h3>
      <div
        className={tx("form-group flex flex-col gap-3", css`&:not(:has(div)) { display: none; }`)}
        data-group={groupName}
      >
        {children}
      </div>
    </>
  );
};

type FieldGroups = Record<
  string,
  {
    title: string;
    fields: ReactNode[];
  }
>;

/**
 * FormRenderer component that renders form fields based on schema
 */
export function FormRenderer({
  brickId,
  formSchema,
  formData,
  onChange,
  onSubmit,
  submitButtonLabel,
  filter,
  previewMode,
  parents = [],
}: FormRendererProps) {
  // Sort and process the form schema
  const sortedSchema = useMemo(() => sortJsonSchemaProperties(formSchema), [formSchema]);

  // Generate field components in a structured way
  const formStructure = useMemo(() => {
    // Group fields by their group property
    const fieldGroups: FieldGroups = {};

    // Process all properties in the schema
    Object.entries(sortedSchema.properties).forEach(([fieldName, fieldSchema]) => {
      const field = fieldSchema;

      // Apply filter if provided
      if (filter && field.type !== "object" && !filter(field)) {
        return;
      }

      // Build the field ID
      const id = parents.length ? `${parents.join(".")}.${fieldName}` : fieldName;

      // Get group information
      const group = (field["ui:group"] ?? "other") as string;
      const groupTitle = (field["ui:group:title"] ?? "Other") as string;

      // Initialize group if it doesn't exist
      if (!fieldGroups[group]) {
        fieldGroups[group] = {
          title: groupTitle,
          fields: [],
        };
      }

      // Common props for all field components
      const commonProps = {
        brickId,
        schema: fieldSchema,
        formSchema: sortedSchema,
        formData,
        required: sortedSchema.properties.required?.includes(fieldName) ?? false,
        title: (field.title ?? field["ui:title"]) as string | undefined,
        description: (field.description ?? field["ui:description"]) as string | undefined,
        placeholder: field["ui:placeholder"] as string | undefined,
      };

      // Determine field type
      const fieldType = (field["ui:field"] ?? field.type ?? (field.anyOf ? "anyOf" : "")) as string;
      let fieldComponent: React.ReactNode = null;

      // Render appropriate field component based on type
      switch (fieldType) {
        case "hidden":
          break;

        case "color": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
          fieldComponent = (
            <ColorField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(value?: string | null) => onChange({ [id]: value }, id)}
              {...commonProps}
            />
          );
          break;
        }

        case "border": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as BorderSettings;
          fieldComponent = (
            <BorderField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(value: BorderSettings | null) => onChange({ [id]: value }, id)}
              {...commonProps}
            />
          );
          break;
        }

        case "effects": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as EffectsSettings;
          fieldComponent = (
            <EffectsField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(value: EffectsSettings | null) => onChange({ [id]: value }, id)}
              {...commonProps}
            />
          );
          break;
        }

        case "layout": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as LayoutSettings;
          fieldComponent = (
            <LayoutField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(value: LayoutSettings | null) => onChange({ [id]: value }, id)}
              {...commonProps}
            />
          );
          break;
        }

        case "align-basic": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as AlignBasicSettings;
          fieldComponent = (
            <AlignBasicField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(value: AlignBasicSettings | null) => onChange({ [id]: value }, id)}
              {...commonProps}
            />
          );
          break;
        }

        case "text": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as TextStyleProps;
          fieldComponent = (
            <TextField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(value: TextStyleProps | null) => onChange({ [id]: value }, id)}
              {...commonProps}
            />
          );
          break;
        }

        case "datasource-ref": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as DatasourceRef;
          fieldComponent = (
            <DatasourceRefField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(value: DatasourceRef | null) => onChange({ [id]: value }, id)}
              {...commonProps}
            />
          );
          break;
        }

        case "flex": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as FlexSettings;
          fieldComponent = (
            <FlexField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(value: FlexSettings | null) => onChange({ [id]: value }, id)}
              {...commonProps}
            />
          );
          break;
        }

        case "grid": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as GridSettings;
          fieldComponent = (
            <GridField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(value: GridSettings | null) => onChange({ [id]: value }, id)}
              {...commonProps}
            />
          );
          break;
        }

        case "padding": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as TempPadding;
          fieldComponent = (
            <PagePaddingField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(value: TempPadding | null) => onChange({ [id]: value }, id)}
              {...commonProps}
            />
          );
          break;
        }

        case "background": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as BackgroundSettings;
          fieldComponent = (
            <BackgroundField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(value: BackgroundSettings | null) => onChange({ [id]: value }, id)}
              {...commonProps}
            />
          );
          break;
        }

        case "enum": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
          fieldComponent = (
            <EnumField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(value: string | null) => onChange({ [id]: value }, id)}
              {...commonProps}
            />
          );
          break;
        }

        case "image": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as ImageProps;
          fieldComponent = (
            <ImageField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(value: ImageProps | null) => onChange({ [id]: value }, id)}
              {...commonProps}
            />
          );
          break;
        }

        case "rich-text": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as TextContent;
          fieldComponent = (
            <RichTextField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(value: unknown | null) => onChange({ [id]: value }, id)}
              {...commonProps}
            />
          );
          break;
        }

        case "path": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
          fieldComponent = (
            <PathField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(value: string | null) => onChange({ [id]: value }, id)}
              {...commonProps}
            />
          );
          break;
        }

        case "slider": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as number;
          fieldComponent = (
            <SliderField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(value: number | null) => onChange({ [id]: value }, id)}
              {...commonProps}
            />
          );
          break;
        }

        case "boolean":
        case "dynamic-content-switch":
        case "switch": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as boolean;
          fieldComponent = (
            <SwitchField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(value: boolean | null) => onChange({ [id]: value }, id)}
              {...commonProps}
            />
          );
          break;
        }

        case "string": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
          fieldComponent = (
            <StringField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(value: string | null) => onChange({ [id]: value }, id)}
              {...commonProps}
            />
          );
          break;
        }

        case "integer":
        case "number": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as number;
          fieldComponent = (
            <NumberField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(value: number | null) => onChange({ [id]: value }, id)}
              {...commonProps}
            />
          );
          break;
        }

        case "object": {
          // Recursively render object fields
          fieldComponent = (
            <FormRenderer
              key={`object-${id}`}
              brickId={brickId}
              formSchema={field as TObject<TProperties>}
              formData={formData}
              onChange={onChange}
              onSubmit={onSubmit}
              submitButtonLabel={submitButtonLabel}
              filter={filter}
              previewMode={previewMode}
              parents={[...parents, fieldName]}
            />
          );
          break;
        }

        case "anyOf": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
          fieldComponent = (
            <EnumField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(value: string | null) => onChange({ [id]: value }, id)}
              {...commonProps}
              options={field.anyOf}
            />
          );
          break;
        }

        case "Function":
          break;

        default:
          console.warn("Unknown field type", { fieldType, field });
          break;
      }

      // If we have a field component, add it to the appropriate group
      if (fieldComponent) {
        fieldGroups[group].fields.push(fieldComponent);
      }
    });

    return fieldGroups;
  }, [sortedSchema, brickId, formData, filter, onChange, onSubmit, submitButtonLabel, parents, previewMode]);

  console.log({ formStructure });
  // Render the form with all groups and fields
  return (
    <>
      {Object.entries(formStructure).map(([groupName, { title, fields }]) => (
        <FormGroup key={`group-${groupName}`} groupName={groupName} groupTitle={title}>
          {fields}
        </FormGroup>
      ))}
    </>
  );
}
