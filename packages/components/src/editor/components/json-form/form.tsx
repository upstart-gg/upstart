import type { TSchema } from "@sinclair/typebox";
import ColorField from "./fields/color";
import { LayoutField } from "./fields/layout";
import EnumField from "./fields/enum";
import ImageField from "./fields/image";
import RichTextField from "./fields/rich-text";
import { BorderField } from "./fields/border";
import { PathField, StringField } from "./fields/string";
import { NumberField, SliderField } from "./fields/number";
import SwitchField from "./fields/switch";
import { Fragment, type ReactNode } from "react";
import { sortJsonSchemaProperties } from "~/shared/utils/sort-json-schema-props";
import type { FieldProps } from "./fields/types";
import { SegmentedControl } from "@upstart.gg/style-system/system";
import { tx, css } from "@upstart.gg/style-system/twind";
import get from "lodash-es/get";
import { EffectsField } from "./fields/effects";
import type { Attributes, JSONSchemaType } from "@upstart.gg/sdk/shared/attributes";
import { PagePaddingField } from "./fields/padding";
import { TextField } from "./fields/text";
import BackgroundField from "./fields/background";
import { FlexField } from "./fields/flex";
import { Text } from "@upstart.gg/style-system/system";
import { AlignBasicField } from "./fields/align-basic";
import DatasourceField from "./fields/datasource-ref";
import DatasourceRefField from "./fields/datasource-ref";
import { GridField } from "./fields/grid";
import type { BorderSettings } from "@upstart.gg/sdk/shared/bricks/props/border";
import type { EffectsSettings } from "@upstart.gg/sdk/shared/bricks/props/effects";
import type { LayoutSettings } from "@upstart.gg/sdk/shared/bricks/props/layout";
import type { AlignBasicSettings } from "@upstart.gg/sdk/shared/bricks/props/align";
import type { TextContent, TextStyleProps } from "@upstart.gg/sdk/shared/bricks/props/text";
import type { DatasourceRef } from "@upstart.gg/sdk/shared/bricks/props/datasource";
import type { FlexSettings, GridSettings } from "@upstart.gg/sdk/shared/bricks/props/container";
import type { BackgroundSettings } from "@upstart.gg/sdk/shared/bricks/props/background";
import type { ImageProps } from "@upstart.gg/sdk/shared/bricks/props/image";

type FormComponent = { group: string; groupTitle: string; component: ReactNode };
type FormComponents = (FormComponent | { group: string; groupTitle: string; components: FormComponent[] })[];

type GetFormComponentsProps = {
  formSchema: JSONSchemaType<unknown>;
  formData: Record<string, unknown>;
  onChange: (data: Record<string, unknown>, id: string) => void;
  onSubmit?: (data: Record<string, unknown>) => void;
  submitButtonLabel?: string;
  brickId: string;
  filter?: (field: JSONSchemaType<unknown>) => boolean;
  parents?: string[];
};
/**
 * Render a JSON schema form
 */
export function getFormComponents({
  formSchema,
  formData,
  onChange,
  onSubmit,
  submitButtonLabel,
  brickId,
  filter,
  parents = [],
}: GetFormComponentsProps): FormComponents {
  formSchema = sortJsonSchemaProperties(formSchema);

  const elements = Object.entries(formSchema.properties)
    .filter(([, fieldSchema]) => (filter ? filter(fieldSchema as JSONSchemaType<unknown>) : true))
    .map(([fieldName, fieldSchema]) => {
      const field = fieldSchema as JSONSchemaType<unknown>;
      const id = parents.length ? `${parents.join(".")}.${fieldName}` : fieldName;
      const group = (field["ui:group"] ?? "other") as string;
      const groupTitle = (field["ui:group:title"] ?? "Other") as string;

      const commonProps = {
        brickId,
        schema: fieldSchema as TSchema,
        formSchema,
        formData,
        required: formSchema.properties.required?.includes(fieldName) ?? false,
        title: field.title ?? field["ui:title"],
        description: field.description ?? field["ui:description"],
        placeholder: field["ui:placeholder"],
      };

      const fieldType = (field["ui:field"] ?? field.type ?? (field.anyOf ? "anyOf" : "")) as string;

      switch (fieldType) {
        case "hidden": {
          return null;
        }
        case "color": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
          return {
            group,
            groupTitle,
            component: (
              <ColorField
                currentValue={currentValue}
                onChange={(value?: string | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "border": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as BorderSettings;
          return {
            group,
            groupTitle,
            component: (
              <BorderField
                currentValue={currentValue}
                onChange={(value: BorderSettings | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "effects": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as EffectsSettings;
          return {
            group,
            groupTitle,
            component: (
              <EffectsField
                currentValue={currentValue}
                onChange={(value: EffectsSettings | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "layout": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as LayoutSettings;
          return {
            group,
            groupTitle,
            component: (
              <LayoutField
                currentValue={currentValue}
                onChange={(value: LayoutSettings | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "align-basic": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as AlignBasicSettings;
          return {
            group,
            groupTitle,
            component: (
              <AlignBasicField
                currentValue={currentValue}
                onChange={(value: AlignBasicSettings | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "text": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as TextStyleProps;
          return {
            group,
            groupTitle,
            component: (
              <TextField
                currentValue={currentValue}
                onChange={(value: TextStyleProps | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "datasource-ref": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as DatasourceRef;
          return {
            group,
            groupTitle,
            component: (
              <DatasourceRefField
                currentValue={currentValue}
                onChange={(value: DatasourceRef | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "flex": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as FlexSettings;
          return {
            group,
            groupTitle,
            component: (
              <FlexField
                currentValue={currentValue}
                onChange={(value: FlexSettings | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "grid": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as GridSettings;
          return {
            group,
            groupTitle,
            component: (
              <GridField
                currentValue={currentValue}
                onChange={(value: GridSettings | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "padding": {
          const currentValue = (get(formData, id) ??
            commonProps.schema.default) as Attributes["$pagePadding"];
          return {
            group,
            groupTitle,
            component: (
              <PagePaddingField
                currentValue={currentValue}
                onChange={(value: Attributes["$pagePadding"] | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "background": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as BackgroundSettings;
          return {
            group,
            groupTitle,
            component: (
              <BackgroundField
                currentValue={currentValue}
                onChange={(value: BackgroundSettings | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "enum": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
          return {
            group,
            groupTitle,
            component: (
              <EnumField
                currentValue={currentValue}
                onChange={(value: string | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }
        case "image": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as ImageProps;
          return {
            group,
            groupTitle,
            component: (
              <ImageField
                currentValue={currentValue}
                onChange={(value: ImageProps | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }
        case "rich-text": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as TextContent;
          return {
            group,
            groupTitle,
            component: (
              <RichTextField
                currentValue={currentValue}
                onChange={(value: unknown | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "path": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
          return {
            group,
            groupTitle,
            component: (
              <PathField
                currentValue={currentValue}
                onChange={(value: string | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }
        case "slider": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as number;
          return {
            group,
            groupTitle,
            component: (
              <SliderField
                currentValue={currentValue}
                onChange={(value: number | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }
        case "boolean":
        case "dynamic-content-switch": // alias to "switch", but has a custom type to easily handle filtering in the inspector
        case "switch": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as boolean;
          return {
            group,
            groupTitle,
            component: (
              <SwitchField
                currentValue={currentValue}
                onChange={(value: boolean | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "string": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
          return {
            group,
            groupTitle,
            component: (
              <StringField
                currentValue={currentValue}
                onChange={(value: string | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        case "integer":
        case "number": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as number;
          return {
            group,
            groupTitle,
            component: (
              <NumberField
                currentValue={currentValue}
                onChange={(value: number | null) => onChange({ [id]: value }, id)}
                {...commonProps}
              />
            ),
          };
        }

        // Complex type
        case "object": {
          // console.log("complex object", { field });
          return {
            group,
            groupTitle,
            components: getFormComponents({
              brickId,
              formSchema: field,
              formData,
              onChange,
              onSubmit,
              parents: [...parents, fieldName],
              submitButtonLabel,
            }).filter(Boolean),
          };
        }

        case "anyOf": {
          const currentValue = (get(formData, id) ?? commonProps.schema.default) as string;
          return {
            group,
            groupTitle,
            component: (
              <EnumField
                currentValue={currentValue}
                onChange={(value: string | null) => onChange({ [id]: value }, id)}
                {...commonProps}
                options={field.anyOf}
              />
            ),
          };
        }

        // React component
        case "Function":
          return null;

        default:
          console.warn("Unknown field type", { fieldType, field });
          return null;
      }
    })
    // filter null values
    .filter(Boolean);

  console.debug("Form elements for %s", brickId, elements);

  return elements as FormComponents;
}

export function FormRenderer({
  components,
  brickId,
  previewMode,
}: { components: FormComponents; brickId: string; previewMode?: string }) {
  let currentGroup: string | null = null;

  return components.map((element, index) => {
    const node = (
      <Fragment key={`${previewMode}_${brickId}_${index}`}>
        {currentGroup !== element.group && element.groupTitle && (
          <h3
            className={tx(
              "text-sm font-semibold !dark:bg-dark-600 bg-upstart-100 px-2 py-1 sticky top-0 z-[999] -mx-3",
            )}
          >
            {element.groupTitle}
          </h3>
        )}
        <div
          className={tx("form-group flex flex-col gap-3", css`&:not(:has(div)) { display: none; }`)}
          data-group={element.group}
        >
          {"component" in element
            ? element.component
            : element.components.map((c, i) => (
                <Fragment key={`${brickId}_${index}_comp_${i}`}>{c.component}</Fragment>
              ))}
        </div>
      </Fragment>
    );
    currentGroup = element.group;
    return node;
  });
}

export function AnyOfField(props: FieldProps<unknown>) {
  const {
    schema,
    onChange,
    formSchema: formContext,
    currentValue,
    title,
    description,
    options,
    brickId,
  } = props;

  const currentOpt = "foo";

  return (
    <>
      {title && (
        <Text as="label" size="2" weight="medium">
          {title}
        </Text>
      )}
      <SegmentedControl.Root
        onValueChange={onChange}
        defaultValue={currentOpt}
        size="1"
        className="w-full !max-w-full mt-2"
        radius="large"
      >
        {(options as TSchema[])
          .filter((o) => !o["ui:hidden-option"])
          .map((option, index) => (
            <SegmentedControl.Item
              key={`${brickId}_${index}`}
              value={option.const}
              className={tx("[&_.rt-SegmentedControlItemLabel]:px-1")}
            >
              {option.title}
            </SegmentedControl.Item>
          ))}
      </SegmentedControl.Root>
      {/* {options.map((option: any, index: number) => (
        <div key={`${id}_${index}`}>{option.title}</div>
      ))} */}
    </>
  );
}
