import { type Manifest, manifest } from "@upstart.gg/sdk/shared/bricks/manifests/box.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import BrickWrapper from "../components/BrickWrapper";
import EditableBrickWrapper from "../../editor/components/EditableBrick";
import { tx } from "@upstart.gg/style-system/twind";
import BrickRoot from "../components/BrickRoot";
import { useBrickStyle } from "../hooks/use-brick-style";

// const LazyDroppableBox = lazy(() => import("../../editor/components/DroppableBox"));

export default function Box({
  brick,
  editable,
  isDynamicPreview,
  iterationIndex,
  level = 0,
}: BrickProps<Manifest>) {
  const styles = useBrickStyle<Manifest>(brick);
  return (
    <BrickRoot editable={editable} manifest={manifest} className={tx(Object.values(styles))} brick={brick}>
      {brick.props.$children?.map((child, index) =>
        editable ? (
          <EditableBrickWrapper
            key={child.id}
            brick={child}
            index={index}
            iterationIndex={iterationIndex}
            isDynamicPreview={isDynamicPreview}
          />
        ) : (
          <BrickWrapper key={child.id} brick={child} />
        ),
      )}
    </BrickRoot>
  );
}
