import { type Manifest, manifest } from "@upstart.gg/sdk/shared/bricks/manifests/dynamic.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import BrickWrapper from "../components/BrickWrapper";
import { tx } from "@upstart.gg/style-system/twind";
import BrickRoot from "../components/BrickRoot";
import { useColorPreset } from "../hooks/use-color-preset";
import get from "lodash-es/get";
import { lazy, Suspense } from "react";

const LazyDroppableBox = lazy(() => import("../../editor/components/DroppableBox"));

export default function Dynamic({ brick, editable }: BrickProps<Manifest>) {
  const { props } = brick;
  const presetClasses = useColorPreset<Manifest>(brick);
  const { datasource } = props;
  if (datasource) {
    // console.log("Dynamic box: datasource is ", datasource);
  }
  return (
    <BrickRoot
      editable={editable}
      manifest={manifest}
      className={tx("flex @mobile:flex-wrap", presetClasses.main)}
    >
      {editable ? (
        <Suspense>
          <LazyDroppableBox brick={brick} dynamic />
        </Suspense>
      ) : (
        props.$children?.map((brick) => <BrickWrapper key={brick.id} brick={brick} />)
      )}
    </BrickRoot>
  );
}
