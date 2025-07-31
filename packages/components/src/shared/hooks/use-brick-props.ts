import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useDynamicParent } from "~/editor/hooks/use-page-data";

export function useBrickProps<T extends BrickManifest>({
  brick,
  editable,
}: BrickProps<T>): BrickProps<T>["brick"]["props"] {
  const { props, propsMapping = {} } = brick;
  const dynamicParent = useDynamicParent(brick.id);
  if (!dynamicParent) {
    console.debug("Dynamic box: No dynamic parent found for brick", brick.id);
    return props;
  }
  // load data
  // const data = useData()
  const dynamicProps: Record<string, unknown> = structuredClone(props);
  for (const [key, value] of Object.entries(propsMapping)) {
    // Remove $. from the key to get the actual property name
    const propKey = key.replace(/^\$\./, "");
    // use load get to handle dynamic properties
  }

  return dynamicProps;
}
