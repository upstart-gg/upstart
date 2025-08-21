import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useData, usePageQueries } from "~/editor/hooks/use-page-data";
import { useBrickManifest } from "./use-brick-manifest";
import type { LoopSettings } from "@upstart.gg/sdk/shared/bricks/props/dynamic";
import get from "lodash-es/get";

export function useBrickProps<T extends BrickManifest>({
  brick,
  editable,
  iterationIndex = 0,
}: BrickProps<T>): BrickProps<T>["brick"]["props"] {
  const { props } = brick;

  const pageQueries = usePageQueries();
  const loop = props.loop as LoopSettings | undefined;
  const loopQuery = pageQueries.find((q) => q.alias === loop?.over);
  const manifest = useBrickManifest(brick.type);

  if (!pageQueries.length) {
    return props;
  }

  function replacePlaceholders<T extends string | Record<string, string>>(
    template: T,
    data: Record<string, unknown>,
  ) {
    if (typeof template === "string") {
      return (template as string).replace(/{{(.*?)}}/g, (_, key) => {
        // console.log("Getting value for key:", key.trim(), "from data:", data);
        return get(data, key.trim(), "") as string;
      });
    } else if (typeof template === "object" && template !== null) {
      const newValue: Record<string, string> = {};
      for (const [key, val] of Object.entries(template)) {
        newValue[key] = replacePlaceholders(val, data);
      }
      return newValue as T;
    }
    return template as T;
  }

  // // load data
  function mapDynamicProps(
    props: BrickProps<T>["brick"]["props"],
    alias: string,
  ): BrickProps<T>["brick"]["props"] {
    const mapped: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(props)) {
      // console.log("Mapping prop %s = %s", key, value);
      const manifestSchema = manifest.props.properties[key];
      // console.log("Manifest schema for %s: %o", key, manifestSchema);
      if (manifestSchema?.metadata?.consumeQuery && loop) {
        // console.log("LOOOOP settings found for prop %s: %o", key, loop);
        const data: Record<string, unknown>[] =
          pageQueries.find((q) => q.alias === loop.over)?.datasource?.schema.examples ?? [];
        const template: string | Record<string, string> = (Array.isArray(value) ? value : [value])[0];

        // console.log("Mapped value for prop %s: %o and template %o", key, data, template);
        mapped[key] = data
          .map((item) => {
            return replacePlaceholders(template, { [alias]: item });
          })
          .slice(0, editable ? 1 : undefined); // Limit to 1 for editable mode
      } else {
        // console.log("No loop settings for prop %s", key);
        mapped[key] = value;
      }

      // const mappedKey = propsMapping[key] || key;
    }
    return mapped;
  }

  const dynamicProps: Record<string, unknown> = loopQuery?.alias
    ? mapDynamicProps(structuredClone(props), loopQuery.alias)
    : props;

  return dynamicProps;
}
