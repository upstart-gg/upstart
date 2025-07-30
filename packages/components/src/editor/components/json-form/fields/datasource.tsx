import type { DatasourceSettings } from "@upstart.gg/sdk/shared/bricks/props/datasource";
import type { TObject, TSchema } from "@sinclair/typebox";
import { Button, Select, TextField } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import type { FC } from "react";
import { RxCross2 } from "react-icons/rx";
import { useDatasource, useDatasources } from "~/editor/hooks/use-datasource";
import { fieldLabel } from "../form-class";
import type { FieldProps } from "./types";
import type { Datasource } from "@upstart.gg/sdk/shared/datasources/types";
import { TbPlus } from "react-icons/tb";
import { FieldTitle } from "../field-factory";
/**
 * Extract the indexed fields of a datasource with their titles
 * @param manifestProps - Les propriétés du manifest (non utilisé actuellement)
 * @returns Objet contenant enum (noms des champs) et enumNames (titres des champs)
 */
export function getDatasourceIndexedFieldsWithTitles(datasource: Datasource) {
  const defaultIndexes = [
    {
      value: "$publishedAt",
      title: "Publication date",
    },
  ];
  if ("indexes" in datasource === false) {
    console.log("no datasource or indexes found", datasource);
    return defaultIndexes;
  }

  const properties = datasource.schema?.items?.properties || {};

  const uniqueFields = Array.from(
    new Set(
      datasource.indexes?.flatMap((idx: { fields: string[] }) =>
        Array.isArray(idx.fields) ? idx.fields : [],
      ) ?? [],
    ),
  );

  return uniqueFields
    .map((field) => ({
      value: field,
      title: properties[field]?.title || field,
    }))
    .concat(defaultIndexes);
}

const DatasourceField: FC<FieldProps<DatasourceSettings>> = (props) => {
  const { currentValue, onChange, formData, formSchema } = props;
  const datasources = useDatasources();
  const datasource = useDatasource(currentValue?.id);

  const handleChange = (field: string, value: unknown) => {
    const newValue = { ...currentValue, [field]: value };
    onChange(newValue as DatasourceSettings);
  };

  // Get Indexed Fields for filter and sort
  const indexedFields = datasource ? getDatasourceIndexedFieldsWithTitles(datasource) : [];
  const filters = currentValue.filters ?? [];

  const addFilter = () => {
    const newFilters = [...filters, { field: "", op: "eq", value: "" }];
    handleChange("filters", newFilters);
  };

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    handleChange("filters", newFilters);
  };

  const updateFilter = (index: number, key: string, value: string) => {
    const newFilters = [...filters];
    const currentFilter = { ...newFilters[index] };

    // Si on change le champ, on remet l'opérateur par défaut et vide la valeur
    if (key === "field") {
      newFilters[index] = { field: value, op: "eq", value: "" };
    }
    // Si on change l'opérateur vers/depuis un opérateur relatif, on vide la valeur
    else if (key === "op") {
      if (value === "last" || value === "next") {
        // Ajouter une unité par défaut appropriée selon le type de champ
        const fieldType = getFieldType(currentFilter.field);
        const defaultUnit = fieldType === "datetime" ? "hour" : "day";
        newFilters[index] = { ...currentFilter, op: value, value: "", unit: defaultUnit };
      } else {
        // Créer un nouvel objet sans l'unité pour les opérateurs absolus
        const { unit, ...filterWithoutUnit } = currentFilter;
        newFilters[index] = { ...filterWithoutUnit, op: value as typeof currentFilter.op, value: "" };
      }
    }
    // Pour les autres clés, mettre à jour normalement
    else {
      newFilters[index] = { ...currentFilter, [key]: value };
    }

    handleChange("filters", newFilters);
  };

  // Function to get time units based on field type
  const getTimeUnitsForField = (fieldName: string) => {
    const fieldType = getFieldType(fieldName);

    if (fieldType === "datetime") {
      return [
        { value: "minute", label: "Minutes" },
        { value: "hour", label: "Hours" },
        { value: "day", label: "Days" },
        { value: "week", label: "Weeks" },
        { value: "month", label: "Months" },
        { value: "year", label: "Years" },
      ];
    } else if (fieldType === "date") {
      return [
        { value: "day", label: "Days" },
        { value: "week", label: "Weeks" },
        { value: "month", label: "Months" },
        { value: "year", label: "Years" },
      ];
    }

    return [];
  };

  // Function to get the field type based on the datasource schema
  const getFieldType = (fieldName: string): string => {
    if (!datasource) return "string";
    const property = datasource.schema?.items?.properties?.[fieldName] as TSchema | undefined;

    if (!property) {
      console.warn(`Field "${fieldName}" not found in datasource schema.`);
    }

    if (property?.type === "string" && property.format === "date") return "date";
    if (property?.type === "string" && property.format === "date-time") return "datetime";

    return property?.type ?? "string";
  };

  // Function to get operators based on field type
  const getOperatorOptionsForField = (fieldName: string) => {
    if (!datasource) return [];
    const fieldType = getFieldType(fieldName);

    const baseOperators = [
      { value: "eq", label: "Equals" },
      { value: "ne", label: "Not equals" },
    ];

    // const existenceOperators = [
    //   { value: "exists", label: "Exists" },
    //   { value: "not_exists", label: "Does not exist" },
    // ];

    const stringOperators = [
      { value: "contains", label: "Contains" },
      { value: "startsWith", label: "Starts with" },
      { value: "endsWith", label: "Ends with" },
      // { value: "in", label: "In" },
      // { value: "nin", label: "Not in" },
    ];

    const numberOperators = [
      { value: "lt", label: "Less than" },
      { value: "lte", label: "Less than or equal" },
      // { value: "gt", label: "Greater than" },
      // { value: "gte", label: "Greater than or equal" },
      // { value: "in", label: "In" },
      // { value: "nin", label: "Not in" },
    ];

    const dateOperators = [
      { value: "before", label: "Before Date" },
      { value: "after", label: "After Date" },
      { value: "beforeNow", label: "Before Now" },
      { value: "afterNow", label: "After Now" },
      // { value: "between", label: "Between" },
      // { value: "last", label: "In the last" },
      // { value: "next", label: "In the next" },
    ];

    switch (fieldType) {
      case "string":
        return [...baseOperators, ...stringOperators];
      case "number":
      case "integer":
        return [...baseOperators, ...numberOperators];
      case "boolean":
        return [{ value: "eq", label: "Equals" }];
      case "date":
      case "datetime":
        return [...baseOperators, ...dateOperators];
      default:
        // Type inconnu, on donne tous les opérateurs
        return [...baseOperators, ...stringOperators, ...numberOperators, ...dateOperators];
    }
  };

  return (
    <div className="flex flex-col gap-3 flex-1 -mx-2.5 divide-y divide-gray-200">
      {/* Database Selection */}
      <div className="flex justify-between gap-10 flex-1 items-center py-0.5 px-2.5">
        <FieldTitle title="Database" description="Select a database to query" />
        <Select.Root
          defaultValue={currentValue?.id}
          size="2"
          onValueChange={(value: string) => handleChange("id", value)}
        >
          <Select.Trigger
            radius="medium"
            variant="ghost"
            placeholder="Select a database"
            className="!max-w-2/3 !ml-auto"
          />
          <Select.Content position="popper">
            <Select.Group>
              {datasources.map((ds) => (
                <Select.Item key={ds.id} value={ds.id}>
                  {ds.label}
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>

      {/* Filters Section */}
      {indexedFields.length > 0 && (
        <div className="flex flex-col gap-2 flex-1 justify-between pt-2 px-2.5">
          <div className="flex gap-1 flex-1 w-full justify-between items-center">
            <FieldTitle title="Filters" description="Add filters to narrow down your query" />
            <Button type="button" radius="full" variant="soft" size="1" onClick={addFilter}>
              <TbPlus className="w-3 h-3" />
              Add Filter
            </Button>
          </div>
          {filters.length > 0 && (
            <div className="basis-full">
              {filters.map((filter, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-center p-2 rounded"
                >
                  {/* Field Selector */}
                  <div className="bg-gray-50">
                    <Select.Root
                      defaultValue={filter.field}
                      size="1"
                      onValueChange={(value: string) => updateFilter(index, "field", value)}
                    >
                      <Select.Trigger radius="large" variant="ghost" placeholder="Select field" />
                      <Select.Content position="popper">
                        <Select.Group>
                          {indexedFields.map((field) => (
                            <Select.Item key={field.value} value={field.value}>
                              {field.title}
                            </Select.Item>
                          ))}
                        </Select.Group>
                      </Select.Content>
                    </Select.Root>
                  </div>

                  {/* Operator Selector */}
                  <div>
                    <Select.Root
                      key={`operator-${index}-${filter.field}`} // Force re-render when field changes
                      defaultValue={filter.op}
                      size="1"
                      onValueChange={(value: string) => updateFilter(index, "op", value)}
                    >
                      <Select.Trigger radius="large" variant="ghost" placeholder="Select operator" />
                      <Select.Content position="popper">
                        <Select.Group>
                          {getOperatorOptionsForField(filter.field).map((option) => (
                            <Select.Item key={option.value} value={option.value}>
                              {option.label}
                            </Select.Item>
                          ))}
                        </Select.Group>
                      </Select.Content>
                    </Select.Root>
                  </div>

                  {/* Value Input - for relative dates, use two columns, otherwise span both */}
                  {getFieldType(filter.field) === "date" || getFieldType(filter.field) === "datetime" ? (
                    filter.op === "last" || filter.op === "next" ? (
                      // Relative date: use two separate columns
                      <>
                        {/* Number Input */}
                        <div>
                          <input
                            type="number"
                            value={filter.value}
                            onChange={(e) => updateFilter(index, "value", e.target.value)}
                            placeholder="Number"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            min="1"
                          />
                        </div>
                        {/* Unit Selector */}
                        <div>
                          <Select.Root
                            key={`unit-${index}-${filter.field}`}
                            defaultValue={
                              filter.unit || (getFieldType(filter.field) === "datetime" ? "hour" : "day")
                            }
                            size="1"
                            onValueChange={(value: string) => updateFilter(index, "unit", value)}
                          >
                            <Select.Trigger radius="large" variant="ghost" placeholder="Unit" />
                            <Select.Content position="popper">
                              <Select.Group>
                                {getTimeUnitsForField(filter.field).map((unit) => (
                                  <Select.Item key={unit.value} value={unit.value}>
                                    {unit.label}
                                  </Select.Item>
                                ))}
                              </Select.Group>
                            </Select.Content>
                          </Select.Root>
                        </div>
                      </>
                    ) : (
                      // Absolute date: span both columns
                      <>
                        <div className="col-span-2">
                          <input
                            type={getFieldType(filter.field) === "datetime" ? "datetime-local" : "date"}
                            value={filter.value}
                            onChange={(e) => updateFilter(index, "value", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </>
                    )
                  ) : (
                    // Non-date fields: span both columns
                    <div className="col-span-2">
                      {getFieldType(filter.field) === "number" || getFieldType(filter.field) === "integer" ? (
                        <input
                          type="number"
                          value={filter.value}
                          onChange={(e) => updateFilter(index, "value", e.target.value)}
                          placeholder="Value"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : getFieldType(filter.field) === "boolean" ? (
                        <Select.Root
                          key={`value-${index}-${filter.field}`}
                          defaultValue={filter.value}
                          size="1"
                          onValueChange={(value: string) => updateFilter(index, "value", value)}
                        >
                          <Select.Trigger radius="large" variant="ghost" placeholder="Select value" />
                          <Select.Content position="popper">
                            <Select.Group>
                              <Select.Item value="true">True</Select.Item>
                              <Select.Item value="false">False</Select.Item>
                            </Select.Group>
                          </Select.Content>
                        </Select.Root>
                      ) : (
                        <TextField.Root
                          value={filter.value}
                          onChange={(e) => updateFilter(index, "value", e.target.value)}
                          placeholder="Value"
                          size="1"
                        />
                      )}
                    </div>
                  )}

                  {/* Remove Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="1"
                    onClick={() => removeFilter(index)}
                    className="!text-red-500 hover:!bg-red-100"
                  >
                    <RxCross2 size={14} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sort Fields - only show if datasource is selected and has indexed fields */}
      {indexedFields.length > 0 && (
        <div className="flex flex-1 gap-8 justify-between items-center pt-2 pb-1 px-2.5">
          <div className="flex flex-col gap-1 flex-1 ">
            <label className={tx(fieldLabel, currentValue?.sortDirection === "rand" && "opacity-40")}>
              Field
            </label>
            <Select.Root
              defaultValue={currentValue?.sortField}
              size="2"
              onValueChange={
                currentValue?.sortDirection === "rand"
                  ? undefined
                  : (value: string) => handleChange("sortField", value)
              }
              disabled={currentValue?.sortDirection === "rand"}
            >
              <Select.Trigger
                radius="large"
                variant="ghost"
                placeholder="Select a field"
                className={tx(
                  currentValue?.sortDirection === "rand" && "cursor-not-allowed pointer-events-none",
                )}
                style={currentValue?.sortDirection === "rand" ? { opacity: 0.3 } : undefined}
              />
              <Select.Content position="popper">
                <Select.Group>
                  {indexedFields.map((field) => (
                    <Select.Item key={field.value} value={field.value}>
                      {field.title}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <label className={fieldLabel}>Direction </label>
            <Select.Root
              defaultValue={currentValue?.sortDirection || "asc"}
              size="2"
              onValueChange={(value: string) => handleChange("sortDirection", value)}
            >
              <Select.Trigger radius="large" variant="ghost" placeholder="Select direction" />
              <Select.Content position="popper">
                <Select.Group>
                  <Select.Item value="asc">Ascending</Select.Item>
                  <Select.Item value="desc">Descending</Select.Item>
                  <Select.Item value="rand">Random</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      )}
      {/* {datasourceId && fieldValues.length > 0 && currentValue?.sortDirection !== "rand" && (
        <>
          <div className="basis-full w-0" />
          <div className="flex gap-12 flex-1 mt-3 pr-1.5 justify-between">
            <label className={fieldLabel}>Offset</label>
            <input
              type="number"
              value={currentValue?.offset?.toString() || "0"}
              onChange={(e) => handleChange("offset", parseInt(e.target.value) || 0)}
              min="0"
              className="max-w-[50px] px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
        </>
      )} */}
      {indexedFields.length > 0 && (
        <div className="flex flex-1 justify-between items-center pt-2 px-2.5">
          <label className={fieldLabel}>Limit</label>
          <TextField.Root
            type="number"
            value={currentValue?.limit?.toString() || "10"}
            onChange={(e) => handleChange("limit", parseInt(e.target.value) || 10)}
            min="1"
            max="30"
            className="!w-[40px]"
          />
        </div>
      )}
    </div>
  );
};

export default DatasourceField;
