import EditableBrickWrapper from "~/editor/components/EditableBrick";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx } from "@upstart.gg/style-system/twind";
import { Droppable } from "@hello-pangea/dnd";
import { useDeviceInfo } from "~/editor/hooks/use-device-info";
import { useDraggingBrickType, usePreviewMode } from "~/editor/hooks/use-editor";
import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { MdRepeat } from "react-icons/md";
import { Tooltip } from "@upstart.gg/style-system/system";
import { useDraftHelpers } from "../hooks/use-page-data";
import type { DatasourceSettings } from "@upstart.gg/sdk/shared/bricks/props/datasource";

export default function DroppableBox<T extends BrickManifest>({
  brick,
  level = 0, // Default level to 0 if not provided
  dynamic,
  className,
  datasource,
}: BrickProps<T> & {
  dynamic?: boolean;
  datasource?: DatasourceSettings;
  className: string | string[] | string[][];
}) {
  const props = brick.props;
  const children = props.$children as Brick[] | undefined;
  const { isDesktop } = useDeviceInfo();
  const draggingBrickType = useDraggingBrickType();
  const previewMode = usePreviewMode();
  const direction = props.direction === "flex-col" ? "vertical" : "horizontal";
  const { updateBrickProps } = useDraftHelpers();

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
            "flex-1 flex @mobile:flex-wrap relative",
            droppableSnapshot.isDraggingOver && "!outline !outline-2 !outline-orange-300",
            (droppableSnapshot.isDraggingOver || draggingBrickType) && "!overflow-y-hidden",
            droppableSnapshot.isDraggingOver && "[&>*]:(!transform-none)",
            className,
          )}
        >
          {children && children.length > 0 ? (
            children
              .filter((b) => !b.props.hidden?.[previewMode])
              .map((brick, index) => {
                return (
                  <EditableBrickWrapper
                    level={level + 1}
                    key={`${brick.id}`}
                    brick={brick}
                    isContainerChild
                    index={index}
                  />
                );
              })
          ) : (
            <div
              className={tx(
                "w-full h-full text-center p-4 rounded flex justify-center items-center text-base font-medium",
              )}
            >
              {dynamic
                ? "This is a dynamic box."
                : props.direction === "flex-col"
                  ? "This is a vertical box."
                  : "This is a horizontal box."}
              <br />
              Drag bricks here to stack them inside.
            </div>
          )}
          {droppableSnapshot.isDraggingOver && (
            <div
              className={tx(
                "absolute inset-0 z-auto flex items-center justify-center bg-black/30 font-bold text-white rounded",
              )}
            >
              <span className="inline-flex rounded-full px-4 py-2 bg-black/50">Drop in box</span>
            </div>
          )}
          {dynamic && (datasource?.limit ?? 1) > 1 && (
            <Tooltip content={props.showDynamicPreview ? "Hide dynamic preview" : "Show dynamic preview"}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  updateBrickProps(brick.id, {
                    showDynamicPreview: !props.showDynamicPreview,
                  });
                }}
                className="absolute cursor-pointer -top-4 -right-4 z-[99999] w-6 h-6 rounded-full
            flex items-center justify-center text-upstart-500 group/dyn-helper bg-white/90 shadow border border-upstart-500
            hover:(bg-upstart-600 text-white scale-150) transition-all duration-150"
              >
                <MdRepeat className="w-4 h-4" />
              </div>
            </Tooltip>
          )}
        </div>
      )}
    </Droppable>
  );
}
