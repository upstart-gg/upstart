import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import {
  forwardRef,
  type PropsWithChildren,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  useEffect,
  useCallback,
  Fragment,
} from "react";
import {
  useDebugMode,
  useDraftHelpers,
  useEditorHelpers,
  useGridConfig,
  usePanel,
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
  toast,
  useHover,
  useInteractions,
  safePolygon,
  autoUpdate,
  type Placement,
} from "@upstart.gg/style-system/system";
import BaseBrick from "~/shared/components/BaseBrick";
import { useBrickWrapperStyle } from "~/shared/hooks/use-brick-style";
import {
  menuBarBtnCls,
  menuBarBtnCommonCls,
  menuBarBtnSquareCls,
  menuNavBarCls,
} from "~/shared/styles/menubar-styles";
import { manifests } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
import { useBrickManifest } from "~/shared/hooks/use-brick-manifest";
import { FiSettings, FiDatabase } from "react-icons/fi";
import { tx } from "@upstart.gg/style-system/twind";
import { Draggable } from "@hello-pangea/dnd";
import { Resizable, type ResizeCallback } from "re-resizable";
import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import ResizeHandle from "./ResizeHandle";

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
    const gridConfig = useGridConfig();
    const draftHelpers = useDraftHelpers();
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

    const wrapperClass = useBrickWrapperStyle({
      brick,
      editable: true,
      selected: selectedBrickId === brick.id,
      isContainerChild,
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

        editorHelpers.setSelectedBrickId(selectedBrick.id);
        editorHelpers.setPanel("inspector");
        hasMouseMoved.current = false;
        // stop propagation otherwise the click could then be handled by the container
        e.stopPropagation();
      },
      [panelPosition],
    );

    const handleResize: ResizeCallback = (event, direction, ref, delta) => {
      // Handle resize logic here if needed during resize
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const handleResizeStop: ResizeCallback = useCallback(
      (event, direction, ref, delta) => {
        //
        console.log("resize stop", brick.id, direction, ref, delta, gridConfig);

        if (!gridConfig) {
          console.warn("Grid config is not available, cannot resize properly.");
          return;
        }

        // Compute new width and height based on the grid config
        const newWidth = Math.round(ref.offsetWidth / gridConfig.colWidth);
        const newHeight = Math.round(ref.offsetHeight / gridConfig.rowHeight);

        draftHelpers.updateBrickProps(brick.id, {
          widthInColUnits: newWidth,
          heightInRowUnits: newHeight,
        });

        // Auto-adjust mobile layout if needed
        if (previewMode === "desktop") {
          draftHelpers.adjustMobileLayout();
        }
      },
      [brick.id, previewMode, gridConfig],
    );

    return (
      <Draggable draggableId={brick.id} index={index} isDragDisabled={!manifest.movable}>
        {(provided, snapshot) => {
          // Merge all refs properly to avoid render loops
          const mergedRef = useMergeRefs([provided.innerRef, barsRefs.setReference, ref]);

          return (
            <BrickContextMenu brick={brick} isContainerChild={isContainerChild}>
              <div
                ref={mergedRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                {...getReferenceProps()}
                id={brick.id}
                data-brick
                data-brick-id={brick.id}
                data-brick-type={brick.type}
                data-element-kind={manifest.kind}
                data-last-touched={brick.props.lastTouched ?? "0"}
                data-dropzone={manifest.isContainer}
                data-draggable-for-brick-id={brick.id}
                className={tx(
                  wrapperClass,
                  "relative origin-center min-w-[100px] bg-orange-600",
                  snapshot.isDragging &&
                    "opacity-80 !z-[9999] shadow-xl bg-upstart-600/30 rounded-2xl scale-90 overflow-hidden",
                )}
                onClick={onBrickWrapperClick}
              >
                <BaseBrick brick={brick} selectedBrickId={selectedBrickId} editable />
                {!manifest.isContainer && <BrickDebugLabel brick={brick} />}
                <BrickMenuBarsContainer
                  ref={barsRefs.setFloating}
                  brick={brick}
                  isContainerChild={isContainerChild}
                  style={barsFloatingStyles}
                  show={isMenuBarVisible}
                  {...getFloatingProps()}
                />
                {!snapshot.isDragging && children}
                {/* Children contains resizable handles and other elements */}
              </div>
            </BrickContextMenu>
          );
        }}
      </Draggable>
    );
  },
);

function BrickDebugLabel({ brick }: { brick: Brick }) {
  const debug = useDebugMode();
  if (!debug) {
    return null;
  }
  return (
    <div className="absolute hidden group-hover/brick:block bottom-1 right-1 text-xs text-black/40">
      {brick.id}
    </div>
  );
}

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
