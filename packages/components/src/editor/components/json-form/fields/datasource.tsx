import type { DatasourceSettings } from "@upstart.gg/sdk/shared/bricks/props/datasource";
import type { TObject, TSchema } from "@sinclair/typebox";
import { Button, IconButton, SegmentedControl, Select, TextField } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import { Fragment, type FC } from "react";
import { RxCross2 } from "react-icons/rx";
import { useDatasource, useDatasources } from "~/editor/hooks/use-datasource";
import { fieldLabel } from "../form-class";
import type { FieldProps } from "./types";
import type { Datasource } from "@upstart.gg/sdk/shared/datasources/types";
import { TbPlus } from "react-icons/tb";
import { FieldTitle } from "../field-factory";
import debounce from "lodash-es/debounce";

/**
 * Extract the indexed fields of a datasource with their titles
 */
function getDatasourceIndexedFieldsWithTitles(datasource: Datasource) {
  if ("indexes" in datasource === false) {
    console.error("no datasource or indexes found", datasource);
    return [];
  }

  const properties = datasource.schema?.items?.properties || {};

  const uniqueFields = Array.from(new Set(datasource.indexes?.map((idx) => idx.fields[0]) ?? []));

  return uniqueFields.map((field) => ({
    value: field,
    title: properties[field]?.title || field,
  }));
}

const DatasourceField: FC<FieldProps<DatasourceSettings | undefined>> = (props) => {
  const { currentValue, onChange, formData, formSchema } = props;
  const datasources = useDatasources();
  const datasource = useDatasource(currentValue?.id);

  const handleChange = (field: string, value: unknown) => {
    const newValue = { ...(currentValue ?? {}), [field]: value } as DatasourceSettings;
    console.log("DatasourceField handleChange", newValue);
    onChange(newValue);
  };

  // Get Indexed Fields for filter and sort
  const indexedFields = datasource ? getDatasourceIndexedFieldsWithTitles(datasource) : [];
  const sortableFields = indexedFields.filter((field) => ["$id", "$slug"].includes(field.value) === false);
  const filters = currentValue?.filters ?? [];

  // Function to get operators based on field type
  const getOperatorOptionsForField = (fieldName: string) => {
    if (!datasource) return [];
    const fieldType = getFieldType(fieldName);

    const baseOperators = [
      { value: "eq", label: "Equals" },
      { value: "ne", label: "Not equals" },
    ];

    const stringOperators = [
      { value: "contains", label: "Contains" },
      { value: "notContains", label: "Not contains" },
      { value: "startsWith", label: "Starts with" },
      { value: "notStartsWith", label: "Not starts with" },
      { value: "endsWith", label: "Ends with" },
      { value: "notEndsWith", label: "Not ends with" },
    ];

    const arrayOperators = [
      { value: "contains", label: "Contains" },
      { value: "notContains", label: "Not contains" },
      { value: "containsAll", label: "Contains all" },
      { value: "containsAny", label: "Contains any" },
      { value: "notContainsAny", label: "Not contains any" },
    ];

    const numberOperators = [
      { value: "lt", label: "Less than" },
      { value: "lte", label: "Less than or equal" },
      { value: "gt", label: "Greater than" },
      { value: "gte", label: "Greater than or equal" },
    ];

    const dateOperators = [
      { value: "before", label: "Before Date" },
      { value: "after", label: "After Date" },
      { value: "$beforeNow", label: "Before Now" },
      { value: "$afterNow", label: "After Now" },
    ];

    switch (fieldType) {
      case "array":
        return arrayOperators;
      case "string":
        return [...baseOperators, ...stringOperators];
      case "number":
      case "integer":
        return [...baseOperators, ...numberOperators];
      case "boolean":
        return [{ value: "eq", label: "Equals" }];
      case "date":
      case "datetime":
        return [...dateOperators, baseOperators[0]];
      default:
        // Type inconnu, on donne tous les opérateurs
        return [...baseOperators, ...stringOperators, ...numberOperators, ...dateOperators];
    }
  };

  const addFilter = () => {
    const newFilters = [...filters, { field: "", op: "eq", value: "" }];
    handleChange("filters", newFilters);
  };

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    handleChange("filters", newFilters);
  };

  const updateFilter = (index: number, key: string, value: string | number | boolean) => {
    const newFilters = [...filters];
    const currentFilter = { ...newFilters[index] };

    // Si on change le champ, on remet l'opérateur par défaut et vide la valeur
    if (key === "field") {
      const op = (
        value ? getOperatorOptionsForField(value as string)[0].value : "eq"
      ) as typeof currentFilter.op;
      newFilters[index] = { field: value as string, op, value: "" };
    }
    // Si on change l'opérateur vers/depuis un opérateur relatif, on vide la valeur
    else if (key === "op") {
      // Créer un nouvel objet sans l'unité pour les opérateurs absolus
      newFilters[index] = { ...currentFilter, op: value as typeof currentFilter.op, value: "" };
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
    if (property?.type === "string" && property.format === "date") return "date";
    if (property?.type === "string" && property.format === "date-time") return "datetime";

    return property?.type ?? "string";
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
            className="!max-w-2/3 !ml-auto !mr-[1px]"
          />
          <Select.Content position="popper">
            {datasources.map((ds) => (
              <Select.Item key={ds.id} value={ds.id}>
                {ds.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>

      {/* Filters Section */}
      {indexedFields.length > 0 && (
        <div className="flex flex-col gap-2 flex-1 justify-between pt-2.5 px-2.5">
          <div className="flex gap-1 flex-1 w-full justify-between items-center">
            <FieldTitle title="Filters" description="Add filters to narrow down your query" />
            <Button type="button" radius="full" variant="soft" size="1" onClick={addFilter}>
              <TbPlus className="w-3 h-3" />
              Add Filter
            </Button>
          </div>
          {filters.length > 0 && (
            <div className="basis-full flex flex-col gap-3 mt-1">
              {filters.map((filter, index) => (
                <Fragment key={index}>
                  <div className="grid grid-cols-5 gap-x-2 gap-y-0.5 auto-rows-[30px]">
                    {/* Field Selector */}
                    <div className="col-span-5 flex items-center gap-3 pr-1">
                      <IconButton
                        size="1"
                        type="button"
                        variant="ghost"
                        className="hover:(bg-red-100 text-red-800) !shrink-0"
                        onClick={() => removeFilter(index)}
                      >
                        <RxCross2 size={14} />
                      </IconButton>
                      <Select.Root
                        defaultValue={filter.field}
                        onValueChange={(value: string) => updateFilter(index, "field", value)}
                      >
                        <Select.Trigger
                          radius="medium"
                          className="!flex-1 !font-medium"
                          variant="ghost"
                          placeholder="Select field"
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

                    {/* Operator Selector */}
                    <div className={tx("flex gap-2 items-center col-span-2", !filter.field && "hidden")}>
                      {/* <BsArrowReturnRight className="w-3 h-3 ml-1 mr-1.5 !shrink-0" /> */}
                      <Select.Root
                        key={`operator-${index}-${filter.field}`} // Force re-render when field changes
                        defaultValue={filter.op}
                        size="2"
                        onValueChange={(value: string) => updateFilter(index, "op", value)}
                        disabled={!filter.field}
                      >
                        <Select.Trigger
                          radius="medium"
                          variant="ghost"
                          placeholder="Select operator"
                          className="!flex-1 !mr-1"
                        />
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
                      (filter.op === "before" || filter.op === "after" || filter.op === "eq") && (
                        // Absolute date: span both columns
                        <div className={tx("col-span-3 flex justify-end", !filter.field && "hidden")}>
                          <TextField.Root
                            size="2"
                            type={getFieldType(filter.field) === "datetime" ? "datetime-local" : "date"}
                            defaultValue={String(filter.value)}
                            onChange={(e) => updateFilter(index, "value", e.target.value)}
                            disabled={!filter.field}
                            className="!w-full"
                          />
                        </div>
                      )
                    ) : (
                      // Non-date fields: span both columns
                      <div className={tx("col-span-3 flex justify-end ", !filter.field && "hidden")}>
                        {getFieldType(filter.field) === "number" ||
                        getFieldType(filter.field) === "integer" ? (
                          <TextField.Root
                            type="number"
                            size="2"
                            defaultValue={String(filter.value)}
                            onChange={(e) => updateFilter(index, "value", Number(e.target.value))}
                            placeholder="Value"
                            min="1"
                            disabled={!filter.field}
                            className="!w-full"
                          />
                        ) : getFieldType(filter.field) === "boolean" ? (
                          <SegmentedControl.Root
                            size="1"
                            defaultValue={String(filter.value)}
                            onValueChange={(value) => updateFilter(index, "value", Boolean(value))}
                            className={tx("!mt-0.5 [&_.rt-SegmentedControlItemLabel]:(px-3)")}
                          >
                            <SegmentedControl.Item value="true">True</SegmentedControl.Item>
                            <SegmentedControl.Item value="false">False</SegmentedControl.Item>
                          </SegmentedControl.Root>
                        ) : (
                          <TextField.Root
                            disabled={!filter.field}
                            defaultValue={String(filter.value)}
                            onChange={debounce((e) => updateFilter(index, "value", e.target.value), 400)}
                            placeholder="Value"
                            size="2"
                            className="!w-full"
                          />
                        )}
                      </div>
                    )}
                  </div>
                  {index < filters.length - 1 && (
                    <div className="border-t border-gray-200 my-2 relative">
                      <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-white px-2 py-1 inline-block text-xs text-gray-500">
                        And
                      </span>
                    </div>
                  )}
                </Fragment>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sort Fields  */}
      {currentValue?.id && (
        <div className="flex flex-1 gap-8 justify-between items-center pt-2.5 pb-1 px-2.5">
          <div className="flex flex-col gap-1 flex-1 ">
            <FieldTitle title="Order by" description="Select a field to sort the results" />
            <Select.Root
              defaultValue={currentValue?.sortField}
              size="2"
              onValueChange={(value: string) => handleChange("sortField", value)}
            >
              <Select.Trigger radius="medium" variant="ghost" placeholder="Select a field" />
              <Select.Content position="popper">
                <Select.Group>
                  {sortableFields.map((field) => (
                    <Select.Item key={field.value} value={field.value}>
                      {field.title}
                    </Select.Item>
                  ))}
                </Select.Group>
                <Select.Separator />
                <Select.Group>
                  <Select.Item value="random()">Random</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>

          <div
            className={tx(
              "flex flex-col gap-1 flex-1",
              currentValue?.sortField === "random()" && "opacity-40",
            )}
          >
            <FieldTitle title="Direction" description="Select the direction to sort the results" />
            <Select.Root
              disabled={currentValue?.sortField === "random()"}
              defaultValue={currentValue?.sortDirection || "asc"}
              size="2"
              onValueChange={(value: string) => handleChange("sortDirection", value)}
            >
              <Select.Trigger
                radius="medium"
                variant="ghost"
                placeholder="Select direction"
                className="!mr-[1px]"
              />
              <Select.Content position="popper">
                <Select.Group>
                  <Select.Item value="asc">Ascending</Select.Item>
                  <Select.Item value="desc">Descending</Select.Item>
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      )}

      {currentValue?.id && indexedFields.length > 0 && (
        <div className="flex flex-1 justify-between items-center pt-2 px-2.5">
          <FieldTitle
            title="Number of items"
            description="If greater than 1, all children bricks will be repeated"
          />
          <TextField.Root
            type="number"
            value={currentValue?.limit?.toString() ?? "10"}
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
