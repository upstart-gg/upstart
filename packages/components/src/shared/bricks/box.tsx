import { forwardRef } from "react";
import { useBrickStyle } from "../hooks/use-brick-style";
import type { Manifest } from "@upstart.gg/sdk/shared/bricks/manifests/box.manifest";
import EditableBrickWrapper from "~/editor/components/EditableBrick";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import BrickWrapper from "../components/BrickWrapper";
import { tx } from "@upstart.gg/style-system/twind";
import { type DraggableChildrenFn, Droppable } from "@hello-pangea/dnd";
import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import { manifests } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
import { IconRender } from "~/editor/components/IconRender";
import { useDeviceInfo } from "~/editor/hooks/use-device-info";
import { useDraggingBrickType, usePreviewMode } from "~/editor/hooks/use-editor";

const Box = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const props = brick.props;
  const styles = useBrickStyle<Manifest>(brick);
  const classes = Object.values(styles);
  // const ds = useDatasource(props.datasource, manifest.datasource);

  if (editable) {
    return (
      <div className={tx("flex flex-grow flex-col", ...classes)} ref={ref}>
        <DroppableBox brick={brick} />
      </div>
    );
  }

  return (
    <div className={tx("flex flex-grow flex-col", Object.values(styles))} ref={ref}>
      {props.$children?.map((brick) => (
        <BrickWrapper key={brick.id} brick={brick} />
      ))}
    </div>
  );
});

export const renderClone: DraggableChildrenFn = (provided, snapshot, rubric) => {
  const brick = manifests[rubric.draggableId] as BrickManifest;
  return (
    <button
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      className={tx(
        `rounded border border-upstart-100 border-upstart-600 bg-upstart-50 bg-white dark:bg-dark-700 !cursor-grab
        active:!cursor-grabbing touch-none select-none pointer-events-auto draggable-brick group aspect-square
        z-[99999] flex flex-col items-center justify-center
        [&:is(.clone)]:(opacity-80 !bg-white)`,
      )}
    >
      <div
        className={tx(
          "flex-1 flex flex-col justify-center text-upstart-700 dark:text-upstart-400 items-center gap-1 rounded-[inherit]",
        )}
      >
        <IconRender manifest={brick} />
        <span className={tx("whitespace-nowrap text-xs")}>{brick.name}</span>
      </div>
    </button>
  );
};

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
  // const ds = useDatasource(props.datasource, manifest.datasource);
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
            "flex-grow flex flex-col justify-end",
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
                "w-full h-full text-center  border-4 border-gray-300 border-dotted p-4 rounded flex justify-center items-center text-base text-black/50 font-medium",
              )}
            >
              This is a simple box.
              <br />
              Drag a brick inside it that you want to give
              <br />
              some border, background, padding, or shadow.
            </div>
          )}
        </div>
      )}
    </Droppable>
  );
}

export default Box;
