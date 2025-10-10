import type { Brick } from "@upstart.gg/sdk/bricks";
import { forwardRef, type PropsWithChildren } from "react";
import { useDebugMode, useEditorHelpers } from "../hooks/use-editor";
import { ContextMenu, Portal, toast } from "@upstart.gg/style-system/system";
import { useBrickManifest } from "~/shared/hooks/use-brick-manifest";
import { useDraftHelpers } from "../hooks/use-page-data";

type EditableBrickContextMenuProps = PropsWithChildren<{
  brick: Brick;
  isContainerChild?: boolean;
}>;

const EditableBrickContextMenu = forwardRef<HTMLDivElement, EditableBrickContextMenuProps>(
  ({ brick, isContainerChild, children }, ref) => {
    const draftHelpers = useDraftHelpers();
    const editorHelpers = useEditorHelpers();
    const debugMode = useDebugMode();
    const manifest = useBrickManifest(brick.type);
    const canMovePrev = draftHelpers.canMoveTo(brick.id, "previous");
    const canMoveNext = draftHelpers.canMoveTo(brick.id, "next");
    const parentContainer = draftHelpers.getParentBrick(brick.id);
    const parentElement = parentContainer ? document.getElementById(parentContainer.id) : null;
    const flexOrientation = parentElement ? getComputedStyle(parentElement).flexDirection || "row" : "row";

    return (
      <ContextMenu.Root
        modal={false}
        onOpenChange={(menuOpen) => {
          editorHelpers.setContextMenuVisible(menuOpen);
        }}
      >
        <ContextMenu.Trigger disabled={debugMode} ref={ref}>
          {children}
        </ContextMenu.Trigger>
        <Portal>
          {/* The "nodrag" class is here to prevent the grid manager
            from handling click event coming from the menu items.
            We still need to stop the propagation for other listeners. */}
          <ContextMenu.Content className="nodrag" size="2">
            <ContextMenu.Label className="!text-sm">{manifest.name} (brick)</ContextMenu.Label>
            {manifest.duplicatable && (
              <ContextMenu.Item
                shortcut="⌘D"
                onClick={(e) => {
                  e.stopPropagation();
                  draftHelpers.duplicateBrick(brick.id);
                }}
              >
                Duplicate
              </ContextMenu.Item>
            )}
            <ContextMenu.Item
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(JSON.stringify(brick));
                toast(
                  `Brick "${manifest.name}" copied to clipboard. You can paste it on this page or another page.`,
                  {
                    className: "min-w-fit",
                  },
                );
              }}
            >
              Copy brick
            </ContextMenu.Item>

            {canMovePrev && (
              <ContextMenu.Item
                shortcut={isContainerChild ? "⌘↑" : "⌘←"}
                onClick={(e) => {
                  e.stopPropagation();
                  draftHelpers.moveBrick(brick.id, "previous");
                }}
              >
                {isContainerChild && flexOrientation === "column" ? "Move up" : "Move left"}
              </ContextMenu.Item>
            )}
            {canMoveNext && (
              <ContextMenu.Item
                shortcut={isContainerChild ? "⌘↓" : "⌘→"}
                onClick={(e) => {
                  e.stopPropagation();
                  draftHelpers.moveBrick(brick.id, "next");
                }}
              >
                {isContainerChild && flexOrientation === "column" ? "Move down" : "Move right"}
              </ContextMenu.Item>
            )}
            <ContextMenu.Sub>
              <ContextMenu.SubTrigger>Visible on</ContextMenu.SubTrigger>
              <ContextMenu.SubContent>
                <ContextMenu.CheckboxItem
                  checked={!brick.props.hidden?.mobile}
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={() => draftHelpers.toggleBrickVisibilityPerBreakpoint(brick.id, "mobile")}
                >
                  Mobile
                </ContextMenu.CheckboxItem>

                <ContextMenu.CheckboxItem
                  checked={!brick.props.hidden?.desktop}
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={() => draftHelpers.toggleBrickVisibilityPerBreakpoint(brick.id, "desktop")}
                >
                  Desktop
                </ContextMenu.CheckboxItem>
              </ContextMenu.SubContent>
            </ContextMenu.Sub>
            {parentContainer && (
              <>
                <ContextMenu.Separator />
                <ContextMenu.Sub>
                  <ContextMenu.SubTrigger>Parent container</ContextMenu.SubTrigger>
                  <ContextMenu.SubContent>
                    <ContextMenu.Item
                      onClick={(e) => {
                        e.stopPropagation();
                        draftHelpers.duplicateBrick(parentContainer.id);
                      }}
                    >
                      Duplicate container
                    </ContextMenu.Item>
                    {/* <ContextMenu.Item
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(JSON.stringify(parentContainer));
                        toast.success(`Container copied to clipboard`);
                      }}
                    >
                      Copy container
                    </ContextMenu.Item> */}
                    <ContextMenu.Item
                      onClick={(e) => {
                        e.stopPropagation();
                        editorHelpers.setSelectedBrickId(parentContainer.id);
                        editorHelpers.setPanel("inspector");
                      }}
                    >
                      Edit container
                    </ContextMenu.Item>
                    <ContextMenu.Separator />
                    <ContextMenu.Item
                      shortcut="⌫"
                      color="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        draftHelpers.deleteBrick(parentContainer.id);
                        editorHelpers.deselectBrick(parentContainer.id);
                        editorHelpers.hidePanel("inspector");
                      }}
                    >
                      Delete container
                    </ContextMenu.Item>
                  </ContextMenu.SubContent>
                </ContextMenu.Sub>
                <ContextMenu.Item
                  onClick={(e) => {
                    e.stopPropagation();
                    draftHelpers.detachBrickFromContainer(brick.id);
                  }}
                >
                  Detach from parent
                </ContextMenu.Item>
              </>
            )}
            {manifest.deletable && (
              <>
                <ContextMenu.Separator />
                <ContextMenu.Item
                  shortcut="⌫"
                  color="red"
                  onClick={(e) => {
                    e.stopPropagation();
                    draftHelpers.deleteBrick(brick.id);
                    editorHelpers.deselectBrick(brick.id);
                    editorHelpers.hidePanel("inspector");
                  }}
                >
                  Delete
                </ContextMenu.Item>
              </>
            )}
          </ContextMenu.Content>
        </Portal>
      </ContextMenu.Root>
    );
  },
);

export default EditableBrickContextMenu;
