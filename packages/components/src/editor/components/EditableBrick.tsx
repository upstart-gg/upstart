import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import {
  forwardRef,
  type PropsWithChildren,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  useEffect,
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
  useHover,
  useInteractions,
  safePolygon,
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
    const [isMenuBarVisible, setMenuBarVisible] = useState(false);

    // const clientPoint = useClientPoint(context);
    const {
      refs: barsRefs,
      floatingStyles: barsFloatingStyles,
      update: updateBarsPlacement,
      context: barsFloatingContext,
    } = useFloating({
      open: isMenuBarVisible,
      onOpenChange: setMenuBarVisible,
      // transform: true,
      middleware: [
        offset(manifest.isContainer ? { mainAxis: 8, crossAxis: 0 } : { mainAxis: -44, crossAxis: 3 }),
        autoPlacement({
          allowedPlacements: manifest.isContainer ? ["bottom", "top"] : ["bottom-start", "top-start"],
        }),
      ],
    });
    const hover = useHover(barsFloatingContext, {
      handleClose: safePolygon(),
      delay: {
        open: 0,
        close: 300,
      },
    });
    const { getReferenceProps, getFloatingProps } = useInteractions([hover]);

    const brickRef = useMergeRefs([ref, barsRefs.setReference]);

    const wrapperClass = useBrickWrapperStyle({
      brick,
      editable: true,
      selected: selectedBrickId === brick.id,
    });

    useEffect(() => {
      if (barsRefs.reference.current) {
        const onMouseMove = () => {
          hasMouseMoved.current = true;
        };
        const onMouseDown = () => {
          hasMouseMoved.current = false;
        };
        const onMouseUp = () => {
          updateBarsPlacement();
          setTimeout(() => {
            hasMouseMoved.current = false;
          }, 200);
        };

        const el = barsRefs.reference.current as HTMLDivElement;

        el.addEventListener("mousedown", onMouseDown);
        el.addEventListener("mouseup", onMouseUp);
        el.addEventListener("mousemove", onMouseMove);

        return () => {
          el.removeEventListener("mousedown", onMouseDown);
          el.removeEventListener("mouseup", onMouseUp);
          el.removeEventListener("mousemove", onMouseMove);
        };
      }
    }, [barsRefs.reference, updateBarsPlacement]);

    const onBrickWrapperClick = (e: MouseEvent<HTMLElement>) => {
      const brickTarget = e.currentTarget as HTMLElement;
      const target = e.target as HTMLElement;
      const group = target.closest<HTMLElement>("[data-brick-group]");

      if (group) {
        console.debug("onBrickWrapperClick: click ignored (group)");
        return;
      }

      if (hasMouseMoved.current || !brickTarget.matches("[data-brick]")) {
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
          // role="button"
          id={brick.id}
          data-brick
          data-brick-id={brick.id}
          data-x={brick.position[previewMode].x}
          data-y={brick.position[previewMode].y}
          data-w={brick.position[previewMode].w}
          data-h={brick.position[previewMode].h}
          data-brick-type={brick.type}
          data-element-kind={manifest.kind}
          data-last-touched={brick.props.lastTouched ?? "0"}
          {...(manifest.movable ? {} : { "data-no-drag": "true" })}
          className={tx(wrapperClass, `![animation-delay:${0.5 * (index + 1)}s]`)}
          ref={brickRef}
          onClick={onBrickWrapperClick}
          // onMouseDown={(e) => {
          //   hasMouseMoved.current = false;
          // }}
          // onMouseUp={(e) => {
          //   updateBarsPlacement();
          //   setTimeout(() => {
          //     hasMouseMoved.current = false;
          //   }, 200);
          // }}
          // onMouseMove={(e) => {
          //   hasMouseMoved.current = true;
          // }}
          {...getReferenceProps()}
        >
          <BaseBrick brick={brick} selectedBrickId={selectedBrickId} editable />
          {/* <BrickEditLabel brick={brick} isContainerChild={isContainerChild} /> */}
          {children} {/* Make sure to include children to add resizable handle */}
          <BrickMenuBarsContainer
            ref={barsRefs.setFloating}
            brick={brick}
            isContainerChild={isContainerChild}
            style={barsFloatingStyles}
            show={isMenuBarVisible}
            {...getFloatingProps()}
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
    show: boolean;
  }>;

/**
 * The An horizontal container holding Menu bars that appears at the bottom/top of the brick when it's selected.
 */
const BrickMenuBarsContainer = forwardRef<HTMLDivElement, BrickMenuBarProps>(
  ({ brick, style, isContainerChild, show, ...rest }, ref) => {
    const selectedBrickId = useSelectedBrickId();
    const visible = show || selectedBrickId === brick.id;

    return (
      <div
        ref={ref}
        data-ui
        role="navigation"
        className={tx(
          "z-[99999]   flex gap-2 items-center",
          "transition-opacity duration-150",
          visible ? "opacity-100" : "opacity-0",
          // selectedBrickId !== brick.id && "opacity-0",
          // "group-hover/brick:(opacity-100)",
        )}
        style={style}
        {...rest}
      >
        {/* container for main nav bar */}
        <BrickMainNavBar brick={brick} />
        {/* container for text editor buttons */}
        <BrickTextNavBar brick={brick} />
      </div>
    );
  },
);

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

  return (
    <nav className={menuNavBarCls}>
      <span className={tx(menuBarBtnCls, menuBarBtnCommonCls, "capitalize pointer-events-none text-sm")}>
        {manifest.type}
      </span>
      {manifest.presets && (
        <BrickPopover brick={brick} view="presets">
          <button type="button" className={tx(menuBarBtnCls, menuBarBtnCommonCls, menuBarBtnSquareCls)}>
            <BiSolidColor className={tx("w-5 h-5")} />
            {/* <span className={tx(menuBarTooltipCls)}>Presets</span> */}
          </button>
        </BrickPopover>
      )}
      {/* Settings & styles */}
      <BrickPopover brick={brick} view="settings">
        <button type="button" className={tx(menuBarBtnCls, menuBarBtnCommonCls, menuBarBtnSquareCls)}>
          <FiSettings className={tx("w-5 h-5")} />
          {/* <span className={tx(menuBarTooltipCls)}>Settings</span> */}
        </button>
      </BrickPopover>
      {/* Content */}
      <button type="button" className={tx(menuBarBtnCls, menuBarBtnCommonCls, menuBarBtnSquareCls)}>
        <FiDatabase className={tx("w-5 h-5")} />
        {/* <span className={tx(menuBarTooltipCls)}>Dynamic content</span> */}
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
        className="absolute top-[calc(100%+54px)] left-1/2 -translate-x-1/2 bg-orange-300/40 text-black opacity-0
                    text-xs font-semibold py-0.5 px-1.5 rounded hover:bg-white/90 translate-y-1
                     group-hover/brick:(opacity-100 translate-y-0) transition-all duration-150
                    "
      >
        {manifest.name}
        {debugMode && <span className="font-mono pl-4">{brick.id}</span>}
      </div>
    );
  }
  return (
    <div
      data-ui
      className={tx(
        `absolute transition-all -z-10 duration-150 opacity-0
        group-hover/brick:(opacity-100 translate-y-0)
        translate-y-1  bg-black/50 backdrop-blur-md shadow-md
      text-white text-xs font-normal py-0.5 px-2 rounded`,
        isContainerChild ? "bottom-1 left-1" : "-bottom-6 right-1",
      )}
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
            <ContextMenu.Label className="!text-xs">
              {manifest.name} ({manifest.kind})
            </ContextMenu.Label>
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
