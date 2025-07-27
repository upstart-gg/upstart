import { useBrickStyle } from "../hooks/use-brick-style";
import type { Manifest } from "@upstart.gg/sdk/shared/bricks/manifests/dynamic.manifest";
import EditableBrickWrapper from "~/editor/components/EditableBrick";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import BrickWrapper from "../components/BrickWrapper";
import { tx } from "@upstart.gg/style-system/twind";
import { type DraggableChildrenFn, Droppable } from "@hello-pangea/dnd";
import { useDeviceInfo } from "~/editor/hooks/use-device-info";
import { useDraggingBrickType, usePreviewMode } from "~/editor/hooks/use-editor";
import BrickRoot from "../components/BrickRoot";

export default function Dynamic({ brick, editable }: BrickProps<Manifest>) {
  const styles = useBrickStyle<Manifest>(brick);
  return (
    <BrickRoot className={tx("flex", Object.values(styles))}>
      {editable ? (
        <DroppableBox brick={brick} />
      ) : (
        brick.props.$children?.map((brick) => <BrickWrapper key={brick.id} brick={brick} />)
      )}
    </BrickRoot>
  );
}

const renderClone2: DraggableChildrenFn = (provided, snapshot, rubric) => {
  return null;
};

function DroppableBox({ brick }: BrickProps<Manifest>) {
  const props = brick.props;
  const styles = useBrickStyle<Manifest>(brick);
  const classes = Object.values(styles);
  const { isDesktop } = useDeviceInfo();
  const draggingBrickType = useDraggingBrickType();
  const previewMode = usePreviewMode();
  return (
    <Droppable
      droppableId={brick.id}
      type="brick"
      // isCombineEnabled
      isDropDisabled={!isDesktop}
      direction="vertical"
      mode="virtual"
      renderClone={renderClone2}
    >
      {(droppableProvided, droppableSnapshot) => (
        <div
          {...droppableProvided.droppableProps}
          ref={droppableProvided.innerRef}
          className={tx(
            "flex-1 flex",
            droppableSnapshot.isDraggingOver && "!outline !outline-2 !outline-orange-300",
            (droppableSnapshot.isDraggingOver || draggingBrickType) && "!overflow-y-hidden",
            droppableSnapshot.isDraggingOver && "[&>*]:(!transform-none)",
            ...classes,
          )}
        >
          {props.$children?.length > 0 ? (
            props.$children
              .filter((b) => !b.props.hidden?.[previewMode])
              .map((brick, index) => {
                return (
                  <EditableBrickWrapper key={`${brick.id}`} brick={brick} isContainerChild index={index} />
                );
              })
          ) : (
            <div
              className={tx(
                "w-full h-full text-center p-4 rounded flex justify-center items-center text-base font-medium",
              )}
            >
              This is a dynamic box.
              <br />
              Drag bricks here to stack them inside.
            </div>
          )}
        </div>
      )}
    </Droppable>
  );
}
