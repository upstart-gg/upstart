import { defaultProps, manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { Value } from "@sinclair/typebox/value";
import { WiStars } from "react-icons/wi";
import { MdOutlineHelpOutline } from "react-icons/md";
import {
  Tabs,
  Button,
  Callout,
  TextArea,
  Spinner,
  Tooltip,
  IconButton,
  useMergeRefs,
} from "@upstart.gg/style-system/system";
import { BsStars } from "react-icons/bs";
import { TbDragDrop } from "react-icons/tb";
import { useCalloutViewCounter } from "../hooks/use-callout-view-counter";
import { type ComponentProps, type CSSProperties, forwardRef, useEffect, useRef, useState } from "react";
import type { BrickDefaults, BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import interact from "interactjs";
import { IoCloseOutline } from "react-icons/io5";
import { panelTabContentScrollClass } from "../utils/styles";
import { useAttributes, useEditorHelpers } from "../hooks/use-editor";
import { tx, css } from "@upstart.gg/style-system/twind";
import { PanelBlockTitle } from "./PanelBlockTitle";
import {
  Draggable,
  type DraggableChildrenFn,
  type DraggableStateSnapshot,
  type DraggableStyle,
  Droppable,
} from "@hello-pangea/dnd";
import { getDraggableStyle } from "../utils/dnd";
import { IconRender } from "./IconRender";

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
      style={getDraggableStyle(provided.draggableProps.style ?? {}, snapshot)}
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

export default function PanelLibrary() {
  const { shouldDisplay: shouldDisplayLibraryCallout } = useCalloutViewCounter("blocks-library");
  const [currentManifest, setCurrentManifest] = useState<BrickManifest | null>(null);
  const attr = useAttributes();

  return (
    <div className="flex flex-col h-full">
      <div
        className={tx("flex flex-col h-[calc(100dvh/3-40px)] overflow-y-auto", panelTabContentScrollClass)}
      >
        <PanelBlockTitle>Widgets</PanelBlockTitle>
        {shouldDisplayLibraryCallout && (
          <Callout.Root size="1" color="violet" className="!rounded-none">
            <Callout.Text size="1">Widgets are more complex components you can use.</Callout.Text>
          </Callout.Root>
        )}

        <div
          className={tx("grid gap-1.5 p-2")}
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
          }}
        >
          <Droppable
            droppableId="widgets-library"
            type="brick"
            renderClone={renderClone}
            isDropDisabled={true}
            direction="horizontal"
          >
            {(provided, snapshot) => {
              return (
                <div ref={provided.innerRef} {...provided.droppableProps} className={tx("contents")}>
                  {Object.values(manifests)
                    .filter((m) => m.kind === "widget" && !m.hideInLibrary)
                    .filter((m) => !m.inlineDragDisabled)
                    .map((brickImport, index) => {
                      return (
                        <DraggableBrick
                          key={brickImport.type}
                          brick={defaultProps[brickImport.type]}
                          index={index}
                          onMouseOver={(e) => {
                            setCurrentManifest(brickImport);
                          }}
                          onMouseLeave={() => setCurrentManifest(null)}
                        />
                      );
                    })}
                  {provided.placeholder}
                </div>
              );
            }}
          </Droppable>
        </div>
        <div
          className={tx(
            "p-2 bg-upstart-50/50 font-normal text-upstart-600 m-2 text-xs rounded transition-opacity",
            currentManifest?.kind === "widget" && currentManifest?.description ? "opacity-100" : "opacity-0",
          )}
        >
          {currentManifest?.description ?? <span>&nbsp;</span>}
        </div>
      </div>

      <div
        className={tx(
          "flex flex-col max-h-[calc(100dvh/2-40px)] overflow-y-auto",
          panelTabContentScrollClass,
        )}
      >
        <PanelBlockTitle>Base bricks</PanelBlockTitle>
        {shouldDisplayLibraryCallout && (
          <Callout.Root size="1" color="violet" className="!rounded-none">
            <Callout.Text size="1">Simply drag and drop those base bricks to your page.</Callout.Text>
          </Callout.Root>
        )}
        <div
          className={tx("grid gap-1.5 p-2")}
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))",
          }}
        >
          <Droppable
            droppableId="bricks-library"
            type="brick"
            // isDropDisabled={true}
            isDropDisabled={true}
            renderClone={renderClone}
          >
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className={tx("contents")}>
                {Object.values(manifests)
                  .filter((m) => m.kind === "brick" && !m.hideInLibrary)
                  .map((brickImport, index) => {
                    return (
                      <DraggableBrick
                        key={brickImport.type}
                        brick={defaultProps[brickImport.type]}
                        index={index}
                        onMouseOver={(e) => setCurrentManifest(brickImport)}
                        onMouseLeave={() => setCurrentManifest(null)}
                      />
                    );
                  })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
        <div
          className={tx(
            "p-2 bg-upstart-50/50 font-normal text-upstart-600 mx-2 text-xs rounded transition-opacity",
            currentManifest?.kind === "brick" && currentManifest?.description ? "opacity-100" : "opacity-0",
          )}
        >
          {currentManifest?.description}
        </div>
      </div>
    </div>
  );
}

type DraggableBrickProps = {
  brick: BrickDefaults;
  index: number;
} & ComponentProps<"div">;

type InnerProps = ComponentProps<"div"> & { brick: BrickDefaults; index: number };
const InnerDraggableBrick = forwardRef<HTMLDivElement, InnerProps>((props, ref) => {
  const { brick, index, ...rest } = props;
  return (
    <div
      ref={ref}
      {...rest}
      className={tx(
        `rounded border border-upstart-100 hover:border-upstart-600 hover:bg-upstart-50 bg-white dark:bg-dark-700 !cursor-grab
        active:!cursor-grabbing touch-none select-none pointer-events-auto draggable-brick group aspect-square
        z-[99999] flex flex-col items-center justify-center
        [&:is(.clone)]:(opacity-80 !bg-white)`,
      )}
      {...props}
    >
      <div
        className={tx(
          "flex-1 flex flex-col justify-center text-upstart-700 dark:text-upstart-400 items-center gap-1 rounded-[inherit]",
        )}
      >
        <IconRender manifest={brick} />
        <span className={tx("whitespace-nowrap text-xs")}>{brick.name}</span>
      </div>
    </div>
  );
});

const DraggableBrick = forwardRef<HTMLDivElement, DraggableBrickProps>(({ brick, index, ...props }, ref) => {
  return (
    <Draggable
      index={index}
      draggableId={brick.type}
      data-brick-type={brick.type}
      data-brick-min-w={brick.minWidth?.desktop}
      data-brick-min-h={brick.minHeight?.desktop}
      data-brick-default-w={brick.defaultWidth?.desktop}
      data-brick-default-h={brick.defaultHeight?.desktop}
    >
      {(provided, snapshot) => {
        const mergedRef = useMergeRefs([provided.innerRef, ref]);
        return (
          <InnerDraggableBrick
            ref={mergedRef}
            brick={brick}
            index={index}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            {...props}
          />
          //   <div
          //     ref={mergedRef}
          //     {...provided.draggableProps}
          //     {...provided.dragHandleProps}
          //     className={tx(
          //       `rounded border border-upstart-100 hover:border-upstart-600 hover:bg-upstart-50 bg-white dark:bg-dark-700 !cursor-grab
          // active:!cursor-grabbing touch-none select-none pointer-events-auto draggable-brick group aspect-square
          // z-[99999] flex flex-col items-center justify-center
          // [&:is(.clone)]:(opacity-80 !bg-white)`,
          //     )}
          //     {...props}
          //   >
          //     <div
          //       className={tx(
          //         "flex-1 flex flex-col justify-center text-upstart-700 dark:text-upstart-400 items-center gap-1 rounded-[inherit]",
          //       )}
          //     >
          //       <IconRender {...brick} />
          //       <span className={tx("whitespace-nowrap text-xs")}>{brick.name}</span>
          //     </div>
          //   </div>
        );
      }}
    </Draggable>
  );
});
