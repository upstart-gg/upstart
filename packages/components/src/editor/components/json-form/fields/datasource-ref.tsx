import type { FieldProps } from "./types";
import { Text } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import { SegmentedControl, Select } from "@upstart.gg/style-system/system";
import type { DatasourceRef } from "@upstart.gg/sdk/shared/bricks/props/datasource";
import { fieldLabel } from "../form-class";
import { TObject, type TProperties, type TSchema, Type } from "@sinclair/typebox";
import { manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { useDraftHelpers, useGetBrick } from "~/editor/hooks/use-editor";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";

const allDatasources = [
  {
    id: "1",
    label: "Marketing assets",
    schema: Type.Object({
      name: Type.String({ title: "Name" }),
      source: Type.String({ title: "Source (url)", format: "uri" }),
    }),
  },
  {
    id: "2",
    label: "Vacation pictures",
    schema: Type.Object({
      location: Type.String({ title: "Location" }),
      url: Type.String({ title: "Photo URL", format: "uri" }),
      peopleCount: Type.Number({ title: "Number of people" }),
    }),
  },
  {
    id: "4",
    label: "Creations de Noël 2024",
    schema: Type.Array(
      Type.Object({
        date: Type.String({ title: "Date", format: "date" }),
        count: Type.Number({
          title: "Product count",
        }),
      }),
    ),
  },
  {
    id: "3",
    label: "Assets divers",
    schema: Type.Object({
      name: Type.String({ title: "Name" }),
      src: Type.String({ title: "Source (url)", format: "uri" }),
      count: Type.Number({
        title: "Product count",
      }),
    }),
  },
];

/**
 * Get an existing brick schema and return a schema that can be used as a child schema, e.g., a schema
 * without hidden fields and style props.
 */
function schemaToChildSchema(schema: BrickManifest) {
  console.log("schema.properties.props", schema.properties.props);
  const filteredProperties = Object.entries(schema.properties.props.properties)
    .filter(([key, value]) => {
      console.log("filtering", key, value);
      return value["ui:field"] !== "hidden";
    })
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as TSchema);
  return {
    ...schema.properties.props,
    properties: filteredProperties,
  };
}

const DatasourceRefField: React.FC<FieldProps<DatasourceRef>> = (props) => {
  const {
    onChange,
    title,
    currentValue = {
      id: "",
      useExistingDatasource: false,
      mapping: {},
    } satisfies DatasourceRef,
    brickId,
  } = props;
  const getBrickInfo = useGetBrick();
  const draftHelpers = useDraftHelpers();
  const brickInfo = getBrickInfo(brickId);

  if (!brickInfo?.props.isDynamic) {
    return null;
  }

  invariant(brickInfo, `Could not find brick info for ${brickId} in DatasourceRefField`);

  if ("childrenType" in brickInfo.props) {
    console.log("container childrenType", brickInfo.props.childrenType);
  }

  const onMappingChange = (value: Record<string, string>) => {
    onChange({ ...currentValue, mapping: value });
  };

  const brickManifest = manifests[brickInfo.type];

  const datasourceSchema: TSchema | null =
    brickManifest.properties.datasource ??
    ("childrenType" in brickInfo.props
      ? schemaToChildSchema(manifests[brickInfo.props.childrenType as keyof typeof manifests])
      : null);

  console.log("brickInfo props", { brickInfo, datasourceSchema });

  // We need to get the fields from the datasource schema. This will be used to map fields from the datasource to the schema
  // The datasource schema could be an object or an array of objects
  const schemaFields: TProperties = datasourceSchema
    ? datasourceSchema.type === "array"
      ? datasourceSchema.items?.properties
      : datasourceSchema.properties
    : {};

  const schemaRequiredFields: string[] = datasourceSchema
    ? (datasourceSchema.type === "array" ? datasourceSchema.items?.required : datasourceSchema.required) ?? []
    : [];

  // check schema "required" fields

  const compatibleDatasources = allDatasources
    .map((datasource) => {
      //
      const datasourceFields =
        datasource.schema.type === "array"
          ? datasource.schema.items?.properties
          : datasource.schema.properties;

      const datasourceRequiredFields =
        (datasource.schema.type === "array"
          ? datasource.schema.items?.required
          : datasource.schema.required) ?? [];

      // mark the datasources eligeable or not depending on their schema follwing these rules:
      // - All required fields type should match with at least one field in the schema
      // - AT least on field type should match with at least one field in the schema
      const compatible = schemaRequiredFields.every((field) => {
        return datasourceRequiredFields.some((dsField) => {
          // @ts-ignore
          return schemaFields[field] && areFieldsCompatible(datasourceFields[dsField], schemaFields[field]);
        });
      });
      // augment the datasource object with the compatible flag
      return { ...datasource, compatible };
    })
    .sort((a, b) => (a.compatible === b.compatible ? 0 : a.compatible ? -1 : 1));

  const externalDatasource = allDatasources.find((ds) => ds.id === currentValue.id);
  const externalFields = externalDatasource
    ? externalDatasource.schema.type === "array"
      ? externalDatasource.schema.items?.properties
      : externalDatasource.schema.properties
    : {};

  return (
    <div className="field field-datasource">
      <div className="flex flex-col gap-3">
        {/* Child type */}
        {brickInfo.isContainer && (
          <div className="flex flex-col gap-3">
            <h3
              className={tx(
                "text-sm font-semibold !dark:bg-dark-600 bg-upstart-100 px-2 py-1 sticky top-0 z-[999] -mx-3",
              )}
            >
              Children bricks type
            </h3>
            <Text as="p" color="gray" size="1">
              The type of children bricks that this container will contain. You can either select it here or
              drag a brick from the library onto the container.
            </Text>
            <Select.Root
              size="1"
              onValueChange={(value) => {
                draftHelpers.updateBrickProps(brickId, { childrenType: value });
              }}
            >
              <Select.Trigger radius="large" variant="surface" placeholder="Select a child type" />
              <Select.Content position="popper">
                <Select.Group>
                  {Object.entries(manifests)
                    .filter(([bType, bManifest]) => {
                      return !!bManifest.properties.repeatable.default;
                    })
                    .map(([brickType, brickManifest]) => (
                      <Select.Item key={brickType} value={brickType}>
                        {brickManifest.properties.title.const}
                      </Select.Item>
                    ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
        )}

        <h3
          className={tx(
            "text-sm font-semibold !dark:bg-dark-600 bg-upstart-100 px-2 py-1 sticky top-0 z-[999] -mx-3",
          )}
        >
          Database
        </h3>
        <div className="flex flex-col flex-1 gap-1">
          <SegmentedControl.Root
            onValueChange={(val) => {
              onChange({ ...currentValue, useExistingDatasource: val === "existing" });
            }}
            defaultValue={currentValue.useExistingDatasource ? "existing" : "new"}
            size="1"
            className="w-full !max-w-full mt-1"
            radius="large"
          >
            {[
              { value: "new", title: "Custom database" },
              { value: "existing", title: "Existing database" },
            ].map((option) => (
              <SegmentedControl.Item
                key={option.value}
                value={option.value}
                className={tx("[&_.rt-SegmentedControlItemLabel]:px-1")}
              >
                {option.title}
              </SegmentedControl.Item>
            ))}
          </SegmentedControl.Root>
        </div>

        {/* If using an existing database, we need to allow the user to select a datasource and possibly fields mapping */}
        {currentValue.useExistingDatasource && (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 flex-1 mx-px">
              <Select.Root
                value={currentValue.id}
                size="1"
                onValueChange={(value) => onChange({ ...currentValue, id: value })}
              >
                <Select.Trigger radius="large" variant="surface" placeholder="Select a database" />
                <Select.Content position="popper">
                  <Select.Group>
                    {compatibleDatasources.map((item) => (
                      <Select.Item key={item.id} value={item.id} disabled={!item.compatible}>
                        {item.label} {item.compatible ? "" : "(incompatible)"}
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </div>
            {Object.keys(externalFields).length > 0 && (
              <>
                <div className="flex flex-col flex-1 gap-3">
                  <h3
                    className={tx(
                      "text-sm font-semibold !dark:bg-dark-600 bg-upstart-100 px-2 py-1 sticky top-0 z-[999] -mx-3",
                    )}
                  >
                    Fields mapping
                  </h3>
                  <Text as="p" color="gray" size="1">
                    Map fields from the database to the brick properties. Properties marked in bold are
                    required.
                  </Text>
                  <FieldsMapper
                    externalFields={externalFields}
                    schemaFields={schemaFields}
                    schemaRequiredFields={schemaRequiredFields}
                    onChange={onMappingChange}
                    currentMapping={currentValue.mapping}
                  />
                </div>
                <div className="flex flex-col flex-1 gap-2">
                  <h3
                    className={tx(
                      "text-sm font-semibold !dark:bg-dark-600 bg-upstart-100 px-2 py-1 sticky top-0 z-[999] -mx-3",
                    )}
                  >
                    Limit results
                  </h3>
                  <SegmentedControl.Root
                    onValueChange={(val) => {
                      onChange({ ...currentValue, limit: parseInt(val) });
                    }}
                    value={(currentValue.limit ?? 10).toString()}
                    size="1"
                    className="w-full !max-w-full !mt-1"
                    radius="large"
                  >
                    {[
                      { value: "5", title: "5" },
                      { value: "10", title: "10" },
                      { value: "20", title: "20" },
                      { value: "30", title: "30" },
                      { value: "40", title: "40" },
                    ].map((option) => (
                      <SegmentedControl.Item
                        key={option.value}
                        value={option.value}
                        className={tx("[&_.rt-SegmentedControlItemLabel]:px-1")}
                      >
                        {option.title}
                      </SegmentedControl.Item>
                    ))}
                  </SegmentedControl.Root>
                </div>
              </>
            )}
          </div>
        )}

        {!currentValue.useExistingDatasource && (
          <div className="flex flex-col gap-3">
            <h3
              className={tx(
                "text-sm font-semibold !dark:bg-dark-600 bg-upstart-100 px-2 py-1 sticky top-0 z-[999] -mx-3",
              )}
            >
              Content
            </h3>
            <fieldset className="flex flex-col gap-2 border-gray-200 border rounded-md p-2">
              <label className={fieldLabel}>New entry</label>
              <div className="flex flex-col gap-1">
                {Object.entries(schemaFields).map(([fieldName, field]) => {
                  return (
                    <div className="flex gap-0.5 justify-between items-center flex-wrap" key={fieldName}>
                      <label className={tx("text-[85%] flex-1 flex-grow")}>{field.title ?? fieldName}</label>
                      <input
                        type="text"
                        // value={currentValue.data[fieldName] ?? ""}
                        onChange={(e) => {
                          // onChange({
                          //   ...currentValue,
                          //   data: { ...currentValue.data, [fieldName]: e.target.value },
                          // });
                        }}
                        className="flex-1 p-1 border border-gray-300 rounded-md"
                      />
                    </div>
                  );
                })}
              </div>
            </fieldset>
          </div>
        )}
      </div>
    </div>
  );
};

function areFieldsCompatible(field1: TSchema, field2: TSchema) {
  return field1.type === field2.type && (!field1.format || field1.format === field2.format);
}

/**
 * Display rows of fields to map between the datasource fields and the schema fields
 */
function FieldsMapper({
  currentMapping,
  externalFields,
  schemaFields,
  schemaRequiredFields,
  onChange,
}: {
  currentMapping: Record<string, string>;
  externalFields: TProperties;
  schemaFields: TProperties;
  schemaRequiredFields: string[];
  onChange: (value: Record<string, string>) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {Object.entries(schemaFields)
        .filter(([, field]) => {
          return field["ui:field"] !== "hidden" && field["ui:field"] !== "dynamic-content-switch";
        })
        .map(([fieldName, field]) => {
          return (
            <div className="flex justify-between items-center flex-wrap" key={fieldName}>
              <label
                className={tx(
                  "text-[85%] flex-1 flex-grow",
                  schemaRequiredFields.includes(fieldName) && "font-semibold",
                )}
              >
                {field.title ?? fieldName}
              </label>
              <Select.Root
                value={currentMapping[fieldName]}
                size="1"
                onValueChange={(value) => onChange({ ...currentMapping, [fieldName]: value })}
              >
                <Select.Trigger
                  radius="medium"
                  variant="ghost"
                  placeholder="Select a field"
                  className="!flex-1"
                />
                <Select.Content position="popper">
                  <Select.Group>
                    {Object.entries(externalFields).map(([extFieldName, extField]) => (
                      <Select.Item
                        key={extFieldName}
                        value={extFieldName}
                        disabled={!areFieldsCompatible(field, extField)}
                      >
                        {extField.title ?? extFieldName}{" "}
                        {extField.title ? <span className="font-mono text-[95%]">({extFieldName})</span> : ""}
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </div>
          );
        })}
    </div>
  );
}

export default DatasourceRefField;
