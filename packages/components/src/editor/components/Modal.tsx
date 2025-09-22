import {
  Button,
  Dialog,
  IconButton,
  SegmentedControl,
  Select,
  TextField,
  Tooltip,
} from "@upstart.gg/style-system/system";
import { PiListNumbersLight } from "react-icons/pi";
import { useEditorHelpers, useModal } from "~/editor/hooks/use-editor";
import { BsDatabaseDown, BsDatabase, BsAt, BsCrosshair } from "react-icons/bs";
import { validate } from "@upstart.gg/sdk/shared/utils/schema";
import type { TSchema } from "@sinclair/typebox";
import { type Query, querySchema } from "@upstart.gg/sdk/shared/datasources/types";
import { getDatasourceIndexedFieldsWithTitles } from "@upstart.gg/sdk/shared/datasources";
import { Fragment, useCallback, useState } from "react";
import { useDraftHelpers, useSiteQueries } from "../hooks/use-page-data";
import { useDatasource, useDatasources } from "../hooks/use-datasource";
import { FieldTitle } from "./json-form/field-factory";
import { TbPlus } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { tx } from "@upstart.gg/style-system/twind";
import debounce from "lodash-es/debounce";
import { nanoid } from "nanoid";
import { LuPlus } from "react-icons/lu";
import TagsInput from "./TagsInput";
import { FiEdit } from "react-icons/fi";

export default function Modal() {
  const modal = useModal();
  const { hideModal } = useEditorHelpers();
  return (
    <Dialog.Root
      open={!!modal}
      onOpenChange={(open) => {
        if (!open) {
          // editor.hideModal();
          hideModal();
        }
      }}
    >
      {modal === "queries" && <ModalQueries />}
    </Dialog.Root>
  );
}

function ModalQueries() {
  const [showCreationForm, setShowCreationForm] = useState(false);
  const [editingQuery, setEditingQuery] = useState<Query | null>(null);
  const editorHelpers = useEditorHelpers();
  const queries = useSiteQueries();
  const datasources = useDatasources();
  const { hideModal } = useEditorHelpers();
  return (
    <Dialog.Content
      aria-describedby="Queries managament"
      maxWidth="760px"
      minHeight="80dvh"
      className="overflow-y-clip flex flex-col gap-y-2"
    >
      <Dialog.Title className="flex items-center gap-3 pl-0 -ml-3">
        <BsDatabaseDown className="h-6 w-6 text-upstart-600" />
        Manage site queries
        <Button
          size="2"
          disabled={!datasources.length || showCreationForm}
          variant="outline"
          radius="medium"
          className={tx("!ml-auto", showCreationForm && "!opacity-0")}
          onClick={() => {
            setEditingQuery(null);
            setShowCreationForm(true);
          }}
        >
          <LuPlus className="w-4 h-4" />
          Create Query
        </Button>
      </Dialog.Title>
      <Dialog.Description>
        Queries are used to fetch data from your databases. Once defined you can use them in your{" "}
        <button
          type="button"
          className={tx("text-upstart-600 hover:underline underline-offset-4")}
          onClick={() => {
            hideModal();
            editorHelpers.setPanel("settings");
          }}
        >
          page settings
        </button>{" "}
        and reference them to loop over or use their fields in bricks to display dynamic data.
      </Dialog.Description>
      {showCreationForm && <QueryCreator query={editingQuery} onClose={() => setShowCreationForm(false)} />}
      {!showCreationForm && queries.length === 0 && (
        <div className="flex flex-col gap-2 justify-center items-center flex-1 text-center">
          <span className="text-base text-gray-500">
            You currently have no queries defined.
            <br />
            Create a new query to get started.
          </span>
        </div>
      )}
      {queries.length > 0 && (
        <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden -mx-1 mt-3 shadow-sm">
          {queries.map((query) => (
            <div
              key={query.id}
              className="flex items-center justify-between p-4 [&:not(:last-child)]:border-b border-gray-200 "
            >
              <div className="flex flex-col gap-2">
                <div className="font-medium">{query.label}</div>
                <div className="flex gap-6 items-center justify-start text-sm  text-gray-500">
                  <Tooltip content={`Database`}>
                    <span className="inline-flex gap-1 items-center cursor-help">
                      <BsDatabase className="text-upstart-500" />
                      {query.datasourceId}
                    </span>
                  </Tooltip>
                  <Tooltip content={`Number of items`}>
                    <span className="inline-flex gap-1 items-center cursor-help">
                      <PiListNumbersLight className="text-upstart-500" />
                      {query.limit}
                    </span>
                  </Tooltip>
                  {/* <Tooltip content={`Alias`}>
                    <span className="inline-flex gap-0.5 items-center cursor-help">
                      <BsAt className="text-upstart-500" />
                      {query.alias}
                    </span>
                  </Tooltip> */}
                  {(query.parameters?.length ?? 0) > 0 && (
                    <Tooltip content={`Parameters`}>
                      <span className="inline-flex gap-1 items-center cursor-help">
                        <BsCrosshair className="text-upstart-500" />
                        {query.parameters!.join(", ")}
                      </span>
                    </Tooltip>
                  )}
                </div>
              </div>
              <IconButton
                size="2"
                variant="soft"
                color="violet"
                onClick={() => {
                  setEditingQuery(query);
                  setShowCreationForm(true);
                }}
              >
                <FiEdit className="w-4 h-4" />
              </IconButton>
            </div>
          ))}
        </div>
      )}
    </Dialog.Content>
  );
}

function getQueryTemplate() {
  return {
    id: nanoid(7),
    filters: {
      op: "and" as const,
      fields: [],
    },
    sortField: "$publicationDate",
    sortDirection: "desc",
    limit: 10,
  } satisfies Partial<Query>;
}

function QueryCreator({ query: initialQuery, onClose }: { query?: Query | null; onClose?: () => void }) {
  const [query, setQuery] = useState<Partial<Query>>(initialQuery ?? getQueryTemplate());

  const reset = () => {
    setQuery(getQueryTemplate());
  };
  const { upsertQuery } = useDraftHelpers();
  const datasources = useDatasources();
  const datasource = useDatasource(query?.datasourceId);

  // Get Indexed Fields for filter and sort
  const indexedFields = datasource ? getDatasourceIndexedFieldsWithTitles(datasource) : [];
  const sortableFields = indexedFields.filter((field) => ["$id", "$slug"].includes(field.value) === false);

  // Extract simple filters from the filterExpression structure
  const filters = query?.filters?.fields?.filter((f) => "field" in f) ?? [];

  // Handle general query changes
  const handleChange = (key: keyof Query, value: string | number) => {
    setQuery(
      (prev) =>
        ({
          ...prev,
          sortDirection: key === "sortField" && value === "random()" ? null : prev?.sortDirection,
          [key]: value,
        }) as Query,
    );
  };

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
      { value: "beforeNow", label: "Before Now" },
      { value: "afterNow", label: "After Now" },
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
    const newFilter = {
      field: "",
      op: "eq" as const,
      value: "",
    };
    setQuery((prev) => {
      const currentFilters = prev?.filters?.fields?.filter((f) => "field" in f) ?? [];
      return {
        ...prev,
        filters: {
          op: "and" as const,
          fields: [...currentFilters, newFilter],
        },
      };
    });
  };

  const removeFilter = (index: number) => {
    setQuery((prev) => {
      const currentFilters = prev?.filters?.fields?.filter((f) => "field" in f) ?? [];
      const newFilters = currentFilters.filter((_, i) => i !== index);
      return {
        ...prev,
        filters: {
          op: "and" as const,
          fields: newFilters,
        },
      };
    });
  };

  const updateFilter = (index: number, key: string, value: string | number | boolean | string[]) => {
    setQuery((prev) => {
      const currentFilters = [...(prev?.filters?.fields?.filter((f) => "field" in f) ?? [])];
      const currentFilter = { ...currentFilters[index] };

      if (key === "field") {
        const op = (
          value ? (getOperatorOptionsForField(value as string)[0]?.value ?? "eq") : "eq"
        ) as typeof currentFilter.op;
        // @ts-ignore partial update
        currentFilters[index] = { field: value as string, op, value: "" };
      } else if (key === "op") {
        // @ts-ignore partial update
        currentFilters[index] = { ...currentFilter, op: value as typeof currentFilter.op, value: "" };
      } else {
        // value can be string, number, boolean or string[]
        currentFilters[index] = { ...currentFilter, [key]: value };
      }

      console.log("Updated filters:", currentFilters);
      return {
        ...prev,
        filters: {
          op: "and" as const,
          fields: currentFilters,
        },
      };
    });
  };

  // Function to get the field type based on the datasource schema
  const getFieldType = (fieldName: string): string => {
    if (!datasource) return "string";
    const property = datasource.schema?.items?.properties?.[fieldName] as TSchema | undefined;
    if (property?.type === "string" && property.format === "date") return "date";
    if (property?.type === "string" && property.format === "date-time") return "datetime";
    return property?.type ?? "string";
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("Submitting query:", query);
      try {
        validate(querySchema, query);
        upsertQuery(query as Query);
        onClose?.();
      } catch (error) {
        console.error("Query validation failed:", error);
      }
    },
    [query],
  );

  function validateQuery(querySchema: TSchema, query: unknown): boolean {
    try {
      validate(querySchema, query);
      return true;
    } catch (error) {
      return false;
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="text-sm border border-gray-300 bg-gray-50 p-4 rounded-lg -mx-1 mt-3 shadow-sm"
    >
      <h3 className="font-bold text-base mb-3">{initialQuery ? "Edit query" : "Create a new query"}</h3>
      <div className="flex flex-col text-sm gap-4 flex-1 -mx-2.5 divide-y divide-gray-200">
        {/* Database Selection */}
        <div className="flex justify-between gap-4 flex-1 items-center py-0.5 px-2.5">
          <div className="flex flex-col gap-1 flex-1">
            <FieldTitle
              withIcon
              className="font-medium"
              title="Label"
              description="Label displayed in the Editor"
            />
            <TextField.Root
              onInput={(e) => handleChange("label", e.currentTarget.value)}
              defaultValue={query?.label}
              maxLength={querySchema.properties.label.maxLength}
              aria-required
              placeholder="Ex: Latest blog posts"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <FieldTitle withIcon className="font-medium" title="Database" description="Database to query" />
            <Select.Root
              aria-required
              defaultValue={query?.datasourceId}
              size="2"
              onValueChange={(value: string) =>
                setQuery(
                  (prev) =>
                    ({
                      ...(prev ?? {}),
                      datasourceId: value,
                      filters: {
                        op: "and" as const,
                        fields: [],
                      },
                    }) as Query,
                )
              }
            >
              <Select.Trigger
                radius="medium"
                variant="surface"
                placeholder="Select a database"
                className="!max-w-2/3 !mr-[1px]"
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
        </div>

        {/* Filters Section */}
        {indexedFields.length > 0 && (
          <div className="flex flex-col gap-2 flex-1 justify-between pt-3 px-2.5">
            <div className="flex flex-1 w-full justify-between items-center">
              <FieldTitle
                withIcon
                title="Filters"
                className="font-medium"
                description="Add filters to narrow down your query"
              />
              <Button type="button" radius="full" variant="solid" size="1" onClick={addFilter}>
                <TbPlus className="w-3 h-3" />
                Add Filter
              </Button>
            </div>
            {filters.length > 0 && (
              <div className="flex flex-col gap-3 mt-1">
                {filters.map((filter, index) => (
                  <Fragment key={index}>
                    <div className="flex gap-x-3 gap-y-0.5 items-center">
                      {/* Field Selector */}
                      <div className="w-[200px] flex items-center gap-3 pr-1">
                        <Select.Root
                          defaultValue={filter.field}
                          onValueChange={(value: string) => updateFilter(index, "field", value)}
                        >
                          <Select.Trigger
                            className="!w-full"
                            radius="medium"
                            variant="surface"
                            placeholder="Select a field"
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
                      <div className={tx("flex gap-2 items-center w-[120px]", !filter.field && "hidden")}>
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
                          <div className={tx("grow flex justify-end", !filter.field && "hidden")}>
                            <TextField.Root
                              size="2"
                              type={getFieldType(filter.field) === "datetime" ? "datetime-local" : "date"}
                              defaultValue={String(filter.value || "")}
                              onChange={(e) => updateFilter(index, "value", e.target.value)}
                              disabled={!filter.field}
                              className="!w-full"
                            />
                          </div>
                        )
                      ) : (
                        // Non-date fields: span both columns
                        <div className={tx("grow flex justify-end", !filter.field && "hidden")}>
                          {getFieldType(filter.field) === "number" ||
                          getFieldType(filter.field) === "integer" ? (
                            <TextField.Root
                              type="number"
                              size="2"
                              defaultValue={String(filter.value || "")}
                              onChange={(e) => updateFilter(index, "value", Number(e.target.value))}
                              placeholder="Value"
                              min="1"
                              disabled={!filter.field}
                              className="!w-full"
                            />
                          ) : getFieldType(filter.field) === "boolean" ? (
                            <SegmentedControl.Root
                              size="1"
                              defaultValue={String(filter.value || "true")}
                              onValueChange={(value) => updateFilter(index, "value", value === "true")}
                              className={tx("!mt-0.5 [&_.rt-SegmentedControlItemLabel]:(px-3)")}
                            >
                              <SegmentedControl.Item value="true">True</SegmentedControl.Item>
                              <SegmentedControl.Item value="false">False</SegmentedControl.Item>
                            </SegmentedControl.Root>
                          ) : getFieldType(filter.field) === "array" ? (
                            <TagsInput
                              initialValue={Array.isArray(filter.value) ? filter.value : []}
                              onChange={(value) => updateFilter(index, "value", value)}
                              className="!w-full"
                              placeholder="Add tags"
                            />
                          ) : (
                            <TextField.Root
                              disabled={!filter.field}
                              defaultValue={String(filter.value || "")}
                              onChange={debounce((e) => updateFilter(index, "value", e.target.value), 400)}
                              placeholder="Value"
                              size="2"
                              className="!w-full max-w-full"
                            />
                          )}
                        </div>
                      )}
                      <IconButton
                        size="1"
                        type="button"
                        variant="ghost"
                        className="hover:(bg-red-100 text-red-800) !shrink-0 !ml-auto"
                        onClick={() => removeFilter(index)}
                      >
                        <RxCross2 size={14} />
                      </IconButton>
                    </div>

                    {index < filters.length - 1 && (
                      <div className="border-t border-dotted mx-auto w-2/3 border-gray-200 my-2 relative">
                        <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-gray-50 rounded-full px-2 py-1 inline-block text-xs text-gray-500">
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

        {/* Parameters Section */}
        {indexedFields.length > 0 && (
          <div className="flex flex-col gap-2 flex-1 justify-between pt-3 px-2.5">
            <div className="flex flex-1 w-full justify-between items-center">
              <FieldTitle
                title="Parameters"
                className="font-medium"
                withIcon
                description="Optional fields that will be used as parameters when using the query. Only indexed fields can be used as parameters. Usually only one parameter is needed, but you can add multiple parameters if necessary. When specifying parameters, you will need to set a value for each parameter every time you use it."
              />
              <div>TODO/ IMPLEMENT</div>
              {/* <TagsSelect
                options={indexedFields.map((field) => ({ value: field.value, label: field.title }))}
                initialValue={query?.parameters ?? []}
                isMulti
                onChange={(value) => setQuery((prev) => ({ ...prev, parameters: value as string[] }))}
                className="!w-full min-w-fit max-w-[340px]"
                placeholder="Add parameters (e.g. Slug, Id)"
              /> */}
            </div>
          </div>
        )}

        {/* Sort Fields  */}
        {query?.datasourceId && (
          <div className="flex flex-1 gap-6 justify-between items-center pt-2.5 pb-1 px-2.5">
            <div className="flex flex-col gap-1 flex-1 ">
              <FieldTitle
                className="font-medium"
                title="Order by"
                description="Select a field to sort the results"
              />
              <Select.Root
                defaultValue={query?.sortField}
                size="2"
                onValueChange={(value: string) => handleChange("sortField", value)}
              >
                <Select.Trigger
                  radius="medium"
                  variant="surface"
                  className="!mr-[1px] !mt-0.5"
                  placeholder="Select a field"
                />
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
              className={tx("flex flex-col gap-1 flex-1", query?.sortField === "random()" && "opacity-40")}
            >
              <FieldTitle
                className="font-medium"
                title="Direction"
                description="Select the direction to sort the results"
              />
              <Select.Root
                disabled={query?.sortField === "random()"}
                defaultValue={query?.sortDirection || "asc"}
                size="2"
                onValueChange={(value: string) => handleChange("sortDirection", value)}
              >
                <Select.Trigger
                  radius="medium"
                  variant="surface"
                  placeholder="Select direction"
                  className="!mr-[1px] !mt-0.5"
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

        {query?.datasourceId && indexedFields.length > 0 && (
          <div className="flex flex-1 gap-6 justify-between items-center pt-2.5 pb-1 px-2.5">
            <div className="flex flex-col flex-1 gap-2">
              <FieldTitle
                className="font-medium"
                title="Max number of items to fetch"
                containerClassName="!basis-0"
              />
              <TextField.Root
                type="number"
                defaultValue={query?.limit?.toString() ?? "10"}
                onChange={(e) => handleChange("limit", parseInt(e.target.value) || 10)}
                min="1"
                max="30"
                className="!w-[40px]"
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end gap-2 mt-10">
        <Button
          type="button"
          size="2"
          color="gray"
          variant="soft"
          onClick={() => {
            reset();
            onClose?.();
          }}
        >
          Cancel
        </Button>
        <Button disabled={!validateQuery(querySchema, query)} type="submit" size="2">
          Save query
        </Button>
      </div>
    </form>
  );
}
