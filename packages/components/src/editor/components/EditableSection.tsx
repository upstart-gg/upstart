import interact from "interactjs";
import type { Section as SectionType } from "@upstart.gg/sdk/shared/bricks";
import {
  useDraftHelpers,
  useEditorHelpers,
  usePreviewMode,
  useSection,
  useSections,
  useSelectedBrickId,
  useSelectedSectionId,
} from "../hooks/use-editor";
import { DropdownMenu, Inset, Popover, Tooltip } from "@upstart.gg/style-system/system";
import EditableBrickWrapper from "./EditableBrick";
import ResizeHandle from "./ResizeHandle";
import { useSectionStyle } from "~/shared/hooks/use-section-style";
import { TbArrowAutofitHeight, TbBorderCorners, TbDots } from "react-icons/tb";
import { useEffect, useRef, useState } from "react";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import { useGridConfig, type GridConfig } from "~/shared/hooks/use-grid-config";
import { getBrickResizeOptions, getBrickPosition } from "~/shared/utils/layout-utils";
import { manifests } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
import SectionSettingsView from "./SectionSettingsView";
import { tx, css } from "@upstart.gg/style-system/twind";

type EditableSectionProps = {
  section: SectionType;
};

export default function EditableSection({ section }: EditableSectionProps) {
  const { bricks, id } = section;

  const ref = useRef<HTMLDivElement>(null);
  const gridConfig = useGridConfig(ref);
  const { setSelectedSectionId, setPanel } = useEditorHelpers();

  useResizableSection(section, gridConfig);

  const previewMode = usePreviewMode();
  const selectedSectionId = useSelectedSectionId();
  const selectedBrickId = useSelectedBrickId();
  const className = useSectionStyle({
    section,
    editable: true,
    selected: selectedSectionId === section.id,
    previewMode,
  });

  const onClick = () => {
    setSelectedSectionId(section.id);
    setPanel("inspector");
  };

  return (
    <section
      key={id}
      id={id}
      ref={ref}
      data-element-kind="section"
      onClick={onClick}
      data-dropzone
      className={className}
    >
      {!selectedBrickId && <SectionOptionsButtons section={section} />}
      {bricks
        .filter((b) => !b.props.hidden?.[previewMode])
        .map((brick, index) => {
          const resizeOpts = getBrickResizeOptions(brick, manifests[brick.type], previewMode);
          // const brickWithDef = brickWithDefaults(brick);
          return (
            <EditableBrickWrapper key={`${previewMode}-${brick.id}`} brick={brick} index={index}>
              {manifests[brick.type]?.resizable && (
                <>
                  {(resizeOpts.canGrowVertical || resizeOpts.canShrinkVertical) && (
                    <>
                      <ResizeHandle direction="s" />
                      <ResizeHandle direction="n" />
                    </>
                  )}
                  {(resizeOpts.canGrowHorizontal || resizeOpts.canShrinkHorizontal) && (
                    <>
                      <ResizeHandle direction="w" />
                      <ResizeHandle direction="e" />
                    </>
                  )}
                  {((resizeOpts.canGrowVertical && resizeOpts.canGrowHorizontal) ||
                    (resizeOpts.canShrinkVertical && resizeOpts.canShrinkHorizontal)) && (
                    <>
                      <ResizeHandle direction="se" />
                      <ResizeHandle direction="sw" />
                      <ResizeHandle direction="ne" />
                      <ResizeHandle direction="nw" />
                    </>
                  )}
                </>
              )}
            </EditableBrickWrapper>
          );
        })}
    </section>
  );
}

function useResizableSection(section: SectionType, gridConfig: GridConfig) {
  // Use interact.js to allow resizing a section manually
  const interactable = useRef<Interact.Interactable | null>(null);
  const draftHelpers = useDraftHelpers();
  const previewMode = usePreviewMode();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const sectionEl = document.getElementById(section.id);

    invariant(sectionEl, "Section element not found");

    interactable.current = interact(`#${section.id}`);
    interactable.current.resizable({
      edges: {
        top: false,
        left: false,
        bottom: ".section-resizable-handle",
        right: false,
      },
      inertia: true,
      autoScroll: false,
      listeners: {
        start: (event) => {
          event.stopPropagation();
          // resizeCallbacks.onResizeStart?.(event);
        },
        move: (event) => {
          event.stopPropagation();

          const h = sectionEl.dataset.h ? parseFloat(sectionEl.dataset.h) : sectionEl.offsetHeight;
          const newHeight = h + event.delta.y;

          requestAnimationFrame(() => {
            Object.assign(sectionEl.style, {
              minHeight: `${newHeight}px`,
              maxHeight: `${newHeight}px`,
              flex: "none",
            });
          });

          Object.assign(sectionEl.dataset, { h: newHeight });
        },
        end: (event) => {
          const size = getBrickPosition(sectionEl, previewMode);
          sectionEl.style.height = "";
          sectionEl.style.maxHeight = "";
          sectionEl.style.flex = "";
          sectionEl.dataset.h = "";
          draftHelpers.updateSectionProps(section.id, {
            minHeight: `${size.h}px`,
          });
        },
      },
    });
    return () => {
      interactable.current?.unset();
      interactable.current = null;
    };
  }, []);
}

function SectionOptionsButtons({ section }: { section: SectionType }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const draftHelpers = useDraftHelpers();
  const { setSelectedSectionId, setPanel } = useEditorHelpers();
  const sections = useSections();
  const isLastSection = section.order === sections.length - 1;
  const isFirstSection = section.order === 0;

  const btnCls = tx(
    "select-none hover:opacity-90",
    "text-base px-2.5 h-9  ",
    "text-black/80 font-bold flex items-center gap-1",
    "active:(outline-none ring-0) focus:(outline-none ring-0)",
  );
  return (
    <div
      role="toolbar"
      className={tx(
        dropdownOpen || modalOpen ? "opacity-100" : "opacity-0",
        `section-options-buttons bottom-0
            absolute z-[99999] left-1/2 -translate-x-1/2 border border-gray-200 border-b-0`,
        "gap-0 rounded-t-md [&>*:first-child]:rounded-tl-md [&>*:last-child]:rounded-tr-md divide-x divide-white/80",
        "bg-white/70 backdrop-blur-md transition-opacity duration-500  group-hover/section:opacity-80 flex",
      )}
    >
      <div className={tx(btnCls, "cursor-default flex-col items-start justify-center gap-0")}>
        <div className="text-xs font-light leading-[0.9] ">Section</div>
        <div className="text-sm font-semibold -mt-1.5">{section.label ?? `${section.order + 1}`}</div>
      </div>
      {/* {!isLastSection && ( */}
      <button
        type="button"
        id={`${section.id}-resize-handle`}
        className={tx("!cursor-ns-resize", btnCls, "section-resizable-handle")}
      >
        <TbArrowAutofitHeight className="w-6 h-6" />
      </button>
      {/* )} */}
      {section.props.minHeight !== "full" && (
        <Tooltip content="Fill entire screen height" delayDuration={500}>
          <button
            type="button"
            onClick={() => {
              draftHelpers.updateSectionProps(section.id, {
                minHeight: "full",
              });
              setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight);
                document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className={tx(btnCls, "cursor-pointer")}
          >
            <TbBorderCorners className="w-6 h-6" />
          </button>
        </Tooltip>
      )}
      <DropdownMenu.Root modal={false} onOpenChange={setDropdownOpen}>
        <DropdownMenu.Trigger>
          <button type="button" className={tx(btnCls)}>
            <TbDots className="w-6 h-6" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content sideOffset={5} size="2" side="bottom" align="end">
          <DropdownMenu.Group>
            <DropdownMenu.Label>{section.label ?? ""} section</DropdownMenu.Label>
            {!isFirstSection && (
              <DropdownMenu.Item onClick={() => draftHelpers.moveSectionUp(section.id)}>
                <div className="flex items-center justify-start gap-2">
                  <span>Reorder up</span>
                </div>
              </DropdownMenu.Item>
            )}
            {!isLastSection && (
              <DropdownMenu.Item onClick={() => draftHelpers.moveSectionDown(section.id)}>
                <div className="flex items-center justify-start gap-2">
                  <span>Reorder down</span>
                </div>
              </DropdownMenu.Item>
            )}
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <DropdownMenu.Item onClick={() => draftHelpers.moveSectionDown(section.id)}>
              <div className="flex items-center justify-start gap-2">
                <span>Duplicate</span>
              </div>
            </DropdownMenu.Item>
            <DropdownMenu.Item
              onClick={() => {
                setSelectedSectionId(section.id);
                setPanel("inspector");
              }}
            >
              <div className="flex items-center justify-start gap-2">
                <span>Settings</span>
              </div>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Item color="red" onClick={() => draftHelpers.deleteSection(section.id)}>
            <div className="flex items-center justify-start gap-2.5">
              <span>Delete</span>
            </div>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
