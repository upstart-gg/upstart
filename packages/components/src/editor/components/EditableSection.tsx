import type { Section as SectionType } from "@upstart.gg/sdk/shared/bricks";
import {
  useDraggingBrickType,
  useEditingTextForBrickId,
  useEditorHelpers,
  useIsMouseOverPanel,
  usePreviewMode,
  useSelectedSectionId,
} from "../hooks/use-editor";
import EditableBrickWrapper from "./EditableBrick";
import { useSectionStyle } from "~/shared/hooks/use-section-style";
import { useCallback, type MouseEvent } from "react";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import { manifests } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
import { tx } from "@upstart.gg/style-system/twind";
import { useDeepCompareEffect } from "use-deep-compare";
import { useDeviceInfo } from "../hooks/use-device-info";
import { useDraftHelpers, useSection } from "../hooks/use-page-data";
import { useDroppable } from "@dnd-kit/react";
import { CollisionPriority } from "@dnd-kit/abstract";
import { pointerDistance, pointerIntersection } from "@dnd-kit/collision";
import EditableSectionContextMenu from "./EditableSectionContextMenu";
import EditableSectionButtons from "./EditableSectionButtons";
import { useResizableSection } from "../hooks/use-resizable-section";

type EditableSectionProps = {
  section: SectionType;
  index: number;
};

export default function EditableSection({ section, index }: EditableSectionProps) {
  const { bricks, id } = section;
  const { setSelectedSectionId, setPanel, setSelectedBrickId, setIsEditingText } = useEditorHelpers();
  const draftHelpers = useDraftHelpers();
  const previewMode = usePreviewMode();
  const selectedSectionId = useSelectedSectionId();
  const editingBrick = useEditingTextForBrickId();
  const draggingBrickType = useDraggingBrickType();
  // const isMouseOverPanel = useIsMouseOverPanel();
  const { isDesktop } = useDeviceInfo();
  const isSpecialSection = typeof section.props.variant !== "undefined";
  const dropDisabled =
    isSpecialSection ||
    /* Not DnD on mobile */ previewMode === "mobile" ||
    /* No DnD on small screens */
    !isDesktop ||
    /* No DnD when dragging a brick that has inline drag disabled */
    (!!draggingBrickType && manifests[draggingBrickType]?.inlineDragDisabled);

  const sectionObj = useSection(section.id);
  const { isDropTarget, ref: sectionRef } = useDroppable({
    id,
    type: "section",
    accept: (source) => source.type === "brick" || source.type === "library",
    collisionPriority: CollisionPriority.Normal,
    collisionDetector: pointerDistance,
    data: { section },
    disabled: dropDisabled,
  });

  const className = useSectionStyle({
    section,
    editable: true,
    selected: selectedSectionId === section.id,
    previewMode,
    isDropTarget,
  });

  useResizableSection(section);

  useDeepCompareEffect(() => {
    // This effect runs when the section object changes, which includes props updates
    // Check if the section is overflowing
    const sectionEl = document.getElementById(section.id);
    invariant(sectionEl, `Section element with id ${section.id} not found`);
    const isOverflowing = () =>
      sectionEl.scrollWidth > sectionEl.clientWidth + parseFloat(section.props.gap ?? "0") * 2; // 8px for padding. Todo: fix this magic number
    if (isOverflowing()) {
      console.warn(
        `Section ${section.id} is overflowing. Consider adjusting its width or content. sectionEl.scrollWidth = %s, sectionEl.clientWidth = %s`,
        sectionEl.scrollWidth,
        sectionEl.clientWidth,
      );
    }
  }, [sectionObj]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const onClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        !target.closest("[data-trigger-section-inspector]") &&
        (e.defaultPrevented || target.nodeName !== "SECTION" || draggingBrickType)
      ) {
        console.debug("Click prevented on section", target);
        // If the click was handled by a child element, do not propagate
        return;
      }
      // console.debug("Section clicked", section.id, target, e);
      setSelectedSectionId(section.id);
      setSelectedBrickId();
      setIsEditingText(false);
      setPanel("inspector");
    },
    [draggingBrickType, section.id],
  );

  return (
    <EditableSectionContextMenu section={section}>
      <section id={id} ref={sectionRef} data-element-kind="section" onClick={onClick} className={className}>
        {!editingBrick && !draggingBrickType && <EditableSectionButtons section={section} />}
        {bricks
          .filter((b) => !b.props.hidden?.[previewMode])
          .map((brick, brickIndex) => {
            return (
              <EditableBrickWrapper
                key={`${previewMode}-${brick.id}`}
                brick={brick}
                index={brickIndex}
                iterationIndex={brickIndex}
              />
            );
          })}
        {bricks.length === 0 && (
          <div
            data-trigger-section-inspector
            className={tx(
              "w-full min-w-full self-stretch py-2 h-auto flex-1 text-center rounded",
              "flex justify-center items-center font-normal",
              isDropTarget && "bg-upstart-50",
              "opacity-0 hover:opacity-80 transition-opacity duration-300",
            )}
          >
            This section is empty. Drag bricks here to stack them inside,&nbsp;
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                draftHelpers.deleteSection(section.id);
                setSelectedSectionId();
                setPanel();
              }}
              className="inline-block underline underline-offset-2"
            >
              delete it
            </button>
            , or leave it empty.
          </div>
        )}
      </section>
    </EditableSectionContextMenu>
  );
}
