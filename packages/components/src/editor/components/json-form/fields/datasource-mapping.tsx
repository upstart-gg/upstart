import type { FieldProps } from "./types";
import { Text } from "@upstart.gg/style-system/system";
import { Select } from "@upstart.gg/style-system/system";
import { type TArray, type TObject, type TProperties, type TSchema, Type } from "@sinclair/typebox";
import { useBrick, useDynamicParent } from "~/editor/hooks/use-editor";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import { useBrickManifest } from "~/shared/hooks/use-brick-manifest";
import { type FC, useCallback } from "react";
import { tx } from "@upstart.gg/style-system/twind";
import { useDatasource } from "~/editor/hooks/use-datasource";
import { filterSchemaProperties } from "@upstart.gg/sdk/shared/utils/schema";
import { FieldTitle } from "../field-factory";

type DatasourceMapping = {
  datasourceId: string;
  $mapping: Record<string, string>;
};

const DatasourceMappingField: FC<FieldProps<DatasourceMapping>> = (props) => {
  const { onChange, currentValue = { datasourceId: "1" } as DatasourceMapping, brickId } = props;
  const brickInfo = useBrick(brickId);
  const dynamicParent = useDynamicParent(brickId);
  invariant(brickInfo, `Could not find brick info for ${brickId} in DatasourceRefField`);

  console.log("DatasourceMappingField props", props, brickInfo, dynamicParent);

  const brickManifest = useBrickManifest(brickInfo.type);
  const datasource = useDatasource(dynamicParent?.props.datasource?.id);
  const schemaFields = filterSchemaProperties(brickManifest.props, (prop) => {
    return prop.metadata?.category === "content" && !prop["ui:no-mapping"];
  });

  if (!datasource) {
    return (
      <div className="field field-datasource flex-1 px-2">
        <Text className="text-sm text-gray-500">No datasource selected ({currentValue.datasourceId})</Text>
      </div>
    );
  }

  return (
    <div className="field field-datasource flex-1 p-2">
      <div className="flex flex-col gap-6">
        {Object.keys(brickManifest.props).length > 0 && (
          <div className="flex flex-col flex-1 gap-2">
            <FieldTitle title={"Fields mapping"} />
            <FieldsMapper
              schemaFields={schemaFields}
              externalFields={datasource.schema.items.properties}
              onChange={(mapping) => {
                console.log("Mapping changed", mapping);
                // onChange({ ...currentValue, $mapping: mapping });
              }}
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
