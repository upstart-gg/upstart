import { type Manifest, manifest } from "@upstart.gg/sdk/shared/bricks/manifests/box.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import BrickWrapper from "../components/BrickWrapper";
import { tx } from "@upstart.gg/style-system/twind";
import BrickRoot from "../components/BrickRoot";
import { lazy, Suspense } from "react";

const LazyDroppableBox = lazy(() => import("../../editor/components/DroppableBox"));

export default function Box({ brick, editable, level = 0 }: BrickProps<Manifest>) {
  return (
    <BrickRoot editable={editable} manifest={manifest} className={tx("@mobile:flex-wrap")}>
      {editable ? (
        <Suspense>
          <LazyDroppableBox brick={brick} level={level} />
        </Suspense>
      ) : (
        brick.props.$children?.map((brick) => <BrickWrapper key={brick.id} brick={brick} />)
      )}
    </BrickRoot>
  );
}
