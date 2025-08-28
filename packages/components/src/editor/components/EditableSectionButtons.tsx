import { generateId, type Section as SectionType } from "@upstart.gg/sdk/shared/bricks";
import { useEditorHelpers, useSelectedSectionId } from "../hooks/use-editor";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { DropdownMenu, Tooltip } from "@upstart.gg/style-system/system";
import { TbArrowAutofitHeight, TbBorderCorners, TbDots, TbCirclePlus } from "react-icons/tb";
import { useCallback, useState, type MouseEvent } from "react";
import { tx } from "@upstart.gg/style-system/twind";
import { useDraftHelpers, useSections } from "../hooks/use-page-data";

export default function EditableSectionButtons({ section }: { section: SectionType }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const draftHelpers = useDraftHelpers();
  const { setSelectedSectionId, setPanel, hidePanel, setSelectedBrickId } = useEditorHelpers();
  const sections = useSections();
  const selectedSectionId = useSelectedSectionId();
  // compare the curret section "order" to the max order of sections to determine if this is the first or last section
  const maxOrder = sections.reduce((max, sec) => Math.max(max, sec.order), -1);
  const minOrder = sections.reduce((min, sec) => Math.min(min, sec.order), Infinity);
  const isLastSection = section.order === maxOrder;
  const isFirstSection = section.order === minOrder;
  const isSpecialSection = typeof section.props.variant !== "undefined";
  const resizable = section.props.variant !== "navbar" && section.props.variant !== "footer";

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const onSettingsBtnClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      if (selectedSectionId !== section.id) {
        setSelectedSectionId(section.id);
        setPanel("inspector");
      } else {
        hidePanel();
        setSelectedSectionId();
      }
    },
    [selectedSectionId],
  );

  const btnCls = tx(
    "select-none hover:opacity-90",
    "text-base px-1.5 h-7  ",
    "text-black/80 hover:bg-upstart-300/20 font-bold flex items-center gap-1",
    "active:(outline-none ring-0) focus:(outline-none ring-0)",
  );
  return (
    <div
      role="toolbar"
      className={tx(
        "font-sans",
        // bottom-[3px]
        isLastSection ? "bottom-3" : "bottom-0",
        dropdownOpen ? "opacity-100" : "opacity-0",
        `section-options-buttons translate-y-1/2 shadow
            absolute z-[99999] left-1/2 -translate-x-1/2 min-w-fit border border-gray-200`,
        "gap-0 rounded-md [&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md ",
        "bg-white/90 backdrop-blur-md transition-opacity duration-500 group-hover/section:opacity-100 flex",
      )}
    >
      <div
        className={tx(btnCls, "inline-flex flex-nowrap items-center gap-1 !px-2.5 pointer-events-none")}
        data-trigger-section-inspector
      >
        <div className="text-xs font-light text-nowrap">Section</div>
        <div className="text-xs font-semibold text-nowrap max-w-[120px] truncate">
          {section.label ?? "Unnamed"}
        </div>
      </div>
      <button
        type="button"
        id={`${section.id}-resize-handle`}
        className={tx(btnCls)}
        onClick={onSettingsBtnClick}
      >
        <HiOutlineCog6Tooth className="w-5 h-5" />
      </button>
      {resizable && (
        <button
          type="button"
          id={`${section.id}-resize-handle`}
          className={tx("!cursor-ns-resize", btnCls, "section-resizable-handle")}
        >
          <TbArrowAutofitHeight className="w-5 h-5" />
        </button>
      )}
      {resizable && section.props.minHeight !== "full" && (
        <Tooltip content="Fill entire screen height" delayDuration={400}>
          <button
            type="button"
            onClick={() => {
              draftHelpers.updateSectionProps(section.id, {
                minHeight: "full",
              });
              const el = document.getElementById(section.id);
              if (el) {
                el.style.removeProperty("minHeight");
                el.style.removeProperty("maxHeight");
                el.style.removeProperty("height");
              }
              setTimeout(() => {
                window.scrollTo(0, document.body.scrollHeight);
                document.getElementById(section.id)?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
            className={tx(btnCls, "cursor-pointer")}
          >
            <TbBorderCorners className="w-5 h-5" />
          </button>
        </Tooltip>
      )}

      <Tooltip content="Create new section below" delayDuration={400}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            const newId = `s_${generateId()}`;
            draftHelpers.createEmptySection(newId, section.id);
            setSelectedSectionId(newId);
            setPanel("inspector");
          }}
          className={tx(btnCls, "cursor-pointer")}
        >
          <TbCirclePlus className="w-5 h-5" />
        </button>
      </Tooltip>
      <DropdownMenu.Root modal={false} onOpenChange={setDropdownOpen}>
        <DropdownMenu.Trigger
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <button type="button" className={tx(btnCls)}>
            <TbDots className="w-5 h-5" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content sideOffset={5} size="2" side="bottom" align="end">
          <DropdownMenu.Group>
            <DropdownMenu.Label>{section.label ?? "Unnamed"} (section)</DropdownMenu.Label>
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
            <DropdownMenu.Item
              onClick={(e) => {
                e.stopPropagation();
                const newId = `s_${generateId()}`;
                draftHelpers.createEmptySection(newId, section.id);
                setSelectedSectionId(newId);
                setPanel("inspector");
              }}
            >
              <div className="flex items-center justify-start gap-2">
                <span>Create new section below</span>
              </div>
            </DropdownMenu.Item>
            {isSpecialSection === false && (
              <DropdownMenu.Item
                onClick={(e) => {
                  e.stopPropagation();
                  draftHelpers.duplicateSection(section.id);
                }}
              >
                <div className="flex items-center justify-start gap-2">
                  <span>Duplicate</span>
                </div>
              </DropdownMenu.Item>
            )}
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            color="red"
            onClick={(e) => {
              e.stopPropagation();
              draftHelpers.deleteSection(section.id);
              setSelectedSectionId();
              setSelectedBrickId();
              setPanel();
            }}
          >
            <div className="flex items-center justify-start gap-2.5">
              <span>Delete section</span>
            </div>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
  );
}
