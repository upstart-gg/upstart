import { typedRef } from "~/shared/utils/typed-ref";
import { type ObjectOptions, Type, type Static } from "@sinclair/typebox";
import { queryFilter } from "~/shared/datasources/types";
import { over } from "lodash-es";

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
        "ai:instructions":
          "Use a simple keyword without spaces or special characters. Aliases are unique across the page. You can use the same query several times with different aliases in order to, for example, apply different parameters to the same query.",
      }),
      params: Type.Optional(
        Type.Array(queryFilter, {
          description:
            "Additional query parameters/filters to apply to the query. One can use placeholders in values like ':slug' to reference URL parameters.",
          title: "Query Parameters",
          default: [],
        }),
      ),
      // limit: Type.Optional(
      //   Type.Number({
      //     description:
      //       "Number of items from the query to loop through. If not set, it will loop through all items. If set to 1, it will not loop and will render only the first item.",
      //     minimum: 1,
      //     maximum: 100,
      //   }),
      // ),
    },
    {
      title: "Query",
      description:
        "When set, this brick will loop through the results of the query and render the content for each item.",
      // $id: "content:queryUse",
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

export function loop(options: ObjectOptions = {}) {
  return Type.Object(
    {
      over: Type.String({
        title: "Over",
        description: "The query alias to loop over. If not set, the brick will be rendered only once.",
        "ai:instructions": "Specify the Query Alias to loop over the results.",
      }),
      overrideLimit: Type.Optional(
        Type.Number({
          minimum: 1,
          description:
            "Override the limit of items to loop through. If not set, it will use the default limit of the query. If set to 1, it will not loop and will render only the first item.",
        }),
      ),
    },
    {
      // $id: "content:loop",
      title: "Repeat over",
      "ui:field": "loop",
      "ui:hidden-if": "no-page-queries",
      metadata: {
        category: "content",
      },
      examples: [
        {
          over: "latestBlogPosts",
          overrideLimit: 5,
        },
        {
          over: "featuredProducts",
          overrideLimit: 3,
        },
        {
          over: "popularProducts",
        },
      ],
      ...options,
    },
  );
}

export type LoopSettings = Static<ReturnType<typeof loop>>;

export function loopRef(options: ObjectOptions = {}) {
  return typedRef("content:loop", options);
}
