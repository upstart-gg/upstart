import { typedRef } from "~/shared/utils/typed-ref";
import { type ObjectOptions, Type, type Static } from "@sinclair/typebox";
import { queryFilter } from "~/shared/datasources/types";

export function queryUse() {
  return Type.Object(
    {
      queryId: Type.String({
        description: "The Query ID to use for dynamic content.",
      }),
      alias: Type.String({
        title: "Alias",
        minLength: 1,
        maxLength: 100,
        pattern: "^[a-zA-Z0-9_]+$",
        description:
          "Alias for the query results, used in dynamic content. Use a simple keyword without spaces or special characters. Aliases are unique across the page.",
      }),
      params: Type.Optional(
        Type.Array(queryFilter, {
          description:
            "Additional query parameters/filters to apply to the query. One can use placeholders in values like ':slug' to reference URL parameters.",
          title: "Query Parameters",
          default: [],
        }),
      ),
      limit: Type.Optional(
        Type.Number({
          description:
            "Number of items from the query to loop through. If not set, it will loop through all items. If set to 1, it will not loop and will render only the first item.",
          minimum: 1,
          maximum: 100,
        }),
      ),
    },
    {
      title: "Query",
      description:
        "When set, this brick will loop through the results of the query and render the content for each item.",
      $id: "content:queryUse",
      "ui:field": "query",
      metadata: {
        category: "content",
      },
    },
  );
}

export const queryUseSchema = queryUseRef();

export type QueryUseSettings = Static<ReturnType<typeof queryUse>>;

export function queryUseRef(options: ObjectOptions = {}) {
  return typedRef("content:queryUse", options);
}

export function dynamic(options: ObjectOptions = {}) {
  return Type.Object(
    {
      query: Type.Optional(queryUseRef()),
      loop: Type.Number({
        minimum: 1,
        maximum: 50,
        default: 1,
        description:
          "The number of times to loop the brick. Even if the query returns more items, it will only render this many.",
      }),
    },
    {
      $id: "content:dynamic",
      title: "Dynamic",
      "ui:field": "dynamic",
      metadata: {
        category: "content",
      },
      ...options,
    },
  );
}

export type DynamicSettings = Static<ReturnType<typeof dynamic>>;

export function dynamicRef(options: ObjectOptions = {}) {
  return typedRef("content:dynamic", options);
}
