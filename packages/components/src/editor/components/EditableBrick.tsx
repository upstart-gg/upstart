import type { Brick, Section } from "@upstart.gg/sdk/shared/bricks";
import {
  forwardRef,
  type PropsWithChildren,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  useEffect,
  useCallback,
  startTransition,
  type CSSProperties,
} from "react";
import {
  useContextMenuVisible,
  useDebugMode,
  useDraftHelpers,
  useDraggingBrickType,
  useEditorHelpers,
  useIsMouseOverPanel,
  usePanel,
  usePreviewMode,
  useSectionByBrickId,
  useSelectedBrickId,
} from "../hooks/use-editor";
import {
  ContextMenu,
  Portal,
  useFloating,
  useMergeRefs,
  autoPlacement,
  offset,
  useHover,
  useInteractions,
  safePolygon,
  autoUpdate,
  type Placement,
  FloatingPortal,
} from "@upstart.gg/style-system/system";
import BaseBrick from "~/shared/components/BaseBrick";
import { normalizeSchemaEnum } from "@upstart.gg/sdk/shared/utils/schema";
import { useBrickWrapperStyle } from "~/shared/hooks/use-brick-style";
import { menuNavBarCls } from "~/shared/styles/menubar-styles";
import { useBrickManifest } from "~/shared/hooks/use-brick-manifest";
import { tx } from "@upstart.gg/style-system/twind";
import { Draggable, type DraggableStateSnapshot } from "@hello-pangea/dnd";
import ResizeHandle from "./ResizeHandle";
import { manifests } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
import { commonProps } from "@upstart.gg/sdk/shared/bricks/props/common";
import { getBrickResizeOptions } from "~/shared/utils/layout-utils";
import useIsHovered from "../hooks/use-is-hovered";

type BrickWrapperProps = ComponentProps<"div"> & {
  brick: Brick;
  isContainerChild?: boolean;
  index: number;
};

function getDropAnimationStyle(
  currentSection?: string,
  style?: CSSProperties,
  snapshot?: DraggableStateSnapshot,
) {
  if (!snapshot?.isDropAnimating || !snapshot.dropAnimation) {
    return style;
  }

  const { draggingOver } = snapshot;
  const { moveTo } = snapshot.dropAnimation;

  if (draggingOver === currentSection) {
    const translate = `translate(${moveTo.x}px, 0px)`;
    return {
      ...style,
      transform: `${translate}`,
    };
  }
  //else {
  //   const translate = `translate(0px, ${moveTo.y}px)`;
  //   return {
  //     ...style,
  //     transform: `${translate}`,
  //   };
  // }
  return {
    ...style,
  };
}

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
    const section = useSectionByBrickId(brick.id);
    const manifest = useBrickManifest(brick.type);
    const parentBrick = getParentBrick(brick.id);
    const [isMenuBarVisible, setMenuBarVisible] = useState(false);
    const allowedPlacements = useBarPlacements(brick);
    const draggingBrickType = useDraggingBrickType();
    const isMouseOverPanel = useIsMouseOverPanel();

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
        const originalTarget = e.target as HTMLElement;
        const brickTarget = e.currentTarget as HTMLElement;
        if (
          hasMouseMoved.current ||
          !brickTarget.matches("[data-brick]") ||
          (e.defaultPrevented && !originalTarget.closest('[data-prevented-by-editor="true"]'))
        ) {
          console.log(
            "EditableBrickWrapper: Click ignored due to mouse movement or default prevented",
            originalTarget,
          );
          return;
        }
        let selectedElement: Brick | Section = brick;
        let elementType: "brick" | "section" = "brick";
        // If has shift key pressed, then we try to select the upper container
        if (e.shiftKey) {
          if (parentBrick) {
            selectedElement = parentBrick;
          }
        } else if ((e.ctrlKey || e.metaKey) && section) {
          elementType = "section";
          selectedElement = section;
        }

        editorHelpers.hidePanel();

        // Check if the brick covers the first 10% of the viewport width
        if (panelPosition === "left" && e.clientX < window.innerWidth * 0.25) {
          // If so, we open the inspector panel
          editorHelpers.togglePanelPosition();
        } else if (panelPosition === "right" && e.clientX > window.innerWidth * 0.75) {
          // If so, we open the inspector panel
          editorHelpers.togglePanelPosition();
        }

        startTransition(() => {
          if (elementType === "section") {
            editorHelpers.setSelectedSectionId(selectedElement.id);
          } else {
            editorHelpers.setSelectedBrickId(selectedElement.id);
          }
          editorHelpers.setPanel("inspector");
        });

        hasMouseMoved.current = false;
        // stop propagation otherwise the click could then be handled by the container
        e.stopPropagation();
      },
      [panelPosition],
    );

    const { ref: hoverRef, isHovered } = useIsHovered({ tolerance: 6, deepCheck: true });
    const wrapperClass = useBrickWrapperStyle({
      brick,
      editable: true,
      selected: selectedBrickId === brick.id,
      isContainerChild,
    });

    const isDragDisabled =
      isMouseOverPanel || !manifest.movable || isContainerChild || previewMode === "mobile";

    return (
      <Draggable key={brick.id} draggableId={brick.id} index={index} isDragDisabled={isDragDisabled}>
        {(provided, snapshot) => {
          // Merge all refs properly to avoid render loops
          const mergedRef = useMergeRefs([provided.innerRef, barsRefs.setReference, ref, hoverRef]);
          const resizeOpts = getBrickResizeOptions(manifests[brick.type]);

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
                data-last-touched={brick.props.lastTouched ?? "0"}
                data-container-child={isContainerChild}
                data-draggable-for-brick-id={brick.id}
                data-brick-width={brick.props.width}
                data-brick-height={brick.props.height}
                data-brick-max-width={JSON.stringify(manifest.maxWidth)}
                data-brick-min-width={JSON.stringify(manifest.minWidth)}
                style={getDropAnimationStyle(section?.id, provided.draggableProps.style, snapshot)}
                className={tx(
                  wrapperClass,
                  snapshot.isDragging
                    ? "opacity-90 !z-[9999] shadow-xl overflow-hidden !cursor-grabbing"
                    : "hover:cursor-auto",
                )}
                onClick={onBrickWrapperClick}
              >
                <BaseBrick brick={brick} selectedBrickId={selectedBrickId} editable />
                {!manifest.isContainer && <BrickDebugLabel brick={brick} />}
                <FloatingPortal>
                  <BrickMenuBarsContainer
                    ref={barsRefs.setFloating}
                    brick={brick}
                    isContainerChild={isContainerChild}
                    style={barsFloatingStyles}
                    show={isMenuBarVisible}
                    {...getFloatingProps()}
                  />
                </FloatingPortal>
                {/* Children contains resizable handles and other elements */}
                {manifests[brick.type]?.resizable &&
                  !isContainerChild &&
                  !draggingBrickType &&
                  !snapshot.isDragging && (
                    <>
                      {(resizeOpts.canGrowVertical || resizeOpts.canShrinkVertical) && (
                        <>
                          <ResizeHandle direction="s" show={isHovered} manifest={manifest} />
                          <ResizeHandle direction="n" show={isHovered} manifest={manifest} />
                        </>
                      )}
                      {(resizeOpts.canGrowHorizontal || resizeOpts.canShrinkHorizontal) &&
                        previewMode === "desktop" && (
                          <>
                            <ResizeHandle direction="w" show={isHovered} manifest={manifest} />
                            <ResizeHandle direction="e" show={isHovered} manifest={manifest} />
                          </>
                        )}
                      {((resizeOpts.canGrowVertical && resizeOpts.canGrowHorizontal) ||
                        (resizeOpts.canShrinkVertical && resizeOpts.canShrinkHorizontal)) &&
                        previewMode === "desktop" && (
                          <>
                            <ResizeHandle direction="se" show={isHovered} manifest={manifest} />
                            <ResizeHandle direction="sw" show={isHovered} manifest={manifest} />
                            <ResizeHandle direction="ne" show={isHovered} manifest={manifest} />
                            <ResizeHandle direction="nw" show={isHovered} manifest={manifest} />
                          </>
                        )}
                    </>
                  )}
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
    const contextMenuVisible = useContextMenuVisible();
    const visible =
      (show && manifest.isContainer && !selectedBrickId) ||
      (show && !manifest.isContainer && !isContainerChild) ||
      selectedBrickId === brick.id;
    // const visible = (show && brick.isContainer && !selectedBrickId) || selectedBrickId === brick.id;
    if (!visible || contextMenuVisible) {
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
    const canMovePrev = draftHelpers.canMoveToWithinParent(brick.id, "previous");
    const canMoveNext = draftHelpers.canMoveToWithinParent(brick.id, "next");
    const parentContainer = draftHelpers.getParentBrick(brick.id);

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

            {/* <ContextMenu.Item
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
            </ContextMenu.Item> */}
            {canMovePrev && (
              <ContextMenu.Item
                shortcut={isContainerChild ? "⌘↑" : "⌘←"}
                onClick={(e) => {
                  e.stopPropagation();
                  draftHelpers.moveBrickWithin(brick.id, "previous");
                }}
              >
                {isContainerChild ? "Move up" : "Move left"}
              </ContextMenu.Item>
            )}
            {canMoveNext && (
              <ContextMenu.Item
                shortcut={isContainerChild ? "⌘↓" : "⌘→"}
                onClick={(e) => {
                  e.stopPropagation();
                  draftHelpers.moveBrickWithin(brick.id, "next");
                }}
              >
                {isContainerChild ? "Move down" : "Move right"}
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
            {!isContainerChild && (
              <ContextMenu.CheckboxItem
                checked={brick.props.growHorizontally}
                onCheckedChange={(newVal) => {
                  // e.stopPropagation();
                  draftHelpers.updateBrickProps(brick.id, {
                    growHorizontally: newVal,
                  });
                }}
              >
                Grow horizontally
              </ContextMenu.CheckboxItem>
            )}
            {!isContainerChild && (
              <ContextMenu.Sub>
                <ContextMenu.SubTrigger>Vertical Position</ContextMenu.SubTrigger>
                <ContextMenu.SubContent>
                  <ContextMenu.RadioGroup
                    value={brick.props.alignSelf}
                    onValueChange={(value) => {
                      draftHelpers.updateBrickProps(brick.id, {
                        alignSelf: value,
                      });
                    }}
                  >
                    {Object.entries(normalizeSchemaEnum(commonProps.alignSelf)).map(([key, value]) => (
                      <ContextMenu.RadioItem
                        key={key}
                        value={value.const}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {value.title}
                      </ContextMenu.RadioItem>
                    ))}
                  </ContextMenu.RadioGroup>
                </ContextMenu.SubContent>
              </ContextMenu.Sub>
            )}

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
