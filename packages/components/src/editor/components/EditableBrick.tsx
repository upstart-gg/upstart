import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import {
  forwardRef,
  type PropsWithChildren,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import {
  useDebugMode,
  useDraftHelpers,
  useEditorHelpers,
  usePanel,
  usePreviewMode,
  useSection,
  useSelectedBrickId,
} from "../hooks/use-editor";
import {
  ContextMenu,
  Portal,
  useFloating,
  useMergeRefs,
  autoPlacement,
  offset,
  toast,
  useHover,
  useInteractions,
  safePolygon,
  autoUpdate,
  type Placement,
  useDelayGroup,
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
import { FiSettings, FiDatabase, FiTrash, FiTrash2 } from "react-icons/fi";
import { BrickPopover } from "./BrickPopover";
import { tx, css } from "@upstart.gg/style-system/twind";

type BrickWrapperProps = ComponentProps<"div"> & {
  brick: Brick;
  isContainerChild?: boolean;
  index: number;
};

function useBarPlacements(brick: Brick): Placement[] {
  // const previewMode = usePreviewMode();
  // const { isLastSection } = useDraftHelpers();
  // const section = useSection(brick.sectionId);
  // const manifest = useBrickManifest(brick.type);
  return ["bottom", "top"] as Placement[];
  // return useMemo(() => {
  //   const placements: Placement[] = [];
  // if (brick.parentId || manifest.isContainer || !section) {
  //   placements.push(...(["bottom", "top"] as const));
  // } else {
  //   if (!isLastSection(section.id)) {
  //     placements.push("bottom-start");
  //   }
  //   if (
  //     (typeof brick.position[previewMode].y === "number" && brick.position[previewMode].y > 2) ||
  //     isLastSection(section.id)
  //   ) {
  //     placements.push("top-start");
  //   }
  // }
  //   return placements;
  // }, [brick, previewMode, manifest.isContainer, section, isLastSection]);
}

const EditableBrickWrapper = forwardRef<HTMLDivElement, BrickWrapperProps>(
  ({ brick, children, isContainerChild, index }, ref) => {
    const hasMouseMoved = useRef(false);
    const selectedBrickId = useSelectedBrickId();
    const previewMode = usePreviewMode();
    const { panelPosition } = usePanel();
    const editorHelpers = useEditorHelpers();
    const { getParentBrick } = useDraftHelpers();
    const manifest = useBrickManifest(brick.type);
    const parentBrick = getParentBrick(brick.id);
    const [isMenuBarVisible, setMenuBarVisible] = useState(false);
    const allowedPlacements = useBarPlacements(brick);

    // brick = brickWithDefaults(brick);

    const {
      refs: barsRefs,
      floatingStyles: barsFloatingStyles,
      update: updateBarsPlacement,
      context: barsFloatingContext,
    } = useFloating({
      open: isMenuBarVisible,
      onOpenChange: setMenuBarVisible,
      whileElementsMounted: autoUpdate,
      transform: true,
      middleware: [
        offset(manifest.isContainer ? { mainAxis: 8, crossAxis: 0 } : { mainAxis: 6, crossAxis: 0 }),
        autoPlacement({
          allowedPlacements,
        }),
      ],
    });

    const hover = useHover(barsFloatingContext, {
      handleClose: safePolygon(),
      delay: {
        open: 50,
        close: 200,
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

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const onBrickWrapperClick = useCallback(
      (e: MouseEvent<HTMLElement>) => {
        const brickTarget = e.currentTarget as HTMLElement;
        const target = e.target as HTMLElement;
        const group = target.closest<HTMLElement>("[data-brick-group]");

        if (group) {
          console.debug("onBrickWrapperClick: click ignored (group)");
          return;
        }

        if (hasMouseMoved.current || !brickTarget.matches("[data-brick]")) {
          return;
        }

        let selectedBrick = brick;

        // If has shift key pressed, then we try to select the upper container
        if (e.shiftKey) {
          if (parentBrick) {
            selectedBrick = parentBrick;
          }
        }

        //
        // Commented fow now, e.g don't auto move the panel
        //
        // If brick is on the left of the screen, we need to move the panel to the right, and vice versa
        // if (panelPosition === "right" && brickTarget.getBoundingClientRect().right > window.innerWidth / 2) {
        //   editorHelpers.togglePanelPosition();
        // } else if (
        //   panelPosition === "left" &&
        //   brickTarget.getBoundingClientRect().left < window.innerWidth / 2
        // ) {
        //   editorHelpers.togglePanelPosition();
        // }

        editorHelpers.setSelectedBrickId(selectedBrick.id);
        editorHelpers.setPanel("inspector");
        hasMouseMoved.current = false;

        // stop propagation otherwise the click could then be handled by the container
        e.stopPropagation();
      },
      [panelPosition],
    );

    return (
      <BrickContextMenu brick={brick} isContainerChild={isContainerChild}>
        <div
          // role="button"
          id={brick.id}
          data-brick
          data-brick-id={brick.id}
          data-brick-type={brick.type}
          data-element-kind={manifest.kind}
          data-last-touched={brick.props.lastTouched ?? "0"}
          data-dropzone={manifest.isContainer}
          {...(manifest.movable ? {} : { "data-no-drag": "true" })}
          className={tx(wrapperClass, `![animation-delay:${0.5 * (index + 1)}s]`)}
          ref={brickRef}
          onClick={onBrickWrapperClick}
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
    const manifest = useBrickManifest(brick.type);
    const visible =
      (show && manifest.isContainer && !selectedBrickId) ||
      (show && !manifest.isContainer && !isContainerChild) ||
      selectedBrickId === brick.id;
    // const visible = (show && brick.isContainer && !selectedBrickId) || selectedBrickId === brick.id;
    if (!visible && manifest.isContainer) {
      return null;
    }
    return (
      <div
        ref={ref}
        data-ui
        data-ui-menu-bars-container
        role="navigation"
        className={tx(
          "z-[99999] isolate text-base items-center gap-1",
          "transition-opacity duration-150 border rounded-lg",
          visible ? "opacity-100 flex" : "opacity-0 hidden",
          manifest.isContainer ? "border-orange-300" : "border-transparent",
        )}
        style={style}
        {...rest}
      >
        {/* container for main nav bar */}
        {/* <BrickMainNavBar brick={brick} /> */}
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
      className={tx("contents", menuNavBarCls, "!empty:hidden")}
      // className={tx("contents", menuNavBarCls, "!empty:hidden")}
    />
  );
}

function BrickMainNavBar({ brick }: { brick: Brick }) {
  const { deleteBrick } = useDraftHelpers();
  const manifest = manifests[brick.type];
  if (!manifest) {
    return null;
  }

  return (
    <nav className={tx(menuNavBarCls)} data-ui data-ui-options-bar>
      {/* <span className={tx(menuBarBtnCls, menuBarBtnCommonCls, "block capitalize pointer-events-none")}>
        {manifest.type}
      </span> */}

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
    </nav>
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
    const draftHelpers = useDraftHelpers();
    const editorHelpers = useEditorHelpers();
    const debugMode = useDebugMode();
    const manifest = useBrickManifest(brick.type);
    const canMoveLeft = isContainerChild ? draftHelpers.canMoveToWithinParent(brick.id, "left") : null;
    const canMoveRight = isContainerChild ? draftHelpers.canMoveToWithinParent(brick.id, "right") : null;
    const parentContainer = draftHelpers.getParentBrick(brick.id);

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
                  draftHelpers.duplicateBrick(brick.id);
                }}
              >
                Duplicate
              </ContextMenu.Item>
            )}

            <ContextMenu.Item
              shortcut="⌘C"
              onClick={(e) => {
                navigator.clipboard
                  .writeText(JSON.stringify(brick))
                  .then(() => {
                    toast("Brick copied to clipboard. You can paste it to another page.", {
                      duration: 4000,
                    });
                  })
                  .catch((err) => {
                    console.error("Failed to copy: ", err);
                    toast.error("Failed to copy brick to clipboard.", {
                      duration: 4000,
                    });
                  });
                e.stopPropagation();
              }}
            >
              Copy
            </ContextMenu.Item>
            {canMoveLeft && (
              <ContextMenu.Item
                shortcut="⌘&larr;"
                onClick={(e) => {
                  e.stopPropagation();
                  draftHelpers.moveBrickWithin(brick.id, "left");
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
                  draftHelpers.moveBrickWithin(brick.id, "right");
                }}
              >
                Move right
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
                        draftHelpers.deleteBrick(parentContainer.id);
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
                draftHelpers.deleteBrick(brick.id);
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
