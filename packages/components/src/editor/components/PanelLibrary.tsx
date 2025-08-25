import { defaultProps, manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { type ComponentProps, useEffect, useMemo, useState } from "react";
import type { BrickCategory, BrickDefaults, BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import { useEditorHelpers } from "../hooks/use-editor";
import { tx } from "@upstart.gg/style-system/twind";
import { PanelBlockTitle } from "./PanelBlockTitle";
import { IconRender } from "./IconRender";
import { useDraggable } from "@dnd-kit/react";
import { nanoid } from "nanoid";
import { createEmptyBrick } from "@upstart.gg/sdk/shared/bricks";
import { useSortable } from "@dnd-kit/react/sortable";
import { useSections } from "../hooks/use-page-data";

const brickCategories: Record<BrickCategory, string> = {
  basic: "Basic elements",
  widgets: "Widgets",
  media: "Media",
  container: "Containers & utilities",
  layout: "Layout",
};

export default function PanelLibrary() {
  const { setMouseOverPanel } = useEditorHelpers();
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
            <div
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
                      defaults={defaultProps[brickImport.type]}
                      index={index}
                      onMouseOver={(e) => {
                        setCurrentManifest(brickImport);
                      }}
                      onMouseLeave={() => setCurrentManifest(null)}
                    />
                  );
                })}
            </div>
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
  defaults: BrickDefaults;
  index: number;
} & ComponentProps<"div">;

function DraggableBrick(props: DraggableBrickProps) {
  const {
    defaults: { manifest },
    index,
    ...rest
  } = props;

  const [random, setRandom] = useState(nanoid());
  // biome-ignore lint/correctness/useExhaustiveDependencies: We need to regenerate a new brick when
  const brickTemplate = useMemo(() => createEmptyBrick(manifest.type), [random]);

  const draggable = useSortable({
    // const draggable = useDraggable({
    id: brickTemplate.id,
    type: "library",
    data: { manifest, brick: brickTemplate, fromLibrary: true },
    feedback: "clone",
    index: 0,
  });

  useEffect(() => {
    if (!draggable.isDragging) {
      setRandom(nanoid());
    }
  }, [draggable.isDragging]);

  return (
    <div
      data-brick-template-type={brickTemplate.type}
      data-brick-min-w={manifest.minWidth?.desktop}
      data-brick-min-h={manifest.minHeight?.desktop}
      data-brick-default-w={manifest.defaultWidth?.desktop}
      data-brick-default-h={manifest.defaultHeight?.desktop}
      ref={draggable.ref}
      {...rest}
      className={tx(
        `rounded border border-upstart-100 hover:border-upstart-600 hover:bg-upstart-50 bg-white dark:bg-dark-700 !cursor-grab
        active:!cursor-grabbing touch-none select-none pointer-events-auto draggable-brick group aspect-square
        z-[99999] flex flex-col items-center justify-center`,
        draggable.isDragging && "shadow-2xl border-upstart-600 scale-110",
      )}
      {...props}
    >
      <div
        className={tx(
          "flex-1 flex flex-col justify-center text-upstart-700 dark:text-upstart-400 items-center gap-1 rounded-[inherit]",
        )}
      >
        <IconRender manifest={manifest} />
        <span className={tx("text-center text-xs")}>{manifest.name}</span>
      </div>
    </div>
  );
}
