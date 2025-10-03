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
import type { TSchema, Static } from "@sinclair/typebox";
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
import { MdSwapVert } from "react-icons/md";

type ParameterExpression = NonNullable<Query["parameters"]>;
type ParameterField = Extract<ParameterExpression["fields"][number], { field: string }>;
type ParameterGroup = Extract<ParameterExpression["fields"][number], { op: "and" | "or" }>;

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

  // Helper to update nested parameters structure
  const updateParametersAtPath = (
    path: number[],
    updater: (fields: ParameterExpression["fields"]) => ParameterExpression["fields"],
  ) => {
    setQuery((prev) => {
      if (!prev.parameters) return prev;

      const newParameters = JSON.parse(JSON.stringify(prev.parameters)) as ParameterExpression;

      let current: ParameterExpression | ParameterGroup = newParameters;
      for (let i = 0; i < path.length; i++) {
        current = current.fields[path[i]] as ParameterGroup;
      }

      current.fields = updater(current.fields);

      return {
        ...prev,
        parameters: newParameters,
      };
    });
  };

  // Add a field parameter at a specific path
  const addParameter = (path: number[] = []) => {
    const newParam: ParameterField = {
      field: "",
      op: "eq" as const,
      value: "",
    };

    if (path.length === 0) {
      setQuery((prev) => ({
        ...prev,
        parameters: {
          op: prev.parameters?.op || "and",
          fields: [...(prev.parameters?.fields || []), newParam],
        },
      }));
    } else {
      updateParametersAtPath(path, (fields) => [...fields, newParam]);
    }
  };

  // Add a nested group (and/or) at a specific path
  const addParameterGroup = (path: number[] = [], op: "and" | "or" = "and") => {
    const newGroup: ParameterGroup = {
      op,
      fields: [
        // Add a default empty parameter to the new group
        {
          field: "",
          op: "eq" as const,
          value: "",
        },
      ],
    };

    if (path.length === 0) {
      setQuery((prev) => ({
        ...prev,
        parameters: {
          op: prev.parameters?.op || "and",
          fields: [...(prev.parameters?.fields || []), newGroup],
        },
      }));
    } else {
      updateParametersAtPath(path, (fields) => [...fields, newGroup]);
    }
  };

  // Remove parameter at path
  const removeParameterAtPath = (path: number[]) => {
    if (path.length === 1) {
      setQuery((prev) => ({
        ...prev,
        parameters: {
          op: prev.parameters?.op || "and",
          fields: prev.parameters?.fields.filter((_, i) => i !== path[0]) || [],
        },
      }));
    } else {
      const parentPath = path.slice(0, -1);
      const index = path[path.length - 1];
      updateParametersAtPath(parentPath, (fields) => fields.filter((_, i) => i !== index));
    }
  };

  // Update field parameter at path
  const updateParameterAtPath = (
    path: number[],
    key: string,
    value: string | number | boolean | string[],
  ) => {
    setQuery((prev) => {
      if (!prev.parameters) return prev;

      const newParameters = JSON.parse(JSON.stringify(prev.parameters)) as ParameterExpression;

      let current: ParameterExpression | ParameterGroup = newParameters;
      for (let i = 0; i < path.length - 1; i++) {
        current = current.fields[path[i]] as ParameterGroup;
      }

      const index = path[path.length - 1];
      const param = current.fields[index] as ParameterField;

      if (key === "field") {
        const op = (
          value ? (getOperatorOptionsForField(value as string)[0]?.value ?? "eq") : "eq"
        ) as typeof param.op;
        current.fields[index] = { field: value as string, op, value: "" } as ParameterField;
      } else if (key === "op") {
        current.fields[index] = {
          ...param,
          op: value as typeof param.op,
          value: param.value,
        } as ParameterField;
      } else {
        current.fields[index] = { ...param, [key]: value } as ParameterField;
      }

      return {
        ...prev,
        parameters: newParameters,
      };
    });
  };

  // Toggle group operator (and <-> or)
  const toggleGroupOperator = (path: number[]) => {
    setQuery((prev) => {
      if (!prev.parameters) return prev;

      if (path.length === 0) {
        return {
          ...prev,
          parameters: {
            ...prev.parameters,
            op: prev.parameters.op === "and" ? "or" : "and",
          },
        };
      }

      const newParameters = JSON.parse(JSON.stringify(prev.parameters)) as ParameterExpression;

      let current: ParameterExpression | ParameterGroup = newParameters;
      for (let i = 0; i < path.length; i++) {
        current = current.fields[path[i]] as ParameterGroup;
      }

      current.op = current.op === "and" ? "or" : "and";

      return {
        ...prev,
        parameters: newParameters,
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

  // Recursive component to render parameter groups
  const ParameterGroupRenderer = ({
    group,
    path,
    depth = 0,
  }: {
    group: ParameterExpression;
    path: number[];
    depth?: number;
  }) => {
    const isRootGroup = path.length === 0;
    const maxDepth = 3;
    const canAddGroup = depth < maxDepth - 1; // Allow groups up to 3 levels (0, 1, 2)

    return (
      <div
        className={tx(
          "flex flex-col gap-2 rounded-lg",
          !isRootGroup && "border border-gray-300 bg-white p-3 shadow-sm",
        )}
      >
        {/* Group delete button for nested groups */}
        {!isRootGroup && (
          <div className="flex items-center justify-end -mb-1">
            <IconButton
              size="1"
              type="button"
              variant="ghost"
              className="hover:(bg-red-100 text-red-800)"
              onClick={() => removeParameterAtPath(path)}
            >
              <RxCross2 size={14} />
            </IconButton>
          </div>
        )}

        {/* Render fields and nested groups */}
        <div className="flex flex-col gap-3">
          {group.fields.map((item, index) => {
            const itemPath = [...path, index];

            // Check if it's a field or a nested group
            if ("field" in item) {
              // It's a parameter field
              const param = item as ParameterField;

              return (
                <Fragment key={index}>
                  <div className="flex gap-x-3 gap-y-0.5 items-center">
                    {/* Field Selector */}
                    <div className="w-[200px] flex items-center gap-3 pr-1">
                      <Select.Root
                        value={param.field}
                        onValueChange={(value: string) => updateParameterAtPath(itemPath, "field", value)}
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
                      <Select.Root
                        key={`operator-${itemPath.join("-")}-${param.field}`}
                        value={param.op}
                        size="2"
                        onValueChange={(value: string) => updateParameterAtPath(itemPath, "op", value)}
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

                    {/* Value Input */}
                    {renderParameterValueInput(param, itemPath)}

                    <IconButton
                      size="1"
                      type="button"
                      variant="ghost"
                      className="hover:(bg-red-100 text-red-800) !shrink-0 !ml-auto"
                      onClick={() => removeParameterAtPath(itemPath)}
                    >
                      <RxCross2 size={14} />
                    </IconButton>
                  </div>

                  {index < group.fields.length - 1 && (
                    <div className="flex items-center justify-center border-t border-dotted mx-auto w-2/3 border-gray-200 my-3 relative z-10">
                      <Button
                        type="button"
                        size="1"
                        variant="soft"
                        className="!-top-3 !absolute z-20 !opacity-100 !text-xs"
                        onClick={() => toggleGroupOperator(path)}
                      >
                        {group.op === "and" ? "And" : "Or"}
                      </Button>
                    </div>
                  )}
                </Fragment>
              );
            } else {
              // It's a nested group
              const nestedGroup = item as ParameterGroup;

              return (
                <Fragment key={index}>
                  <ParameterGroupRenderer group={nestedGroup} path={itemPath} depth={depth + 1} />
                  {index < group.fields.length - 1 && (
                    <div className="flex items-center justify-center border-t border-dotted mx-auto w-2/3 border-gray-200 my-3 relative z-10">
                      <Button
                        type="button"
                        size="1"
                        variant="soft"
                        radius="large"
                        className="!-top-3 !absolute z-20 !opacity-100 !text-xs"
                        onClick={() => toggleGroupOperator(path)}
                      >
                        {group.op === "and" ? "And" : "Or"}
                      </Button>
                    </div>
                  )}
                </Fragment>
              );
            }
          })}
        </div>

        {/* Add buttons at the bottom of each group, except for the root group */}
        {depth > 0 && (
          <div className="flex gap-2 mt-2 pt-2 border-t border-gray-200 justify-end items-center">
            <Button type="button" radius="full" variant="surface" size="1" onClick={() => addParameter(path)}>
              <TbPlus className="w-3 h-3" />
              Add parameter
            </Button>
            {canAddGroup && (
              <Button
                type="button"
                radius="full"
                variant="soft"
                size="1"
                onClick={() => addParameterGroup(path, group.op === "and" ? "or" : "and")}
              >
                <TbPlus className="w-3 h-3" />
                Add group
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  // Helper to render parameter value input
  const renderParameterValueInput = (param: ParameterField, path: number[]) => {
    const fieldType = getFieldType(param.field);

    if (fieldType === "date" || fieldType === "datetime") {
      if (param.op === "before" || param.op === "after" || param.op === "eq") {
        return (
          <div className={tx("grow flex justify-end", !param.field && "hidden")}>
            <TextField.Root
              size="2"
              type={fieldType === "datetime" ? "datetime-local" : "date"}
              value={String(param.value || "")}
              onChange={(e) => updateParameterAtPath(path, "value", e.target.value)}
              disabled={!param.field}
              className="!w-full"
            />
          </div>
        );
      }
      return null;
    }

    return (
      <div className={tx("grow flex justify-end", !param.field && "hidden")}>
        {fieldType === "number" || fieldType === "integer" ? (
          <TextField.Root
            type="number"
            size="2"
            value={String(param.value || "")}
            onChange={(e) => updateParameterAtPath(path, "value", Number(e.target.value))}
            placeholder="Value"
            min="1"
            disabled={!param.field}
            className="!w-full"
          />
        ) : fieldType === "boolean" ? (
          <SegmentedControl.Root
            size="1"
            value={String(param.value || "true")}
            onValueChange={(value) => updateParameterAtPath(path, "value", value === "true")}
            className={tx("!mt-0.5 [&_.rt-SegmentedControlItemLabel]:(px-3)")}
          >
            <SegmentedControl.Item value="true">True</SegmentedControl.Item>
            <SegmentedControl.Item value="false">False</SegmentedControl.Item>
          </SegmentedControl.Root>
        ) : fieldType === "array" ? (
          <TagsSelect
            options={pagePathParams.map((field) => ({
              value: field,
              label: field,
            }))}
            initialValue={Array.isArray(param.value) ? param.value : []}
            isMulti
            onChange={(value) => updateParameterAtPath(path, "value", value ?? [])}
            className="!w-full min-w-fit max-w-full"
            placeholder="Add parameters (e.g. Slug, Id)"
          />
        ) : (
          <TextField.Root
            disabled={!param.field}
            value={String(param.value || "")}
            onChange={debounce((e) => updateParameterAtPath(path, "value", e.target.value), 400)}
            placeholder="Value"
            size="2"
            className="!w-full max-w-full"
          />
        )}
      </div>
    );
  };

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
          <div className="flex flex-col gap-2 flex-1">
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
          <div className="flex flex-col gap-2 flex-1">
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
          <div className="flex flex-col gap-2 flex-1">
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
          <div className="flex flex-col gap-2 flex-1 justify-between p-3">
            <div className="flex flex-1 w-full justify-between items-center">
              <FieldTitle
                withIcon
                title="Parameters"
                className="font-medium"
                description="Add parameters to narrow down your query"
              />
              <div className="flex gap-2 justify-end items-center">
                <Button type="button" radius="full" variant="surface" size="1" onClick={() => addParameter()}>
                  <TbPlus className="w-3 h-3" />
                  Add parameter
                </Button>
                <Button
                  type="button"
                  radius="full"
                  variant="soft"
                  size="1"
                  onClick={() => addParameterGroup()}
                >
                  <TbPlus className="w-3 h-3" />
                  Add group
                </Button>
              </div>
            </div>
            {query?.parameters && <ParameterGroupRenderer group={query.parameters} path={[]} />}
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
              <div className="flex flex-col gap-3">
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
