import { type Manifest, manifest } from "@upstart.gg/sdk/shared/bricks/manifests/dynamic.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import BrickWrapper from "../components/BrickWrapper";
import { tx } from "@upstart.gg/style-system/twind";
import BrickRoot from "../components/BrickRoot";
import { useColorPreset } from "../hooks/use-color-preset";
import get from "lodash-es/get";
import { useDynamicParent } from "~/editor/hooks/use-page-data";
import { lazy, Suspense } from "react";

const LazyDroppableBox = lazy(() => import("../../editor/components/DroppableBox"));

function useDynamicProps({ brick, editable }: BrickProps<Manifest>) {
  const { props, propsMapping } = brick;
  if (!propsMapping || Object.keys(propsMapping).length === 0) {
    return props;
  }
  const dynamicParent = useDynamicParent(brick.id);
  if (!dynamicParent) {
    return props;
  }
  // load data
  // const data = useData()
  const dynamicProps: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(propsMapping)) {
    // Remove $. from the key to get the actual property name
    const propKey = key.replace(/^\$\./, "");
    // use load get to handle dynamic properties
  }
}

export default function Dynamic({ brick, editable }: BrickProps<Manifest>) {
  const presetClasses = useColorPreset<Manifest>(brick);
  return (
    <BrickRoot manifest={manifest} className={tx("flex @mobile:flex-wrap", presetClasses.main)}>
      {editable ? (
        <Suspense>
          <LazyDroppableBox brick={brick} />
        </Suspense>
      ) : (
        brick.props.$children?.map((brick) => <BrickWrapper key={brick.id} brick={brick} />)
      )}
    </BrickRoot>
  );
}
