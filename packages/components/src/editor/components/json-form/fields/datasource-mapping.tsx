import type { FieldProps } from "./types";
import { Text } from "@upstart.gg/style-system/system";
import { SegmentedControl, Select } from "@upstart.gg/style-system/system";
import type { DatasourceRefSettings } from "@upstart.gg/sdk/shared/bricks/props/datasource";
import { fieldLabel } from "../form-class";
import { type TArray, type TObject, type TProperties, type TSchema, Type } from "@sinclair/typebox";
import { useGetBrick } from "~/editor/hooks/use-editor";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import { useBrickManifest } from "~/shared/hooks/use-brick-manifest";
import { type FC, useCallback } from "react";
import { tx } from "@upstart.gg/style-system/twind";
import { useDatasource } from "~/editor/hooks/use-datasource";
import { FieldTitle } from "../field-factory";

type DatasourceMapping = {
  datasourceId: string;
  $mapping: Record<string, string>;
};

const DatasourceMappingField: FC<FieldProps<DatasourceMapping>> = (props) => {
  const { onChange, currentValue = { datasourceId: "1" } as DatasourceMapping, brickId } = props;
  const getBrickInfo = useGetBrick();

  const brickInfo = getBrickInfo(brickId);
  invariant(brickInfo, `Could not find brick info for ${brickId} in DatasourceRefField`);

  const brickManifest = useBrickManifest(brickInfo.type);
  const datasource = useDatasource(currentValue.datasourceId ?? "1");

  const onDataSourceChange = useCallback(
    (data: Partial<DatasourceRefSettings>) => {
      if (!currentValue?.datasourceId) {
        return;
      }
      onChange({ ...currentValue, ...data });
    },
    [currentValue, onChange],
  );

  // test data
  const allDatasources = [
    {
      id: "1",
      label: "Marketing assets",
      schema: Type.Array(
        Type.Object({
          name: Type.String({ title: "Name" }),
          url: Type.String({ title: "URL", format: "uri" }),
          type: Type.String({ title: "Type" }),
        }),
      ),
    },
    {
      id: "2",
      label: "Vacation pictures",
      schema: Type.Array(
        Type.Object({
          location: Type.String({ title: "Location" }),
          url: Type.String({ title: "Photo URL", format: "uri" }),
          peopleCount: Type.Number({ title: "Number of people" }),
        }),
      ),
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
  ];

  // We need to get the fields from the datasource schema. This will be used to map fields from the datasource to the schema
  // The datasource schema could be an object or an array of objects
  const schemaFields = (datasource?.schema.items?.properties ?? {}) as TObject;
  const schemaRequiredFields = (datasource?.schema as TArray<TObject> | null)?.items?.required ?? [];

  // check schema "required" fields

  const compatibleDatasources = allDatasources
    .map((datasource) => {
      //
      const datasourceFields = datasource.schema.items.properties;
      const datasourceRequiredFields = datasource.schema.items?.required ?? [];

      // mark the datasources eligeable or not depending on their schema follwing these rules:
      // - All required fields type should match with at least one field in the schema
      // - AT least on field type should match with at least one field in the schema
      const compatible = schemaRequiredFields.every((field) => {
        return datasourceRequiredFields.some((dsField) => {
          // @ts-ignore
          return areFieldsCompatible(datasourceFields[dsField], schemaFields[field]);
        });
      });
      // augment the datasource object with the compatible flag
      return { ...datasource, compatible };
    })
    .sort((a, b) => (a.compatible === b.compatible ? 0 : a.compatible ? -1 : 1));

  const externalDatasource = allDatasources.find((ds) => ds.id === currentValue.datasourceId);
  const externalFields = externalDatasource
    ? externalDatasource.schema.type === "array"
      ? externalDatasource.schema.items?.properties
      : externalDatasource.schema.properties
    : {};

  if (!datasource) {
    return (
      <div className="field field-datasource flex-1 p-2">
        <Text className="text-sm text-gray-500">No datasource selected</Text>
      </div>
    );
  }

  return (
    <div className="field field-datasource flex-1 p-2">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3 flex-1 mx-px">
          <FieldTitle title="Datasource" />
          <Select.Root
            value={currentValue.datasourceId}
            size="2"
            onValueChange={(value) => onDataSourceChange({ id: value })}
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
          <div className="flex flex-col flex-1 gap-2">
            <h3
              className={tx(
                "text-sm font-semibold !dark:bg-dark-600 bg-upstart-100 px-2 py-1 sticky top-0 z-[999] -mx-3",
              )}
            >
              Fields mapping
            </h3>
            <FieldsMapper
              externalFields={externalFields}
              schemaFields={schemaFields}
              onChange={(mapping) => onDataSourceChange({ mapping })}
              currentMapping={currentValue.$mapping ?? {}}
            />
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
  onChange,
}: {
  currentMapping: Record<string, string>;
  externalFields: TProperties;
  schemaFields: TProperties;
  onChange: (value: Record<string, string>) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {Object.entries(schemaFields).map(([fieldName, field]) => {
        return (
          <div className="flex gap-0.5 justify-between items-center flex-wrap" key={fieldName}>
            <label className={tx("text-[85%] flex-1 flex-grow")}>{field.title ?? fieldName}</label>
            <Select.Root
              value={currentMapping[fieldName]}
              size="1"
              onValueChange={(value) => onChange({ ...currentMapping, [fieldName]: value })}
            >
              <Select.Trigger
                radius="large"
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
                      {extField.title ? <span className="font-mono text-[90%]">({extFieldName})</span> : ""}
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

export default DatasourceMappingField;
