import { queryUseSchema, type QueryUseSettings } from "@upstart.gg/sdk/shared/bricks/props/dynamic";
import {
  Button,
  Dialog,
  IconButton,
  SegmentedControl,
  Select,
  TextField,
  Tooltip,
} from "@upstart.gg/style-system/system";
import { Fragment, startTransition, useCallback, useState, type FC } from "react";
import { BsAt, BsCrosshair, BsDatabaseAdd, BsDatabaseDown } from "react-icons/bs";
import type { FieldProps } from "./types";
import { FieldTitle } from "../field-factory";
import { usePagePathParams, useSiteQueries, useSiteQuery } from "~/editor/hooks/use-page-data";
import { useDatasource, useDatasources } from "~/editor/hooks/use-datasource";
import { FiEdit } from "react-icons/fi";
import { tx } from "@upstart.gg/style-system/twind";
import { LuPlus } from "react-icons/lu";
import type { TSchema } from "@sinclair/typebox";
import { ajv } from "@upstart.gg/sdk/shared/ajv";
import TagsInput, { TagsSelect } from "../../TagsInput";

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

const nanoIdOperators = [{ value: "eq", label: "Equals" }];

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

function getOperatorLabel(operator: string) {
  const allOperators = [
    ...baseOperators,
    ...stringOperators,
    ...nanoIdOperators,
    ...arrayOperators,
    ...numberOperators,
    ...dateOperators,
  ];
  return allOperators.find((op) => op.value === operator)?.label;
}

function getValueLabel(value: NonNullable<QueryUseSettings["params"]>[number]["value"]) {
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  return "";
}

const QueryField: FC<FieldProps<QueryUseSettings[] | undefined>> = (props) => {
  const { currentValue = [], onChange, schema, title, description, brickId } = props;
  const datasources = useDatasources();
  const availableQueries = useSiteQueries();
  const [showModal, setShowModal] = useState(false);

  // If there are no datasources, we cannot create queries
  if (!datasources.length) {
    return (
      <div className="field field-query basis-full">
        <FieldTitle title={title} description={description} />
        <div className="text-sm text-gray-500">
          No database available. Create a database first so you can create queries.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 gap-2">
      <div className="query-field flex items-center justify-between flex-1">
        <FieldTitle withIcon title={title} description={description} />
        {availableQueries.length > 0 && (
          <Button
            variant="soft"
            size="1"
            radius="full"
            type="button"
            onClick={() => {
              setShowModal(true);
            }}
          >
            Manage page queries
          </Button>
        )}
      </div>
      <div className="basis-full flex flex-col gap-2">
        {availableQueries.length === 0 && (
          <div className="text-sm text-gray-500">
            No queries available. Create a query first so you can use it in this page.
          </div>
        )}
        {currentValue.length > 0 && (
          <ul className="list-none p-0 m-0 mt-2 ml-3 font-normal">
            {currentValue.map((query, index) => (
              <li key={index} className="flex items-center gap-1.5 mb-2">
                <BsDatabaseAdd />
                {availableQueries.find((q) => q.id === query.queryId)?.label}{" "}
                <span className="text-gray-500 text-xs">({query.alias})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      <QueryModal
        onChange={onChange}
        queries={currentValue}
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

function QueryModal({
  queries: initialQueries,
  open,
  onClose,
  onChange,
}: {
  queries: QueryUseSettings[];
  open: boolean;
  onClose: () => void;
  onChange: (queries: QueryUseSettings[]) => void;
}) {
  const availableQueries = useSiteQueries();
  const [showCreationForm, setShowCreationForm] = useState(initialQueries.length === 0);
  const [editingQuery, setEditingQuery] = useState<QueryUseSettings | null>(null);
  const [queries, setQueries] = useState<QueryUseSettings[]>(initialQueries);

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onClose?.();
        }
      }}
    >
      <Dialog.Content
        aria-describedby="Queries managament"
        maxWidth="760px"
        minHeight="80dvh"
        className="overflow-y-clip flex flex-col gap-y-2"
      >
        <Dialog.Title className="flex items-center gap-3 pl-0 -ml-3">
          <BsDatabaseDown className="h-6 w-6 text-upstart-600" />
          Page queries
          {queries.length < 5 && (
            <Button
              size="2"
              variant="outline"
              radius="medium"
              className={tx("!ml-auto", showCreationForm && "!opacity-0")}
              onClick={() => {
                setEditingQuery(null);
                setShowCreationForm(true);
              }}
            >
              <LuPlus className="w-4 h-4" />
              Add Query
            </Button>
          )}
        </Dialog.Title>
        <Dialog.Description>
          Page queries can be used for fetching dynamic content and use it in your page. You can specify
          parameters for queries that accept them. Up to 5 queries can be set for a page.
        </Dialog.Description>
        {showCreationForm && (
          <QueryEditor
            showCancelBtn={initialQueries.length > 0}
            query={editingQuery}
            onChange={(query) => {
              setQueries((prev) => prev.filter((q) => q.alias !== query.alias).concat(query));
              setShowCreationForm(false);
              startTransition(() => {
                onChange(queries);
              });
            }}
            onClose={() => setShowCreationForm(false)}
          />
        )}

        {queries.length > 0 && (
          <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden -mx-1 mt-3 shadow-sm">
            {queries.map((query) => (
              <div
                key={query.queryId}
                className="flex items-center justify-between p-4 [&:not(:last-child)]:border-b border-gray-200 "
              >
                <div className="flex flex-col gap-2">
                  <span className="font-medium">
                    {availableQueries.find((q) => q.id === query.queryId)?.label}
                  </span>
                  <div className="flex gap-6 items-center justify-start text-sm  text-gray-500">
                    <Tooltip content={`Alias`}>
                      <span className="inline-flex gap-1 items-center cursor-help">
                        <BsAt className="text-upstart-500" />
                        {query.alias}
                      </span>
                    </Tooltip>
                    {(query.params?.length ?? 0) > 0 && (
                      <Tooltip content={`Parameters`}>
                        <span className="inline-flex gap-1 items-center cursor-help">
                          <BsCrosshair className="text-upstart-500" />
                          {query.params?.map((p) => (
                            <div key={p.field} className="inline-flex gap-1 items-center">
                              <span className="font-medium">{p.field}</span>
                              <span>{getOperatorLabel(p.op)?.toLocaleLowerCase()}</span>
                              <span className="font-medium">{getValueLabel(p.value)}</span>
                            </div>
                          ))}
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
    </Dialog.Root>
  );
}

function QueryEditor({
  query: initialQuery,
  onClose,
  showCancelBtn,
  onChange,
}: {
  showCancelBtn: boolean;
  query?: QueryUseSettings | null;
  onClose?: () => void;
  onChange: (query: QueryUseSettings) => void;
}) {
  const [query, setQuery] = useState<Partial<QueryUseSettings>>(
    initialQuery ?? {
      params: [],
    },
  );
  const queryReference = useSiteQuery(query?.queryId);
  const params = queryReference?.parameters ?? [];

  const reset = () => {
    setQuery({
      params: [],
    });
  };

  const datasource = useDatasource(queryReference?.datasourceId);
  const availableQueries = useSiteQueries();
  const pageParams = usePagePathParams();

  const validateQuery = () => {
    return ajv.validate(queryUseSchema, query) && validateParams();
  };

  const validateParams = () => {
    for (const p of params) {
      const schema = datasource?.schema?.items?.properties?.[p];
      if (schema) {
        const value = query.params?.find((f) => f.field === p)?.value;
        // Validate the parameter against the schema
        const valid = ajv.validate(schema, value);
        console.log(`Validating param ${p}:`, { valid, value, schema });
        if (!valid) {
          return false;
        }
      }
    }
    return true;
  };

  // Function to get operators based on field type
  const getOperatorOptionsForField = (fieldName: string) => {
    if (!datasource) return [];
    const fieldType = getFieldType(fieldName);

    switch (fieldType) {
      case "array":
        return arrayOperators;
      case "nanoid":
        return nanoIdOperators;
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

  const updateParam = (
    name: string,
    key: string,
    value: string | number | boolean | string[] | undefined,
  ) => {
    console.log("Updating param:", { name, key, value });
    setQuery((prev) => {
      const currentParams = [...(prev?.params ?? [])];
      const currentParam = currentParams.find((p) => p.field === name) ?? {
        field: name,
        op: "eq",
        value: "",
      };
      const currentParamIndex = currentParams.findIndex((p) => p.field === name);

      if (currentParamIndex === -1) {
        console.warn("Current param not found:", { name, key, value });
        console.warn("Current params:", currentParams);
        return prev;
      }

      if (key === "field") {
        const op = (
          value ? (getOperatorOptionsForField(value as string)[0]?.value ?? "eq") : "eq"
        ) as typeof currentParam.op;
        // @ts-ignore partial update
        currentParams[currentParamIndex] = { field: value as string, op, value: "" };
      } else if (key === "op") {
        // @ts-ignore
        currentParams[currentParamIndex] = {
          ...currentParam,
          op: value as typeof currentParam.op,
          value: "",
        };
      } else {
        // value can be string, number, boolean or string[]
        currentParams[currentParamIndex] = { ...currentParam, [key]: value };
      }

      console.log("Updated params:", currentParams);
      return {
        ...prev,
        params: currentParams,
      };
    });
  };

  // Function to get the field type based on the datasource schema
  const getFieldType = (fieldName: string): string => {
    if (!datasource) return "string";
    const property = datasource.schema?.items?.properties?.[fieldName] as TSchema | undefined;
    if (property?.type === "string" && property.format === "date") return "date";
    if (property?.type === "string" && property.format === "date-time") return "datetime";
    if (property?.type === "string" && property.format === "nanoid") return "nanoid";
    return property?.type ?? "string";
  };

  function getFieldName(paramName: string) {
    return (datasource?.schema?.items?.properties?.[paramName].title ?? "") as string;
  }

  function getFieldOp(paramName: string) {
    return query.params?.find((p) => p.field === paramName)?.op ?? "eq";
  }

  function getFieldValue(paramName: string, defaultValue: string | number | boolean | string[] = "") {
    console.log("Getting field value:", { paramName, params: query.params });
    return query.params?.find((p) => p.field === paramName)?.value ?? defaultValue;
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleSubmit = useCallback(() => {
    console.log("Submitting query:", query);
    if (validateQuery()) {
      // upsertQuery(query as Query);
      onChange(query as QueryUseSettings);
      onClose?.();
    } else {
      console.error("Query validation failed:", ajv.errors, query);
    }
  }, [query]);

  return (
    <div className="text-sm border border-gray-300 bg-gray-50 p-4 rounded-lg -mx-1 mt-3 shadow-sm">
      <h3 className="font-bold text-base mb-3">{initialQuery ? "Edit query" : "Add query to use"}</h3>
      <div className="flex flex-col text-sm gap-4 flex-1 -mx-2.5 divide-y divide-gray-200">
        {/* Database Selection */}
        <div className="flex justify-between gap-4 flex-1 items-center py-0.5 px-2.5">
          <div className="flex flex-col gap-2 basis-1/2">
            <FieldTitle className="font-medium" title="Query" description="Select a query" />
            <Select.Root
              aria-required
              defaultValue={query?.queryId}
              size="2"
              onValueChange={(value: string) =>
                setQuery(
                  (prev) =>
                    ({
                      ...(prev ?? {}),
                      queryId: value,
                      params:
                        availableQueries
                          .find((q) => q.id === value)
                          ?.parameters?.map((p) => ({
                            field: p,
                            op: getFieldOp(p),
                          })) ?? [],
                    }) as QueryUseSettings,
                )
              }
            >
              <Select.Trigger
                radius="medium"
                variant="surface"
                placeholder="Select a query"
                className="!max-w-2/3 !mr-[1px]"
              />
              <Select.Content>
                <Select.Group>
                  <Select.Label>Available queries</Select.Label>
                  {availableQueries.map((q) => (
                    <Select.Item key={q.id} value={q.id}>
                      {q.label}
                    </Select.Item>
                  ))}
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
          <div className="flex flex-col basis-1/2 gap-2">
            <FieldTitle
              withIcon
              className="font-medium"
              title="Alias"
              description="Alias for the query results, used in dynamic content. Use a simple keyword without spaces or special characters. Aliases are unique across the page."
              containerClassName="!basis-0"
            />
            <TextField.Root
              defaultValue={query?.alias}
              placeholder="Ex: latestPosts"
              pattern="^[a-zA-Z0-9_]+$"
              onChange={(e) => {
                setQuery((prev) => ({
                  ...prev,
                  alias: e.target.value,
                }));
              }}
              className="!w-full"
            />
          </div>
        </div>

        {/* Params Section */}
        {params.length > 0 && (
          <div className="flex flex-col gap-2 flex-1 justify-between pt-3 px-2.5">
            <div className="flex flex-1 w-full justify-between items-center">
              <FieldTitle
                title="Parameters"
                className="font-medium"
                description="Specify parameters for this query"
              />
            </div>
            {params.length > 0 && (
              <div className="flex flex-col gap-3 mt-1">
                {params.map((param, index) => {
                  return (
                    <Fragment key={index}>
                      <div className="flex gap-x-3 gap-y-0.5 items-center">
                        {/* Field Selector */}
                        <div className="w-[200px] flex items-center gap-3 pr-1">{getFieldName(param)}</div>

                        {/* Operator Selector */}
                        <div className={tx("flex gap-2 items-center w-[120px]")}>
                          <Select.Root
                            key={`operator-${index}-${param}`} // Force re-render when field changes
                            defaultValue={getFieldOp(param)}
                            size="2"
                            onValueChange={(value: string) => updateParam(param, "op", value)}
                          >
                            <Select.Trigger
                              radius="medium"
                              variant="ghost"
                              placeholder="Select operator"
                              className="!flex-1 !mr-1"
                            />
                            <Select.Content position="popper">
                              <Select.Group>
                                {getOperatorOptionsForField(param).map((option) => (
                                  <Select.Item key={option.value} value={option.value}>
                                    {option.label}
                                  </Select.Item>
                                ))}
                              </Select.Group>
                            </Select.Content>
                          </Select.Root>
                        </div>

                        {/* Value Input - for relative dates, use two columns, otherwise span both */}
                        {getFieldType(param) === "date" || getFieldType(param) === "datetime" ? (
                          (getFieldOp(param) === "before" ||
                            getFieldOp(param) === "after" ||
                            getFieldOp(param) === "eq") && (
                            // Absolute date: span both columns
                            <div className={tx("grow flex justify-end")}>
                              <TextField.Root
                                size="2"
                                type={getFieldType(param) === "datetime" ? "datetime-local" : "date"}
                                defaultValue={String(getFieldValue(param))}
                                onChange={(e) => updateParam(param, "value", e.target.value)}
                                className="!w-full"
                              />
                            </div>
                          )
                        ) : (
                          // Non-date fields: span both columns
                          <div className={tx("grow flex justify-end")}>
                            {getFieldType(param) === "number" || getFieldType(param) === "integer" ? (
                              <TextField.Root
                                type="number"
                                size="2"
                                defaultValue={String(getFieldValue(param))}
                                onChange={(e) => updateParam(param, "value", Number(e.target.value))}
                                placeholder="Value"
                                min="1"
                                className="!w-full"
                              />
                            ) : getFieldType(param) === "boolean" ? (
                              <SegmentedControl.Root
                                size="1"
                                defaultValue={String(getFieldValue(param) || "true")}
                                onValueChange={(value) => updateParam(param, "value", value === "true")}
                                className={tx("!mt-0.5 [&_.rt-SegmentedControlItemLabel]:(px-3)")}
                              >
                                <SegmentedControl.Item value="true">True</SegmentedControl.Item>
                                <SegmentedControl.Item value="false">False</SegmentedControl.Item>
                              </SegmentedControl.Root>
                            ) : getFieldType(param) === "array" ? (
                              <TagsInput
                                initialValue={getFieldValue(param, []) as string[]}
                                onChange={(value) => updateParam(param, "value", value)}
                                className="!w-full"
                                placeholder="Add tags"
                              />
                            ) : (
                              // <TextField.Root
                              //   defaultValue={String(getFieldValue(param))}
                              //   onChange={debounce((e) => updateParam(index, "value", e.target.value), 400)}
                              //   placeholder="Value"
                              //   size="2"
                              //   className="!w-full max-w-full"
                              // />
                              <TagsSelect
                                isMulti={false}
                                creatable
                                clearable
                                initialValue={getFieldValue(param, []) as string[]}
                                onChange={(value) => updateParam(param, "value", value)}
                                className="!w-full"
                                placeholder="Value or variable"
                                options={pageParams.map((p) => ({
                                  label: p,
                                  value: p,
                                }))}
                              />
                            )}
                          </div>
                        )}
                      </div>

                      {index < params.length - 1 && (
                        <div className="border-t border-dotted mx-auto w-2/3 border-gray-200 my-2 relative">
                          <span className="absolute left-1/2 -translate-x-1/2 -top-3 bg-gray-50 rounded-full px-2 py-1 inline-block text-xs text-gray-500">
                            And
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
      </div>
      <div className="flex justify-end gap-2 mt-10">
        {showCancelBtn && (
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
        )}
        <Button disabled={validateQuery() === false} onClick={handleSubmit} size="2">
          {initialQuery ? "Save query" : "Add quer"}
        </Button>
      </div>
    </div>
  );
}

export default QueryField;
