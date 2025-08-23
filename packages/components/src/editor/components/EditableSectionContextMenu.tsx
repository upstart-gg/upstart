import { generateId, type Section } from "@upstart.gg/sdk/shared/bricks";
import { useDebugMode, useEditorHelpers } from "../hooks/use-editor";
import { ContextMenu, Portal } from "@upstart.gg/style-system/system";
import { forwardRef, type PropsWithChildren } from "react";
import { useDraftHelpers, useSections } from "../hooks/use-page-data";

type EditableSectionContextMenuProps = PropsWithChildren<{
  section: Section;
}>;

const EditableSectionContextMenu = forwardRef<HTMLDivElement, EditableSectionContextMenuProps>(
  ({ section, children }, ref) => {
    const debugMode = useDebugMode();
    const sections = useSections();
    const draftHelpers = useDraftHelpers();
    const { setSelectedSectionId, setPanel, setSelectedBrickId } = useEditorHelpers();
    // compare the curret section "order" to the max order of sections to determine if this is the first or last section
    const maxOrder = sections.reduce((max, sec) => Math.max(max, sec.order), -1);
    const minOrder = sections.reduce((min, sec) => Math.min(min, sec.order), Infinity);
    const isLastSection = section.order === maxOrder;
    const isFirstSection = section.order === minOrder;
    return (
      <ContextMenu.Root
        modal={false}
        onOpenChange={(menuOpen) => {
          // editorHelpers.setContextMenuVisible(menuOpen);
        }}
      >
        <ContextMenu.Trigger disabled={debugMode} ref={ref}>
          {children}
        </ContextMenu.Trigger>
        <Portal>
          <ContextMenu.Content className="nodrag" size="2">
            <ContextMenu.Group>
              <ContextMenu.Label>{section.label ?? "Unnamed"} (section)</ContextMenu.Label>
              <ContextMenu.Item
                onClick={() => {
                  setSelectedSectionId(section.id);
                  setPanel("inspector");
                }}
              >
                <div className="flex items-center justify-start gap-2">
                  <span>Settings</span>
                </div>
              </ContextMenu.Item>
              <ContextMenu.Separator />
              {!isFirstSection && (
                <ContextMenu.Item onClick={() => draftHelpers.moveSectionUp(section.id)}>
                  <div className="flex items-center justify-start gap-2">
                    <span>Reorder up</span>
                  </div>
                </ContextMenu.Item>
              )}
              {!isLastSection && (
                <ContextMenu.Item onClick={() => draftHelpers.moveSectionDown(section.id)}>
                  <div className="flex items-center justify-start gap-2">
                    <span>Reorder down</span>
                  </div>
                </ContextMenu.Item>
              )}
            </ContextMenu.Group>
            <ContextMenu.Separator />
            <ContextMenu.Group>
              <ContextMenu.Item
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
              </ContextMenu.Item>
              <ContextMenu.Item
                onClick={(e) => {
                  e.stopPropagation();
                  draftHelpers.duplicateSection(section.id);
                }}
              >
                <div className="flex items-center justify-start gap-2">
                  <span>Duplicate</span>
                </div>
              </ContextMenu.Item>
            </ContextMenu.Group>
            <ContextMenu.Separator />
            <ContextMenu.Item
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
            </ContextMenu.Item>
          </ContextMenu.Content>
        </Portal>
      </ContextMenu.Root>
    );
  },
);

export default EditableSectionContextMenu;
