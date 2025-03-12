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
  usePreviewMode,
  useSelectedBrick,
} from "../hooks/use-editor";
import { ContextMenu, Portal, Popover, Inset } from "@upstart.gg/style-system/system";
import BaseBrick from "~/shared/components/BaseBrick";
import { useBrickWrapperStyle } from "~/shared/hooks/use-brick-style";
import { menuBarBtnCls, menuBarBtnCommonCls, menuBarBtnSquareCls } from "~/shared/styles/menubar-styles";
import { manifests } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
import { MdBorderOuter } from "react-icons/md";
import { BiSolidColor } from "react-icons/bi";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoMdColorPalette } from "react-icons/io";
import { useBrickManifest } from "~/shared/hooks/use-brick-manifest";

type BrickWrapperProps = ComponentProps<"div"> & {
  brick: Brick;
  isContainerChild?: boolean;
  index: number;
};

const EditaleBrickWrapper = forwardRef<HTMLDivElement, BrickWrapperProps>(
  ({ brick, children, isContainerChild, index }, ref) => {
    const hasMouseMoved = useRef(false);
    const selectedBrick = useSelectedBrick();
    const previewMode = usePreviewMode();
    const { getParentBrick } = useDraftHelpers();
    const manifest = useBrickManifest(brick.type);
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
        console.debug("click ignored", target);
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
      <BrickMenuBar brick={brick} isContainerChild={isContainerChild}>
        <BrickContextMenu brick={brick} isContainerChild={isContainerChild}>
          <div
            id={brick.id}
            data-x={brick.position[previewMode].x}
            data-y={brick.position[previewMode].y}
            data-w={brick.position[previewMode].w}
            data-h={brick.position[previewMode].h}
            data-brick-type={brick.type}
            data-element-kind="brick"
            {...(manifest.movable ? {} : { "data-no-drag": "true" })}
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
            <BrickEditLabel brick={brick} isContainerChild={isContainerChild} />
            {children} {/* Make sure to include children to add resizable handle */}
          </div>
        </BrickContextMenu>
      </BrickMenuBar>
    );
  },
);

type BrickMenuBarProps = PropsWithChildren<{
  brick: Brick;
  isContainerChild?: boolean;
}>;

const BrickMenuBar = forwardRef<HTMLDivElement, BrickMenuBarProps>(
  ({ brick, isContainerChild, children }, ref) => {
    const selectedBrick = useSelectedBrick();

    return (
      <Popover.Root modal={false} open={selectedBrick?.id === brick.id}>
        {/* @ts-ignore */}
        <Popover.Trigger ref={ref}>{children}</Popover.Trigger>
        <Popover.Content width="fit-content" minWidth="fit-content" maxWidth="fit-content">
          <Inset>
            <nav
              role="navigation"
              className={tx(
                `bg-upstart-600 flex text-base text-white w-fit justify-start items-stretch transition-opacity duration-300 rounded-md`,
              )}
            >
              <BrickMenuBarButtons brick={brick} />
              {/* container for text editor buttons */}
              <div id={`text-editor-menu-${brick.id}`} className="contents" />
            </nav>
          </Inset>
        </Popover.Content>
      </Popover.Root>
    );
  },
);

function BrickMenuBarButtons({ brick }: { brick: Brick }) {
  const manifest = manifests[brick.type];
  if (!manifest) {
    return null;
  }
  return (
    <>
      <button type="button" className={tx(menuBarBtnCls, menuBarBtnCommonCls, menuBarBtnSquareCls)}>
        <BiSolidColor className={tx("w-5 h-5")} />
      </button>
      <button type="button" className={tx(menuBarBtnCls, menuBarBtnCommonCls, menuBarBtnSquareCls)}>
        <LuLayoutDashboard className={tx("w-5 h-5")} />
      </button>
      <button type="button" className={tx(menuBarBtnCls, menuBarBtnCommonCls, menuBarBtnSquareCls)}>
        <IoMdColorPalette className={tx("w-5 h-5")} />
      </button>
      {manifest.props.border && (
        <button type="button" className={tx(menuBarBtnCls, menuBarBtnCommonCls, menuBarBtnSquareCls)}>
          <MdBorderOuter className={tx("w-5 h-5")} />
        </button>
      )}
    </>
  );
}

function BrickEditLabel({ brick, isContainerChild }: { brick: Brick; isContainerChild?: boolean }) {
  const debugMode = useDebugMode();
  const manifest = useBrickManifest(brick.type);
  if (brick.isContainer) {
    return (
      <div
        data-element-type="brick-label"
        className="absolute top-full left-1/2 -translate-x-1/2 bg-orange-300/40 text-black
                    text-[10px] font-mono py-0.5 px-1.5 rounded hover:bg-white/90"
      >
        {brick.id}
      </div>
    );
  }
  return (
    <div
      data-element-type="brick-label"
      className="absolute transition-all -z-10 duration-150 opacity-0
        group-hover/brick:(opacity-100 translate-y-0) tracking-wider
        -translate-y-5 -bottom-6 uppercase border border-t-0 border-gray-400 left-1 bg-white/70
      text-gray-600 text-xs font-semibold py-0.5 px-2 rounded-md"
    >
      {manifest.name}
      {debugMode && (
        <span className="font-mono pl-4">
          {brick.id}{" "}
          {isContainerChild
            ? ""
            : ` · x: ${brick.position.desktop.x} · y: ${brick.position.desktop.y} · ${brick.position.desktop.w}/${brick.position.desktop.h}`}
        </span>
      )}
    </div>
  );
}

export default EditaleBrickWrapper;

type BrickContextMenuProps = PropsWithChildren<{
  brick: Brick;
  isContainerChild?: boolean;
}>;

const BrickContextMenu = forwardRef<HTMLDivElement, BrickContextMenuProps>(
  ({ brick, isContainerChild, children }, ref) => {
    const [open, setOpen] = useState(false);
    const draft = useDraft();
    const draftHelpers = useDraftHelpers();
    const editorHelpers = useEditorHelpers();
    const debugMode = useDebugMode();
    const manifest = useBrickManifest(brick.type);
    const canMoveLeft = isContainerChild ? draftHelpers.canMoveToWithinParent(brick.id, "left") : null;
    const canMoveRight = isContainerChild ? draftHelpers.canMoveToWithinParent(brick.id, "right") : null;
    const parentContainer = draft.getParentBrick(brick.id);

    return (
      <ContextMenu.Root onOpenChange={setOpen} modal={false}>
        <ContextMenu.Trigger disabled={debugMode} ref={ref}>
          {children}
        </ContextMenu.Trigger>
        <Portal>
          {/* The "nodrag" class is here to prevent the grid manager
            from handling click event coming from the menu items.
            We still need to stop the propagation for other listeners. */}
          <ContextMenu.Content className="nodrag" size="2">
            {manifest.duplicatable && (
              <ContextMenu.Item
                shortcut="⌘D"
                onClick={(e) => {
                  e.stopPropagation();
                  draft.duplicateBrick(brick.id);
                }}
              >
                Duplicate
              </ContextMenu.Item>
            )}

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
  },
);
