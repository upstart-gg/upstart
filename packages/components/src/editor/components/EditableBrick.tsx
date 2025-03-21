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
  useGetBrick,
  usePreviewMode,
  useSelectedBrickId,
} from "../hooks/use-editor";
import {
  ContextMenu,
  Portal,
  useFloating,
  useMergeRefs,
  autoPlacement,
  offset,
  Popover,
  Inset,
  toast,
} from "@upstart.gg/style-system/system";
import BaseBrick from "~/shared/components/BaseBrick";
import { useBrickWrapperStyle } from "~/shared/hooks/use-brick-style";
import {
  menuBarBtnCls,
  menuBarBtnCommonCls,
  menuBarBtnSquareCls,
  menuBarTooltipCls,
  menuNavBarCls,
} from "~/shared/styles/menubar-styles";
import { manifests } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
import { BiSolidColor } from "react-icons/bi";
import { useBrickManifest } from "~/shared/hooks/use-brick-manifest";
import { FiSettings, FiDatabase } from "react-icons/fi";
import { BrickPopover } from "./BrickPopover";

type BrickWrapperProps = ComponentProps<"div"> & {
  brick: Brick;
  isContainerChild?: boolean;
  index: number;
};

const EditableBrickWrapper = forwardRef<HTMLDivElement, BrickWrapperProps>(
  ({ brick, children, isContainerChild, index }, ref) => {
    const hasMouseMoved = useRef(false);
    const selectedBrickId = useSelectedBrickId();
    const { setSelectedBrickId } = useEditorHelpers();
    const previewMode = usePreviewMode();
    const { getParentBrick } = useDraftHelpers();
    const manifest = useBrickManifest(brick.type);
    // const clientPoint = useClientPoint(context);
    const {
      refs: barsRefs,
      floatingStyles: barsFloatingStyles,
      update: updateBarsPlacement,
    } = useFloating({
      transform: true,
      middleware: [
        offset({ mainAxis: 4, crossAxis: 4 }),
        autoPlacement({
          allowedPlacements: ["bottom-start", "top-start"],
        }),
      ],
    });

    const brickRef = useMergeRefs([ref, barsRefs.setReference]);

    const wrapperClass = useBrickWrapperStyle({
      brick,
      editable: true,
      selected: selectedBrickId === brick.id,
    });

    const onBrickWrapperClick = (e: MouseEvent<HTMLElement>) => {
      const brickTarget = e.currentTarget as HTMLElement;
      const target = e.target as HTMLElement;
      const group = target.closest<HTMLElement>("[data-brick-group]");

      if (group) {
        console.debug("onBrickWrapperClick: click ignored (group)");
        // toast(`Clicked on part: ${group.dataset.brickGroup}`);
        return;
      }

      if (hasMouseMoved.current || !brickTarget.matches(".brick")) {
        console.debug("onBrickWrapperClick: click ignored");
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

      setSelectedBrickId(selectedBrick.id);

      // setPanel("inspector");
      hasMouseMoved.current = false;

      // stop propagation otherwise the click could then be handled by the container
      e.stopPropagation();
    };

    return (
      <BrickContextMenu brick={brick} isContainerChild={isContainerChild}>
        <div
          role="button"
          id={brick.id}
          data-brick-id={brick.id}
          data-x={brick.position[previewMode].x}
          data-y={brick.position[previewMode].y}
          data-w={brick.position[previewMode].w}
          data-h={brick.position[previewMode].h}
          data-brick-type={brick.type}
          data-element-kind="brick"
          data-last-touched={brick.props.lastTouched ?? "0"}
          {...(manifest.movable ? {} : { "data-no-drag": "true" })}
          className={tx(wrapperClass, `![animation-delay:${0.5 * (index + 1)}s]`)}
          ref={brickRef}
          onClick={onBrickWrapperClick}
          onMouseDown={(e) => {
            hasMouseMoved.current = false;
          }}
          onMouseUp={(e) => {
            setTimeout(() => {
              hasMouseMoved.current = false;
              updateBarsPlacement();
            }, 200);
          }}
          onMouseMove={(e) => {
            hasMouseMoved.current = true;
          }}
        >
          <BaseBrick brick={brick} editable />
          <BrickEditLabel brick={brick} isContainerChild={isContainerChild} />
          {children} {/* Make sure to include children to add resizable handle */}
          <BrickMenuBarsContainer
            ref={barsRefs.setFloating}
            brick={brick}
            isContainerChild={isContainerChild}
            style={barsFloatingStyles}
          />
        </div>
      </BrickContextMenu>
    );
  },
);

type BrickMenuBarProps = ComponentProps<"div"> &
  PropsWithChildren<{
    brick: Brick;
    isContainerChild?: boolean;
  }>;

/**
 * The An horizontal container holding Menu bars that appears at the bottom/top of the brick when it's selected.
 */
const BrickMenuBarsContainer = forwardRef<HTMLDivElement, BrickMenuBarProps>(({ brick, style }, ref) => {
  const selectedBrickId = useSelectedBrickId();
  return (
    <div
      ref={ref}
      data-ui
      role="navigation"
      className={tx(
        // absolute left-0 top-full pt-1
        selectedBrickId !== brick.id && "opacity-0",
        `z-[99999]  delay-100
        transition-all duration-300 flex gap-2 items-center
        group-hover/brick:(opacity-100)`,
      )}
      style={style}
    >
      {/* container for main nav bar */}
      <BrickMainNavBar brick={brick} />
      {/* container for text editor buttons */}
      <BrickTextNavBar brick={brick} />
    </div>
  );
});

function BrickTextNavBar({ brick }: { brick: Brick }) {
  return (
    <div
      id={`text-editor-menu-${brick.id}`}
      // Hide the menu if it doesn't have any children so that the border doesn't show up
      className={tx("contents", menuNavBarCls, "[&:not(:has(*))]:hidden")}
    />
  );
}

function BrickMainNavBar({ brick }: { brick: Brick }) {
  const manifest = manifests[brick.type];
  if (!manifest) {
    return null;
  }

  if (brick.type === "text") {
    console.log("text manifest", manifest);
  }
  return (
    <nav className={menuNavBarCls}>
      {manifest.presets && (
        <BrickPopover brick={brick} view="presets">
          <button type="button" className={tx(menuBarBtnCls, menuBarBtnCommonCls, menuBarBtnSquareCls)}>
            <BiSolidColor className={tx("w-5 h-5")} />
            <span className={tx(menuBarTooltipCls)}>Presets</span>
          </button>
        </BrickPopover>
      )}
      {/* Settings & styles */}
      <BrickPopover brick={brick} view="settings">
        <button type="button" className={tx(menuBarBtnCls, menuBarBtnCommonCls, menuBarBtnSquareCls)}>
          <FiSettings className={tx("w-5 h-5")} />
          <span className={tx(menuBarTooltipCls)}>Settings</span>
        </button>
      </BrickPopover>
      {/* Content */}
      <button type="button" className={tx(menuBarBtnCls, menuBarBtnCommonCls, menuBarBtnSquareCls)}>
        <FiDatabase className={tx("w-5 h-5")} />
        <span className={tx(menuBarTooltipCls)}>Dynamic content</span>
      </button>
      {/* Todo: data source / content */}
    </nav>
  );
}

function BrickEditLabel({ brick, isContainerChild }: { brick: Brick; isContainerChild?: boolean }) {
  const debugMode = useDebugMode();
  const manifest = useBrickManifest(brick.type);
  if (brick.isContainer) {
    return (
      <div
        data-ui
        className="absolute top-full left-1/2 -translate-x-1/2 bg-orange-300/40 text-black
                    text-[10px] font-mono py-0.5 px-1.5 rounded hover:bg-white/90"
      >
        {brick.id}
      </div>
    );
  }
  return (
    <div
      data-ui
      className="absolute transition-all -z-10 duration-150 opacity-0
        group-hover/brick:(opacity-100 translate-y-0) tracking-wider
        translate-y-1 -bottom-6 uppercase right-1 bg-white/70 backdrop-blur-md shadow-md
      text-gray-600 text-xs font-semibold py-0.5 px-2 rounded-sm"
    >
      {manifest.name}
      {debugMode && (
        <span className="font-mono pl-4">
          {brick.id}{" "}
          {isContainerChild
            ? ""
            : ` · x: ${brick.position.desktop.x} · y: ${brick.position.desktop.y} ·
            ${brick.position.desktop.w}/${brick.position.desktop.h}`}
        </span>
      )}
    </div>
  );
}

export default EditableBrickWrapper;

type BrickContextMenuProps = PropsWithChildren<{
  brick: Brick;
  isContainerChild?: boolean;
}>;

const BrickContextMenu = forwardRef<HTMLDivElement, BrickContextMenuProps>(
  ({ brick, isContainerChild, children }, ref) => {
    // const [open, setOpen] = useState(false);
    const draft = useDraft();
    const draftHelpers = useDraftHelpers();
    const editorHelpers = useEditorHelpers();
    const debugMode = useDebugMode();
    const manifest = useBrickManifest(brick.type);
    const canMoveLeft = isContainerChild ? draftHelpers.canMoveToWithinParent(brick.id, "left") : null;
    const canMoveRight = isContainerChild ? draftHelpers.canMoveToWithinParent(brick.id, "right") : null;
    const parentContainer = draft.getParentBrick(brick.id);

    return (
      <ContextMenu.Root modal={false}>
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
                        draft.deleteBrick(parentContainer.id);
                        editorHelpers.deselectBrick(parentContainer.id);
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
                editorHelpers.deselectBrick(brick.id);
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
