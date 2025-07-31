import EditableBrickWrapper from "~/editor/components/EditableBrick";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx } from "@upstart.gg/style-system/twind";
import { Droppable } from "@hello-pangea/dnd";
import { useDeviceInfo } from "~/editor/hooks/use-device-info";
import { useDraggingBrickType, usePreviewMode } from "~/editor/hooks/use-editor";
import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { useBrickStyle } from "~/shared/hooks/use-brick-style";

export default function DroppableBox<T extends BrickManifest>({
  brick,
}: BrickProps<T> & { dynamic?: boolean }) {
  const props = brick.props;
  const children = props.$children as Brick[] | undefined;
  const styles = useBrickStyle<T>(brick);
  const classes = Object.values(styles);
  const { isDesktop } = useDeviceInfo();
  const draggingBrickType = useDraggingBrickType();
  const previewMode = usePreviewMode();
  const direction = props.direction === "flex-col" ? "vertical" : "horizontal";

  return (
    <Droppable
      droppableId={brick.id}
      type="brick"
      isDropDisabled={!isDesktop}
      direction={direction}
      mode="virtual"
      renderClone={() => null}
    >
      {(droppableProvided, droppableSnapshot) => (
        <div
          {...droppableProvided.droppableProps}
          ref={droppableProvided.innerRef}
          className={tx(
            "flex-1 flex @mobile:flex-wrap",
            droppableSnapshot.isDraggingOver && "!outline !outline-2 !outline-orange-300",
            (droppableSnapshot.isDraggingOver || draggingBrickType) && "!overflow-y-hidden",
            droppableSnapshot.isDraggingOver && "[&>*]:(!transform-none)",
            ...classes,
          )}
        >
          {children && children.length > 0 ? (
            children
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
              This is a box.
              <br />
              Drag bricks here to stack them inside.
            </div>
          )}
        </div>
      )}
    </Droppable>
  );
}
