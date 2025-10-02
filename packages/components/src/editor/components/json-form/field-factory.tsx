import type { TObject, TProperties, TSchema } from "@sinclair/typebox";
import get from "lodash-es/get";
import { Fragment, type ReactNode } from "react";
import { IoIosHelpCircleOutline } from "react-icons/io";
// Import field components
import ArrayField from "./fields/array";
import TagsField from "./fields/tags";
import BackgroundField from "./fields/background";
import BorderField from "./fields/border";
import AlignSelfField from "./fields/align-self";
import AlignItemsField from "./fields/align-items";
import JustifyContentField from "./fields/justify-content";
import ColorField from "./fields/color";
import DatasourceField from "./fields/datasource";
import DynamicField from "./fields/loop";
import PageQueriesField from "./fields/page-queries";
import QueriesField from "./fields/queries";
import EnumField from "./fields/enum";
import IconifyField from "./fields/iconify";
import ImageField from "./fields/image";
import { NumberField, SliderField } from "./fields/number";
import { PagePaddingField, type TempPadding } from "./fields/padding";
import { GeoAddressField, PathField, StringField, UrlOrPageIdField } from "./fields/string";
import SwitchField from "./fields/switch";

// Import types
import type { BackgroundSettings } from "@upstart.gg/sdk/shared/bricks/props/background";
import type { BorderSettings } from "@upstart.gg/sdk/shared/bricks/props/border";
import type { DeprecatedDatasourceSettings } from "@upstart.gg/sdk/shared/bricks/props/datasource";
import type { GeolocationSettings } from "@upstart.gg/sdk/shared/bricks/props/geolocation";
import type { TagsSettings } from "@upstart.gg/sdk/shared/bricks/props/tags";
import type { ImageProps } from "@upstart.gg/sdk/shared/bricks/props/image";
import type {
  AlignSelfSettings,
  AlignItemsSettings,
  JustifyContentSettings,
} from "@upstart.gg/sdk/shared/bricks/props/align";
import type { FieldFilter } from "@upstart.gg/sdk/shared/utils/schema";
import { Tooltip } from "@upstart.gg/style-system/system";
import ColorPresetField from "./fields/color-preset";
import { CssLengthField } from "./fields/css-length";
import { DatarecordField } from "./fields/datarecord";
import { fieldLabel } from "./form-class";
import { tx } from "@upstart.gg/style-system/twind";
import type { LoopSettings, QueryUseSettings } from "@upstart.gg/sdk/shared/bricks/props/dynamic";
import { usePageAttributes } from "~/editor/hooks/use-page-data";
import type { ColorPresetSettings } from "@upstart.gg/sdk/shared/bricks/props/color-preset";

export interface FieldFactoryOptions {
  brickId: string;
  fieldName: string;
  fieldSchema: TSchema;
  formSchema: TObject<TProperties>;
  formData: Record<string, unknown>;
  noDynamic?: boolean;
  id: string;
  onChange: (data: Record<string, unknown>, id: string) => void;
  parents?: string[];
}

// Helper function to get common props for fields
function getCommonFieldProps(options: FieldFactoryOptions, fieldSchema: TSchema) {
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
    noDynamic: options.noDynamic ?? false,
  };
}

// Main function to create a field component based on type
function createFieldComponent(options: FieldFactoryOptions): ReactNode {
  const { brickId, fieldName, fieldSchema, formSchema, formData, id, onChange, noDynamic } = options;
  const commonProps = getCommonFieldProps(
    {
      brickId,
      fieldName,
      fieldSchema: fieldSchema,
      formSchema,
      formData,
      id,
      noDynamic,
      onChange,
    },
    fieldSchema,
  );

  // Determine field type
  const fieldType = (fieldSchema["ui:field"] ??
    (fieldSchema.enum ? "enum" : null) ??
    fieldSchema.type ??
    (fieldSchema.anyOf ? "anyOf" : "")) as string;

  switch (fieldType) {
    case "hidden":
      return null;

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

    case "tags": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as TagsSettings;
      return (
        <TagsField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: TagsSettings | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

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

    case "color-preset": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as ColorPresetSettings;
      return (
        <ColorPresetField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value?: ColorPresetSettings | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "datarecord": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
      return (
        <DatarecordField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value?: string | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "geoaddress": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
      return (
        <GeoAddressField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: GeolocationSettings["address"] | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "datasource": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as DeprecatedDatasourceSettings;
      return (
        <DatasourceField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: DeprecatedDatasourceSettings | undefined | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "loop": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as LoopSettings;
      return (
        <DynamicField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: LoopSettings | undefined | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    // case "page-queries": {
    //   const currentValue = (get(formData, id) ?? commonProps.schema.default) as QueryUseSettings[];
    //   return (
    //     <PageQueriesField
    //       key={`field-${id}`}
    //       currentValue={currentValue}
    //       onChange={(value: QueryUseSettings[] | undefined | null) => onChange({ [id]: value }, id)}
    //       {...commonProps}
    //     />
    //   );
    // }

    case "queries": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as QueryUseSettings[];
      return (
        <QueriesField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value) => {}}
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

    case "align-self": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as AlignSelfSettings;
      return (
        <AlignSelfField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: AlignSelfSettings | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "align-items": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as AlignItemsSettings;
      return (
        <AlignItemsField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: AlignItemsSettings | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "justify-content": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as JustifyContentSettings;
      return (
        <JustifyContentField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: JustifyContentSettings | null) => onChange({ [id]: value }, id)}
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

    case "url-page-id": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
      return (
        <UrlOrPageIdField
          key={`field-${id}`}
          currentValue={currentValue}
          onChange={(value: string | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "css-length": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
      return (
        <CssLengthField
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

    case "array": {
      const rawValue = get(formData, id);
      // Only use default if the field has never been set, not when it's an empty array
      const currentValue =
        rawValue !== undefined ? (Array.isArray(rawValue) ? rawValue : []) : commonProps.schema.default || [];

      // For simple arrays (like variants), we can create a field for each item
      // or use a specialized component depending on the content
      if (fieldSchema.items) {
        const itemSchema = fieldSchema.items;

        // For arrays of objects, use the generic ArrayField
        if (itemSchema.type === "object") {
          // Use generic ArrayField for all object arrays
          return (
            <ArrayField
              key={`field-${id}`}
              currentValue={currentValue}
              onChange={(newArray: unknown[] | null) => onChange({ [id]: newArray || [] }, id)}
              itemSchema={itemSchema}
              fieldName={fieldName}
              id={id}
              parents={options.parents}
              {...commonProps}
            />
          );
        }

        // For arrays of Union/Literal (like button variants), create a multi-select field
        if (
          itemSchema.anyOf ||
          itemSchema.oneOf ||
          itemSchema.enum ||
          (itemSchema as { union?: unknown[] }).union
        ) {
          const options =
            itemSchema.anyOf ||
            itemSchema.oneOf ||
            itemSchema.enum ||
            (itemSchema as { union?: unknown[] }).union ||
            [];

          // Fallback to original multi-select buttons for non-variant arrays
          return (
            <div key={`field-${id}`} className="space-y-2">
              {commonProps.title && (
                <label className="block text-sm font-medium text-gray-700 mb-1">{commonProps.title}</label>
              )}
              <div className="flex flex-wrap gap-1">
                {options.map((option: string | { const: string; title?: string }) => {
                  const value = typeof option === "string" ? option : option.const;
                  const title = typeof option === "string" ? value : option.title || option.const;
                  const isSelected = currentValue.includes(value);

                  return (
                    <button
                      key={value}
                      type="button"
                      className={`px-2 py-1 text-xs rounded border transition-colors ${
                        isSelected
                          ? "bg-upstart-500 text-white border-upstart-500"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                      }`}
                      onClick={() => {
                        const newValue = isSelected
                          ? currentValue.filter((v: string) => v !== value)
                          : [...currentValue, value];
                        onChange({ [id]: newValue }, id);
                      }}
                    >
                      {title}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        }

        // For arrays of primitive types, use the generic ArrayField
        return (
          <ArrayField
            key={`field-${id}`}
            currentValue={currentValue}
            onChange={(newArray: unknown[] | null) => onChange({ [id]: newArray || [] }, id)}
            itemSchema={itemSchema}
            fieldName={fieldName}
            id={id}
            parents={options.parents}
            {...commonProps}
          />
        );
      }

      // Fallback for arrays without items schema
      console.warn("Array field without items schema:", fieldName, fieldSchema);
      return null;
    }

    case "iconify": {
      const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
      const defaultCollection = commonProps.schema["ui:default-icon-collection"] as string | undefined;
      return (
        <IconifyField
          key={`field-${id}`}
          currentValue={currentValue}
          defaultCollection={defaultCollection}
          onChange={(value: string | null) => onChange({ [id]: value }, id)}
          {...commonProps}
        />
      );
    }

    case "Function":
      return null;

    // case "object": {
    //   console.log("Unknown schema", schema.pro);

    //   const tmpSchema = schema as TObject;

    //   return Object.entries(tmpSchema.properties).map(([keyBy, prop]) => {
    //     return createFieldComponent({
    //       ...options,
    //       id: `field-${options.id}-$`,
    //       fieldName: prop.title ?? "FOOOO",
    //       fieldSchema: {
    //         ...prop,
    //         "ui:group": tmpSchema["ui:group"],
    //       },
    //     });
    //   });
    // }

    default:
      console.log("!!! Unknown field type: %s", fieldType);
      console.log("Field schema", fieldSchema);
      return null;
  }
}

type ObjectFieldsProps = {
  schema: TObject<TProperties>;
  formData: Record<string, unknown>;
  formSchema: TObject<TProperties>;
  noDynamic?: boolean;
  onChange: (data: Record<string, unknown>, propPath: string) => void;
  options: {
    brickId: string;
    filter?: (field: TSchema) => boolean;
    parents?: string[];
  };
};

// Process schema to create grouped fields
export default function ObjectFields({
  schema,
  formData,
  formSchema,
  onChange,
  options,
  noDynamic,
}: ObjectFieldsProps) {
  const pageAttributes = usePageAttributes();
  const { brickId, filter, parents = [] } = options;
  const fields: ReactNode[] = [];

  Object.entries(schema.properties).forEach(([fieldName, fieldSchema]) => {
    const field = fieldSchema;

    // Apply global filter if provided
    if (filter && field.type !== "object" && !filter(field)) {
      console.warn("ObjectFields: Ignoring field", field);
      return;
    }

    // Apply per field filter
    if (field.metadata?.filter) {
      // field filter should be called with the current formData and the schema
      const filter = field.metadata.filter as FieldFilter;
      if (!filter(formSchema, formData, pageAttributes)) {
        return;
      }
    }

    // Build the field ID
    // For array items, use just the fieldName
    // Detect if we're in an array context by checking if the last parent contains brackets
    const isArrayItem = parents.length > 0 && parents[parents.length - 1].includes("[");
    const id = !isArrayItem && parents.length > 0 ? `${parents.join(".")}.${fieldName}` : fieldName;

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
      noDynamic,
    });

    if (fieldComponent) {
      fields.push(fieldComponent);
    }
  });

  return fields;
}

export function FieldTitle({
  title,
  description,
  className,
  containerClassName,
  htmlFor,
  withIcon = true,
}: {
  title?: string;
  description?: string;
  className?: string;
  containerClassName?: string;
  withIcon?: boolean;
  htmlFor?: string;
}) {
  if (!title) return null;
  return (
    <div className={tx("flex items-center text-nowrap basis-[45%]", containerClassName)}>
      {description ? (
        withIcon ? (
          <label
            className={tx(
              className,
              fieldLabel,
              " underline-offset-4 no-underline decoration-upstart-300 decoration-dotted cursor-default",
            )}
            htmlFor={htmlFor}
          >
            <Tooltip
              content={<span className="block text-sm p-1">{description}</span>}
              className="!z-[10000]"
              align="start"
            >
              <span className="cursor-help flex items-center">
                {title}
                <IoIosHelpCircleOutline className="ml-1 text-[110%] opacity-50" />
              </span>
            </Tooltip>
          </label>
        ) : (
          <Tooltip
            content={<span className="block text-sm p-1">{description}</span>}
            className="!z-[10000]"
            align="start"
          >
            <label
              className={tx(
                className,
                fieldLabel,
                "underline-offset-4 no-underline hover:underline decoration-upstart-300 decoration-dotted cursor-default",
              )}
              htmlFor={htmlFor}
            >
              {title}
            </label>
          </Tooltip>
        )
      ) : (
        <label htmlFor={htmlFor} className={tx(className, fieldLabel)}>
          {title}
        </label>
      )}
    </div>
  );
}
