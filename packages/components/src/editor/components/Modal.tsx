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
import { BsDatabaseDown, BsDatabase, BsCrosshair, BsAt } from "react-icons/bs";
import { validate } from "@upstart.gg/sdk/shared/utils/schema";
import type { TSchema } from "@sinclair/typebox";
import { type Query, querySchema } from "@upstart.gg/sdk/shared/datasources/types";
import { getDatasourceIndexedFieldsWithTitles } from "@upstart.gg/sdk/shared/datasources";
import { Fragment, useCallback, useState, useEffect } from "react";
import { useDraftHelpers, usePage, usePagePathParams, useQueries } from "../hooks/use-page-data";
import { useDatasource, useDatasources } from "../hooks/use-datasource";
import { FieldTitle } from "./json-form/field-factory";
import { TbPlus } from "react-icons/tb";
import { RxCross2 } from "react-icons/rx";
import { tx } from "@upstart.gg/style-system/twind";
import debounce from "lodash-es/debounce";
import { nanoid } from "nanoid";
import { LuPlus } from "react-icons/lu";
import TagsInput, { TagsSelect } from "./TagsInput";
import { FiEdit } from "react-icons/fi";
import { RiBracesLine } from "react-icons/ri";

export default function Modal() {
  const modal = useModal();
  const { hideModal } = useEditorHelpers();
  return (
    <Dialog.Root
      open={!!modal}
      onOpenChange={(open) => {
        if (!open) {
          hideModal();
        }
      }}
    >
      {modal === "queries" && <ModalQueriesEdtor />}
    </Dialog.Root>
  );
}

function ModalQueriesEdtor() {
  const [editingQuery, setEditingQuery] = useState<Query | null>(null);
  const queries = useQueries();
  const [showCreationForm, setShowCreationForm] = useState(queries.length === 0);
  const datasources = useDatasources();
  return (
    <Dialog.Content
      aria-describedby="Queries management"
      maxWidth="860px"
      minHeight="80dvh"
      className="overflow-y-clip flex flex-col gap-y-2"
    >
      <Dialog.Title className="flex items-center gap-3 pl-0 -ml-3">
        <BsDatabaseDown className="h-6 w-6 text-upstart-600" />
        Manage queries
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
        Queries fetch data from your database. Once defined, a query can be referenced throughout your pages
        to loop through results and display dynamic content using placeholders.
      </Dialog.Description>
      {showCreationForm && (
        <QueryCreator
          key={editingQuery?.alias ?? "new-query"}
          query={editingQuery}
          onClose={() => setShowCreationForm(false)}
        />
      )}
      {queries.length === 0 && (
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
              key={query.alias}
              className="flex items-center justify-between p-4 [&:not(:last-child)]:border-b border-gray-200 "
            >
              <div className="flex flex-col gap-2">
                <div className="font-medium">{query.label}</div>
                <div className="flex gap-6 items-center justify-start text-sm  text-gray-500">
                  <Tooltip content={`Alias`}>
                    <span className="inline-flex gap-1 items-center cursor-help">
                      <RiBracesLine className="text-upstart-500" />
                      {query.alias}
                    </span>
                  </Tooltip>
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

                  {/* {(query.parameters?.length ?? 0) > 0 && (
                    <Tooltip content={`Parameters`}>
                      <span className="inline-flex gap-1 items-center cursor-help">
                        <BsCrosshair className="text-upstart-500" />
                        {query.parameters!.join(", ")}
                      </span>
                    </Tooltip>
                  )} */}
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
    parameters: {
      op: "and" as const,
      fields: [],
    },
    sort: [{ field: "$publicationDate", direction: "desc" }],
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
  const pagePathParams = usePagePathParams();

  // Get Indexed Fields
  const indexedFields = datasource ? getDatasourceIndexedFieldsWithTitles(datasource) : [];
  // Don't consider $id and $slug for sorting
  const sortableFields = indexedFields.filter((field) => ["$id", "$slug"].includes(field.value) === false);

  // Extract simple parameters from the expression structure
  const parameters = query?.parameters?.fields?.filter((f) => "field" in f) ?? [];

  // Extract sort information from the array
  const sorts = query?.sort ?? [];

  // Check if any parameter field has a fulltext index
  const hasFulltextParameter = () => {
    if (!datasource) return false;

    return parameters.some((param) => {
      // Check if this parameter's field has a fulltext index
      return datasource.indexes.some(
        (index) => index.fulltext === true && index.fields.includes(param.field),
      );
    });
  };

  const showMatchSort = hasFulltextParameter();

  // Clean up invalid match() sorts when fulltext parameters are removed
  useEffect(() => {
    if (!showMatchSort && sorts.some((sort) => sort === "match()")) {
      setQuery((prev) => ({
        ...prev,
        sort: sorts.filter((sort) => sort !== "match()"),
      }));
    }
  }, [showMatchSort, sorts]);

  // Handle general query changes
  const handleChange = (key: keyof Query, value: string | number) => {
    setQuery(
      (prev) =>
        ({
          ...prev,
          [key]: value,
        }) as Query,
    );
  };

  // Handle sort changes
  const addSort = () => {
    const newSort = {
      field: "",
      direction: "desc" as const,
    };
    setQuery((prev) => ({
      ...prev,
      sort: [...sorts, newSort],
    }));
  };

  const removeSort = (index: number) => {
    setQuery((prev) => ({
      ...prev,
      sort: sorts.filter((_, i) => i !== index),
    }));
  };

  const updateSort = (index: number, key: "field" | "direction", value: string) => {
    setQuery((prev) => {
      const newSorts = [...sorts] as Array<
        "random()" | "match()" | { field: string; direction: "asc" | "desc" }
      >;
      if (key === "field") {
        if (value === "random()" || value === "match()") {
          newSorts[index] = value;
        } else {
          newSorts[index] = { field: value, direction: "desc" as const };
        }
      } else if (key === "direction" && typeof newSorts[index] === "object") {
        newSorts[index] = {
          ...(newSorts[index] as { field: string; direction: "asc" | "desc" }),
          direction: value as "asc" | "desc",
        };
      }
      return {
        ...prev,
        sort: newSorts,
      };
    });
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

  const addParameter = () => {
    const newParam = {
      field: "",
      op: "eq" as const,
      value: "",
    };
    setQuery((prev) => {
      const currentParams = prev?.parameters?.fields?.filter((f) => "field" in f) ?? [];
      return {
        ...prev,
        parameters: {
          op: "and" as const,
          fields: [...currentParams, newParam],
        },
      };
    });
  };

  const removeParameter = (index: number) => {
    setQuery((prev) => {
      const currentParams = prev?.parameters?.fields?.filter((f) => "field" in f) ?? [];
      const newParams = currentParams.filter((_, i) => i !== index);
      return {
        ...prev,
        parameters: {
          op: "and" as const,
          fields: newParams,
        },
      };
    });
  };

  const updateParameter = (index: number, key: string, value: string | number | boolean | string[]) => {
    setQuery((prev) => {
      const currentParams = [...(prev?.parameters?.fields?.filter((f) => "field" in f) ?? [])];
      const currentParam = { ...currentParams[index] };

      if (key === "field") {
        const op = (
          value ? (getOperatorOptionsForField(value as string)[0]?.value ?? "eq") : "eq"
        ) as typeof currentParam.op;
        // @ts-ignore partial update
        currentParams[index] = { field: value as string, op, value: "" };
      } else if (key === "op") {
        // @ts-ignore partial update
        currentParams[index] = { ...currentParam, op: value as typeof currentParam.op, value: "" };
      } else {
        // value can be string, number, boolean or string[]
        currentParams[index] = { ...currentParam, [key]: value };
      }

      return {
        ...prev,
        parameters: {
          op: "and" as const,
          fields: currentParams,
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
        const validated = validate<typeof querySchema>(querySchema, query);
        upsertQuery(validated);
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
      <h3 className="font-bold text-[110%] mb-5">
        {initialQuery ? "Edit query" : "Create a new query"}:{" "}
        <span className="text-gray-500">{query?.label}</span>
      </h3>
      <div className="flex flex-col text-sm flex-1 -mx-2.5 divide-y divide-gray-200">
        {/* Database Selection */}
        <div className="flex justify-between gap-4 flex-1 items-center p-3">
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
            <FieldTitle
              withIcon
              className="font-medium"
              title="Alias"
              description="Unique identifier to reference this query"
            />
            <TextField.Root
              onInput={(e) => handleChange("alias", e.currentTarget.value)}
              pattern="^[a-zA-Z_][a-zA-Z0-9_]*$"
              defaultValue={query?.alias}
              maxLength={querySchema.properties.alias.maxLength}
              aria-required
              placeholder="Ex: latestBlogPosts"
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
                      parameters: {
                        op: "and" as const,
                        fields: [],
                      },
                    }) satisfies Partial<Query>,
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

        {/* Parameters Section */}
        {indexedFields.length > 0 && (
          <div className="flex flex-col gap-1 flex-1 justify-between p-3">
            <div className="flex flex-1 w-full justify-between items-center">
              <FieldTitle
                withIcon
                title="Parameters"
                className="font-medium"
                description="Add parameters to narrow down your query"
              />
              <Button type="button" radius="full" variant="soft" size="1" onClick={addParameter}>
                <TbPlus className="w-3 h-3" />
                Add parameter
              </Button>
            </div>
            {parameters.length > 0 && (
              <div className="flex flex-col gap-3 mt-1">
                {parameters.map((param, index) => (
                  <Fragment key={index}>
                    <div className="flex gap-x-3 gap-y-0.5 items-center">
                      {/* Field Selector */}
                      <div className="w-[200px] flex items-center gap-3 pr-1">
                        <Select.Root
                          defaultValue={param.field}
                          onValueChange={(value: string) => updateParameter(index, "field", value)}
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
                      <div className={tx("flex gap-2 items-center w-[120px]", !param.field && "hidden")}>
                        {/* <BsArrowReturnRight className="w-3 h-3 ml-1 mr-1.5 !shrink-0" /> */}
                        <Select.Root
                          key={`operator-${index}-${param.field}`} // Force re-render when field changes
                          defaultValue={param.op}
                          size="2"
                          onValueChange={(value: string) => updateParameter(index, "op", value)}
                          disabled={!param.field}
                        >
                          <Select.Trigger
                            radius="medium"
                            variant="ghost"
                            placeholder="Select operator"
                            className="!flex-1 !mr-1"
                          />
                          <Select.Content position="popper">
                            <Select.Group>
                              {getOperatorOptionsForField(param.field).map((option) => (
                                <Select.Item key={option.value} value={option.value}>
                                  {option.label}
                                </Select.Item>
                              ))}
                            </Select.Group>
                          </Select.Content>
                        </Select.Root>
                      </div>

                      {/* Value Input - for relative dates, use two columns, otherwise span both */}
                      {getFieldType(param.field) === "date" || getFieldType(param.field) === "datetime" ? (
                        (param.op === "before" || param.op === "after" || param.op === "eq") && (
                          // Absolute date: span both columns
                          <div className={tx("grow flex justify-end", !param.field && "hidden")}>
                            <TextField.Root
                              size="2"
                              type={getFieldType(param.field) === "datetime" ? "datetime-local" : "date"}
                              defaultValue={String(param.value || "")}
                              onChange={(e) => updateParameter(index, "value", e.target.value)}
                              disabled={!param.field}
                              className="!w-full"
                            />
                          </div>
                        )
                      ) : (
                        // Non-date fields: span both columns
                        <div className={tx("grow flex justify-end", !param.field && "hidden")}>
                          {getFieldType(param.field) === "number" ||
                          getFieldType(param.field) === "integer" ? (
                            <TextField.Root
                              type="number"
                              size="2"
                              defaultValue={String(param.value || "")}
                              onChange={(e) => updateParameter(index, "value", Number(e.target.value))}
                              placeholder="Value"
                              min="1"
                              disabled={!param.field}
                              className="!w-full"
                            />
                          ) : getFieldType(param.field) === "boolean" ? (
                            <SegmentedControl.Root
                              size="1"
                              defaultValue={String(param.value || "true")}
                              onValueChange={(value) => updateParameter(index, "value", value === "true")}
                              className={tx("!mt-0.5 [&_.rt-SegmentedControlItemLabel]:(px-3)")}
                            >
                              <SegmentedControl.Item value="true">True</SegmentedControl.Item>
                              <SegmentedControl.Item value="false">False</SegmentedControl.Item>
                            </SegmentedControl.Root>
                          ) : getFieldType(param.field) === "array" ? (
                            // <TagsInput
                            //   initialValue={Array.isArray(filter.value) ? filter.value : []}
                            //   onChange={(value) => updateFilter(index, "value", value)}
                            //   className="!w-full"
                            //   placeholder="Add tags"
                            // />
                            <TagsSelect
                              options={pagePathParams.map((field) => ({
                                value: field,
                                label: field,
                              }))}
                              initialValue={Array.isArray(param.value) ? param.value : []}
                              isMulti
                              onChange={(value) => updateParameter(index, "value", value ?? [])}
                              className="!w-full min-w-fit max-w-full"
                              placeholder="Add parameters (e.g. Slug, Id)"
                            />
                          ) : (
                            <TextField.Root
                              disabled={!param.field}
                              defaultValue={String(param.value || "")}
                              onChange={debounce((e) => updateParameter(index, "value", e.target.value), 400)}
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
                        onClick={() => removeParameter(index)}
                      >
                        <RxCross2 size={14} />
                      </IconButton>
                    </div>

                    {index < parameters.length - 1 && (
                      <div className="border-t border-dotted mx-auto w-2/3 border-gray-200 my-2 relative">
                        <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-gray-50 rounded-full px-2 py-1 inline-block text-xs text-gray-500">
                          {/* The following "and" should be a switch that allow user to switch between "and" and "or" */}
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

        {/* Sort Fields Section */}
        {query?.datasourceId && (
          <div className="flex flex-col gap-2 flex-1 justify-between p-3">
            <div className="flex flex-1 w-full justify-between items-center">
              <FieldTitle
                withIcon
                title="Sort results by"
                className="font-medium"
                description="Add sort criteria to order your query results"
              />
              <Button type="button" radius="full" variant="soft" size="1" onClick={addSort}>
                <TbPlus className="w-3 h-3" />
                Add sort
              </Button>
            </div>
            {sorts.length > 0 && (
              <div className="flex flex-col gap-3 mt-1">
                {sorts.map((sort, index) => {
                  const isSpecialSort = sort === "random()" || sort === "match()";
                  const sortField = typeof sort === "object" ? sort.field : sort;
                  const sortDirection = typeof sort === "object" ? sort.direction : "desc";

                  return (
                    <Fragment key={index}>
                      <div className="flex gap-x-3 gap-y-0.5 items-center">
                        {/* Field Selector */}
                        <div className="w-[200px] flex items-center gap-3 pr-1">
                          <Select.Root
                            defaultValue={sortField}
                            onValueChange={(value: string) => updateSort(index, "field", value)}
                          >
                            <Select.Trigger
                              className="!w-full"
                              radius="medium"
                              variant="surface"
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
                                {showMatchSort && (
                                  <Select.Item value="match()">Match (Full-text search)</Select.Item>
                                )}
                              </Select.Group>
                            </Select.Content>
                          </Select.Root>
                        </div>

                        {/* Direction Selector */}
                        <div className={tx("flex gap-2 items-center w-[120px]", isSpecialSort && "hidden")}>
                          <Select.Root
                            key={`direction-${index}-${sortField}`}
                            defaultValue={sortDirection}
                            size="2"
                            onValueChange={(value: string) => updateSort(index, "direction", value)}
                            disabled={isSpecialSort}
                          >
                            <Select.Trigger
                              radius="medium"
                              variant="ghost"
                              placeholder="Select direction"
                              className="!flex-1 !mr-1"
                            />
                            <Select.Content position="popper">
                              <Select.Group>
                                <Select.Item value="asc">Ascending</Select.Item>
                                <Select.Item value="desc">Descending</Select.Item>
                              </Select.Group>
                            </Select.Content>
                          </Select.Root>
                        </div>

                        {/* Empty space to align with parameters */}
                        <div className="grow" />

                        <IconButton
                          size="1"
                          type="button"
                          variant="ghost"
                          className="hover:(bg-red-100 text-red-800) !shrink-0 !ml-auto"
                          onClick={() => removeSort(index)}
                        >
                          <RxCross2 size={14} />
                        </IconButton>
                      </div>

                      {index < sorts.length - 1 && (
                        <div className="border-t border-dotted mx-auto w-2/3 border-gray-200 my-2 relative">
                          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-gray-50 rounded-full px-2 py-1 inline-block text-xs text-gray-500">
                            Then by
                          </span>
                        </div>
                      )}
                    </Fragment>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {query?.datasourceId && indexedFields.length > 0 && (
          <div className="flex flex-1 gap-6 justify-between items-center p-3">
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
