import { defaultProps, manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { useMergeRefs } from "@upstart.gg/style-system/system";
import { useCalloutViewCounter } from "../hooks/use-callout-view-counter";
import { type ComponentProps, forwardRef, useState } from "react";
import type { BrickCategory, BrickDefaults, BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import { useEditorHelpers } from "../hooks/use-editor";
import { tx } from "@upstart.gg/style-system/twind";
import { PanelBlockTitle } from "./PanelBlockTitle";
import { Draggable, type DraggableChildrenFn, Droppable } from "@hello-pangea/dnd";
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

const brickCategories: Record<BrickCategory, string> = {
  basic: "Basic elements",
  widgets: "Widgets",
  media: "Media",
  container: "Containers & utilities",
  layout: "Layout",
};

export default function PanelLibrary() {
  const { setMouseOverPanel } = useEditorHelpers();
  const { shouldDisplay: shouldDisplayLibraryCallout } = useCalloutViewCounter("blocks-library");
  const [currentManifest, setCurrentManifest] = useState<BrickManifest | null>(null);

  return (
    <div
      onMouseEnter={() => setMouseOverPanel(true)}
      onMouseLeave={() => setMouseOverPanel(false)}
      className="flex flex-col h-full"
    >
      <PanelBlockTitle>Library</PanelBlockTitle>
      <div className="flex flex-col gap-3 flex-1">
        {Object.entries(brickCategories).map(([category, title]) => (
          <div key={category} className="flex flex-col gap-2">
            <div className="text-xs font-bold uppercase text-gray-600 bg-upstart-50 px-3 py-2">{title}</div>
            <Droppable
              // use "$library$" prefix to avoid conflicts with other droppables
              droppableId={`$library$-${category}`}
              type="brick"
              renderClone={renderClone}
              isDropDisabled={true}
              direction="horizontal"
            >
              {(provided, snapshot) => {
                return (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={tx("grid gap-1.5 mx-2")}
                    style={{
                      gridTemplateColumns: "repeat(auto-fill, minmax(66px, 1fr))",
                    }}
                  >
                    {Object.values(manifests)
                      .filter((m) => m.category === category && !m.hideInLibrary)
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
        ))}
      </div>
      <div
        className={tx(
          "mt-auto p-2 bg-upstart-50 font-normal text-upstart-700 text-xs rounded transition-opacity",
          currentManifest ? "opacity-100" : "opacity-0",
        )}
      >
        {currentManifest?.description}
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
        <span className={tx("text-center text-xs")}>{brick.name}</span>
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
        );
      }}
    </Draggable>
  );
});
