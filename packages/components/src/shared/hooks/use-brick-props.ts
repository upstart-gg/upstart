import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useData, useLoopedQuery, usePageQueries } from "~/editor/hooks/use-page-data";
import { useBrickManifest } from "./use-brick-manifest";
import type { LoopSettings } from "@upstart.gg/sdk/shared/bricks/props/dynamic";
import get from "lodash-es/get";
import isPlainObject from "lodash-es/isPlainObject";

export function useBrickProps<T extends BrickManifest>({
  brick,
  editable,
  iterationIndex = 0,
}: BrickProps<T>): BrickProps<T>["brick"]["props"] {
  const { props } = brick;
  const pageQueries = usePageQueries();
  const loop = props.loop as LoopSettings | undefined;
  const loopQuery = useLoopedQuery(loop?.over);
  const manifest = useBrickManifest(brick.type);
  const allData = useData(editable);

  if (!pageQueries.length) {
    return props;
  }

  function replacePlaceholdersForItem<T extends string | Record<string, unknown>>(
    template: T,
    item: Record<string, unknown>,
  ) {
    if (typeof template === "string") {
      return (template as string).replace(/{{(.*?)}}/g, (_, key) => {
        return get(item, key.trim(), "") as string;
      });
    } else if (typeof template === "object" && template !== null) {
      const newValue: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(template)) {
        newValue[key] =
          typeof val === "string" || isPlainObject(val)
            ? replacePlaceholdersForItem(val as string | Record<string, unknown>, item)
            : val;
      }
      return newValue as T;
    }
    return template as T;
  }

  function replacePlaceholdersGeneric<T extends string | Record<string, unknown>>(template: T) {
    if (typeof template === "string") {
      return (template as string).replace(/{{(.*?)}}/g, (_, key) => {
        const [dataset, variable] = key.trim().split(".");
        const data = allData[dataset][iterationIndex] ?? {};
        // console.log("Getting value for key:", variable, "from data:", data);
        return get(data, variable, "") as string;
      });
    } else if (typeof template === "object" && template !== null) {
      const newValue: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(template)) {
        newValue[key] = typeof val === "string" ? replacePlaceholdersGeneric(val) : val;
      }
      return newValue as T;
    }
    return template as T;
  }

  // // load data
  function mapDynamicProps(props: BrickProps<T>["brick"]["props"]): BrickProps<T>["brick"]["props"] {
    const mapped: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(props)) {
      const manifestSchema = manifest.props.properties[key];
      if (manifestSchema?.metadata?.consumeQuery && loopQuery) {
        const data: Record<string, unknown>[] = allData[loopQuery.alias] ?? [];
        const template: string | Record<string, string> = (Array.isArray(value) ? value : [value])[0];
        mapped[key] = data
          .map((item) => {
            return replacePlaceholdersForItem(template, { [loopQuery.alias]: item });
          })
          .slice(0, loop?.overrideLimit ?? undefined); // Limit to 1 for editable mode
      } else {
        mapped[key] = typeof value === "string" ? replacePlaceholdersGeneric(value) : value;
      }
    }
    return mapped;
  }

  const dynamicProps: Record<string, unknown> = mapDynamicProps(props);

  return dynamicProps;
}
