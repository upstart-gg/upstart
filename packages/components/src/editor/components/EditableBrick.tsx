import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import {
  forwardRef,
  type PropsWithChildren,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
} from "react";
import { tx } from "@upstart.gg/style-system/twind";
import {
  useDebugMode,
  useDraft,
  useDraftHelpers,
  useEditorHelpers,
  useSelectedBrick,
} from "../hooks/use-editor";
import { ContextMenu, Portal } from "@upstart.gg/style-system/system";
import BaseBrick from "~/shared/components/BaseBrick";
import { useBrickWrapperStyle } from "~/shared/hooks/use-brick-style";

type BrickWrapperProps = ComponentProps<"div"> & {
  brick: Brick;
  isContainerChild?: boolean;
  index: number;
};

const BrickWrapper = forwardRef<HTMLDivElement, BrickWrapperProps>(
  ({ brick, style, children, isContainerChild, index }, ref) => {
    const hasMouseMoved = useRef(false);
    const selectedBrick = useSelectedBrick();
    const { getParentBrick } = useDraftHelpers();
    const debugMode = useDebugMode();
    const wrapperClass = useBrickWrapperStyle({
      brick,
      editable: true,
      selected: selectedBrick?.id === brick.id,
    });

    const { setSelectedBrick } = useDraftHelpers();
    const { setPanel } = useEditorHelpers();

    const onBrickWrapperClick = (e: MouseEvent<HTMLElement>) => {
      const target = e.currentTarget as HTMLElement;
      if (hasMouseMoved.current || target.matches(".react-resizable-handle") || !target.matches(".brick")) {
        // if (target.matches(".react-resizable-handle") || !target.matches(".brick")) {
        console.warn("click ignored", target);
        return;
      }

      let selectedBrick = brick;

      // If has shift key pressed, then we try to select the upper container
      if (e.shiftKey) {
        const parentBrick = getParentBrick(brick.id);
        if (parentBrick) {
          selectedBrick = parentBrick;
        }
      }

      setSelectedBrick(selectedBrick);
      setPanel("inspector");
      hasMouseMoved.current = false;

      // stop propagation otherwise the click could then be handled by the container
      e.stopPropagation();
    };

    return (
      <BrickContextMenu brick={brick} isContainerChild={isContainerChild}>
        <div
          id={brick.id}
          data-x="0"
          data-y="0"
          data-brick-type={brick.type}
          style={style}
          className={tx(wrapperClass, `![animation-delay:${0.5 * (index + 1)}s]`)}
          ref={ref}
          onClick={onBrickWrapperClick}
          onMouseDown={(e) => {
            hasMouseMoved.current = false;
          }}
          onMouseUp={(e) => {
            setTimeout(() => {
              hasMouseMoved.current = false;
            }, 100);
          }}
          onMouseMove={(e) => {
            hasMouseMoved.current = true;
          }}
        >
          <BaseBrick brick={brick} editable />
          {debugMode && <BrickDebugLabel brick={brick} isContainerChild={isContainerChild} />}
          {/* {brick.isContainer && <ContainerLabel brick={brick} />} */}
          {/* {brick.isContainer ? (
          <ContainerLabel brick={brick} />
        ) : (
          <BrickOptionsButton brick={brick} isContainerChild={isContainerChild} />
        )} */}
          {children} {/* Make sure to include children to add resizable handle */}
        </div>
      </BrickContextMenu>
    );
  },
);

function BrickDebugLabel({ brick, isContainerChild }: { brick: Brick; isContainerChild?: boolean }) {
  if (brick.isContainer) {
    return null;
  }
  return (
    <div className="absolute bottom-0 right-0 bg-white/40 text-black text-[10px] font-mono py-0.5 px-1.5 rounded hover:bg-white/90">
      {brick.id} {isContainerChild ? "" : `- x: ${brick.position.desktop.x} - y: ${brick.position.desktop.y}`}
    </div>
  );
}

export default BrickWrapper;

type BrickContextMenuProps = PropsWithChildren<{
  brick: Brick;
  isContainerChild?: boolean;
}>;

function BrickContextMenu({ brick, isContainerChild, children }: BrickContextMenuProps) {
  const [open, setOpen] = useState(false);
  const draft = useDraft();
  const draftHelpers = useDraftHelpers();
  const editorHelpers = useEditorHelpers();
  const debugMode = useDebugMode();
  const canMoveLeft = isContainerChild ? draftHelpers.canMoveToWithinParent(brick.id, "left") : null;
  const canMoveRight = isContainerChild ? draftHelpers.canMoveToWithinParent(brick.id, "right") : null;
  const parentContainer = draft.getParentBrick(brick.id);

  return (
    <ContextMenu.Root onOpenChange={setOpen}>
      <ContextMenu.Trigger disabled={debugMode}>{children}</ContextMenu.Trigger>
      <Portal>
        {/* The "nodrag" class is here to prevent the grid manager
            from handling click event coming from the menu items.
            We still need to stop the propagation for other listeners. */}
        <ContextMenu.Content className="nodrag" size="2">
          <ContextMenu.Item
            shortcut="⌘D"
            onClick={(e) => {
              e.stopPropagation();
              draft.duplicateBrick(brick.id);
            }}
          >
            Duplicate
          </ContextMenu.Item>
          <ContextMenu.Item
            shortcut="⌘C"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(JSON.stringify(brick));
            }}
          >
            Copy
          </ContextMenu.Item>
          {canMoveLeft && (
            <ContextMenu.Item
              shortcut="⌘&larr;"
              onClick={(e) => {
                e.stopPropagation();
                draft.moveBrickWithin(brick.id, "left");
              }}
            >
              Move left
            </ContextMenu.Item>
          )}
          {canMoveRight && (
            <ContextMenu.Item
              shortcut="⌘&rarr;"
              onClick={(e) => {
                e.stopPropagation();
                draft.moveBrickWithin(brick.id, "right");
              }}
            >
              Move right
            </ContextMenu.Item>
          )}
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger>Visible on</ContextMenu.SubTrigger>
            <ContextMenu.SubContent>
              <ContextMenu.CheckboxItem
                checked={!brick.position.mobile?.hidden}
                onClick={(e) => e.stopPropagation()}
                onCheckedChange={() => draft.toggleBrickVisibilityPerBreakpoint(brick.id, "mobile")}
              >
                Mobile
              </ContextMenu.CheckboxItem>

              <ContextMenu.CheckboxItem
                checked={!brick.position.desktop?.hidden}
                onClick={(e) => e.stopPropagation()}
                onCheckedChange={() => draft.toggleBrickVisibilityPerBreakpoint(brick.id, "desktop")}
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
                      draft.duplicateBrick(parentContainer.id);
                    }}
                  >
                    Duplicate container
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(JSON.stringify(parentContainer));
                    }}
                  >
                    Copy container
                  </ContextMenu.Item>
                  <ContextMenu.Item
                    onClick={(e) => {
                      e.stopPropagation();
                      draftHelpers.setSelectedBrick(parentContainer);
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
                      draft.deleteBrick(parentContainer.id);
                      draftHelpers.deselectBrick(parentContainer.id);
                      editorHelpers.hidePanel("inspector");
                    }}
                  >
                    Delete container
                  </ContextMenu.Item>
                </ContextMenu.SubContent>
              </ContextMenu.Sub>
            </>
          )}

          <ContextMenu.Separator />
          <ContextMenu.Item
            shortcut="⌫"
            color="red"
            onClick={(e) => {
              e.stopPropagation();
              draft.deleteBrick(brick.id);
              draftHelpers.deselectBrick(brick.id);
              editorHelpers.hidePanel("inspector");
            }}
          >
            Delete
          </ContextMenu.Item>
        </ContextMenu.Content>
      </Portal>
    </ContextMenu.Root>
  );
}
