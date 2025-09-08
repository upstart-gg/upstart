import type { Brick, Section } from "@upstart.gg/sdk/shared/bricks";
import {
  forwardRef,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  useEffect,
  useCallback,
  startTransition,
} from "react";
import {
  useDraggingBrickType,
  useEditorHelpers,
  useIsMouseOverPanel,
  usePanel,
  usePreviewMode,
  useSelectedBrickId,
} from "../hooks/use-editor";
import {
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
  Tooltip,
} from "@upstart.gg/style-system/system";
import BrickComponent from "~/shared/components/BrickComponent";
import { useBrickWrapperStyle } from "~/shared/hooks/use-brick-style";
import { useBrickManifest } from "~/shared/hooks/use-brick-manifest";
import { tx } from "@upstart.gg/style-system/twind";
import ResizeHandle from "./ResizeHandle";
import { manifests } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
import { getBrickResizeOptions } from "~/shared/utils/layout-utils";
import useIsHovered from "../hooks/use-is-hovered";
import { useDraftHelpers, usePageQueries, useSectionByBrickId } from "../hooks/use-page-data";
import { MdRepeat } from "react-icons/md";
import { useSortable } from "@dnd-kit/react/sortable";
import { pointerIntersection } from "@dnd-kit/collision";
import { RestrictToElement } from "@dnd-kit/dom/modifiers";
import { useCmdOrCtrlPressed } from "../hooks/use-key-pressed";
import { CollisionPriority } from "@dnd-kit/abstract";
import EditableBrickArrows from "./EditableBrickArrows";
import EditableBrickContextMenu from "./EditableBrickContextMenu";
import EditableBrickNavBar from "./EditableBrickNavBar";
import type { LoopSettings } from "@upstart.gg/sdk/shared/bricks/props/dynamic";
import { range } from "lodash-es";
import { useDragDropMonitor } from "@dnd-kit/react";

type BrickWrapperProps = ComponentProps<"div"> & {
  brick: Brick;
  isContainerChild?: boolean;
  index: number;
  iterationIndex?: number;
  // Nesting level of the brick
  level?: number;
  isDynamicPreview?: boolean;
};

function useBarPlacements(brick: Brick): Placement[] {
  // const previewMode = usePreviewMode();
  // const { isLastSection } = useDraftHelpers();
  // const section = useSection(brick.sectionId);
  // const manifest = useBrickManifest(brick.type);
  return ["bottom", "top"];
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

export function EditableBrickWrapperSimple({
  brick,
  index,
  level = 0,
  isDynamicPreview,
  iterationIndex,
}: BrickWrapperProps) {
  const hasMouseMoved = useRef(false);
  const selectedBrickId = useSelectedBrickId();
  const previewMode = usePreviewMode();
  const { panelPosition } = usePanel();
  const editorHelpers = useEditorHelpers();
  const { getParentBrick, updateBrickProps } = useDraftHelpers();
  const section = useSectionByBrickId(brick.id);
  const manifest = useBrickManifest(brick.type);
  const parentBrick = getParentBrick(brick.id);
  const [isMenuBarVisible, setMenuBarVisible] = useState(false);
  const allowedPlacements = useBarPlacements(brick);
  const draggingBrickType = useDraggingBrickType();
  const isMouseOverPanel = useIsMouseOverPanel();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isContainerChild = !!parentBrick;
  const cmdKeyPressed = useCmdOrCtrlPressed();

  const [globalDragging, setGlobalDragging] = useState(false);

  const isDragDisabled =
    !!isDynamicPreview ||
    isMouseOverPanel ||
    !manifest.movable ||
    isContainerChild ||
    !!brick.props.ghost ||
    previewMode === "mobile";

  useDragDropMonitor({
    onBeforeDragStart(event) {
      setGlobalDragging(true);
    },
    onDragEnd(event) {
      setTimeout(() => {
        setGlobalDragging(false);
      }, 200);
    },
  });

  const { isDragging, isDropping, isDropTarget, isDragSource } = useSortable({
    id: brick.id,
    index,
    element: wrapperRef,
    disabled: isDragDisabled,
    collisionPriority: CollisionPriority.Normal,
    collisionDetector: cmdKeyPressed ? pointerIntersection : undefined,
    type: "brick",
    accept: (source) => source.type === "brick" || source.type === "library",
    group: section?.id,
    data: { brick, parentBrick, section, manifest },
    transition: {
      duration: 250, // Animation duration in ms
      easing: "cubic-bezier(0.25, 1, 0.5, 1)", // Animation easing
      idle: true, // Whether to animate when no drag is in progress but its index changes
    },
    modifiers: [
      RestrictToElement.configure({
        element: (operation) => {
          if (isContainerChild) {
            return wrapperRef.current?.parentElement as HTMLElement;
          }
          return document.querySelector("#page-container");
        },
      }),
    ],
  });

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
    enabled: !isDynamicPreview,
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
      console.debug("EditableBrickWrapper: Click on brick", e, brick);
      const originalTarget = e.target as HTMLElement;
      const brickTarget = e.currentTarget as HTMLElement | null;

      if (
        hasMouseMoved.current ||
        (!brickTarget?.matches("[data-element-kind='brick']") &&
          !originalTarget?.matches("[data-element-kind='brick']")) ||
        (e.defaultPrevented && !originalTarget.closest('[data-prevented-by-editor="true"]'))
      ) {
        console.debug(
          "EditableBrickWrapper: Click ignored due to mouse movement or default prevented",
          originalTarget,
          e,
        );
        return;
      }

      if (manifest.isGlobalBrick) {
        console.log("GLOBAL BRICK CLIKED");
        editorHelpers.setPanel("settings");
        editorHelpers.setAttributesGroup(manifest.type);
        editorHelpers.setAttributesTab("site");
        return;
      }

      let selectedElement: Brick | Section = brick;
      let elementType: "brick" | "section" = "brick";
      // If has shift key pressed, then we try to select the upper container
      if (e.shiftKey) {
        if (parentBrick) {
          console.log("Selecting parent brick", parentBrick);
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
          console.log("Selecting brick", selectedElement);
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

  // Merge all refs properly to avoid render loops
  const mergedRef = useMergeRefs([barsRefs.setReference, wrapperRef, hoverRef]);
  const resizeOpts = getBrickResizeOptions(manifests[brick.type]);

  // if (dynamicPreview && globalDragging) {
  //   return null;
  // }

  return (
    <EditableBrickContextMenu brick={brick} isContainerChild={isContainerChild}>
      <div
        ref={mergedRef}
        {...getReferenceProps()}
        id={brick.id}
        data-element-kind="brick"
        data-brick-id={brick.id}
        data-brick-type={brick.type}
        data-last-touched={brick.props.lastTouched ?? "0"}
        data-is-container={manifest.isContainer}
        data-is-container-child={isContainerChild}
        data-dragging={isDragging}
        data-level={level}
        data-index={index}
        data-brick-width={brick.props.width}
        data-brick-height={brick.props.height}
        data-brick-max-width={JSON.stringify(manifest.maxWidth)}
        data-brick-min-width={JSON.stringify(manifest.minWidth)}
        className={tx(
          wrapperClass,
          isDynamicPreview &&
            "hover:(opacity-40 grayscale) group-hover/section:(opacity-40 grayscale pointer-events-none)",
          isDragging ? "!z-[9999] !shadow-2xl overflow-hidden !cursor-grabbing" : "hover:cursor-auto",
          isDynamicPreview && globalDragging && "scale-0",
          !!brick.props.ghost && "opacity-50 pointer-events-none grayscale bg-white",
        )}
        onClick={onBrickWrapperClick}
      >
        <BrickComponent
          brick={brick}
          iterationIndex={iterationIndex}
          isDynamicPreview={isDynamicPreview}
          editable
        />
        <FloatingPortal>
          <EditableBrickNavBar
            ref={barsRefs.setFloating}
            brick={brick}
            isContainerChild={isContainerChild}
            style={barsFloatingStyles}
            show={isMenuBarVisible}
            {...getFloatingProps()}
          />
        </FloatingPortal>
        {/* Resize Handles */}
        {manifests[brick.type]?.resizable &&
          !draggingBrickType &&
          !isDragging &&
          !isDynamicPreview &&
          selectedBrickId === brick.id && (
            <>
              {(resizeOpts.canGrowVertical || resizeOpts.canShrinkVertical) && (
                <>
                  <ResizeHandle direction="s" show={isHovered} manifest={manifest} />
                  <ResizeHandle direction="n" show={isHovered} manifest={manifest} />
                </>
              )}
              {(resizeOpts.canGrowHorizontal || resizeOpts.canShrinkHorizontal) && (
                <>
                  <ResizeHandle direction="w" show={isHovered} manifest={manifest} />
                  <ResizeHandle direction="e" show={isHovered} manifest={manifest} />
                </>
              )}
              {((resizeOpts.canGrowVertical && resizeOpts.canGrowHorizontal) ||
                (resizeOpts.canShrinkVertical && resizeOpts.canShrinkHorizontal)) && (
                <>
                  <ResizeHandle direction="se" show={isHovered} manifest={manifest} />
                  <ResizeHandle direction="sw" show={isHovered} manifest={manifest} />
                  <ResizeHandle direction="ne" show={isHovered} manifest={manifest} />
                  <ResizeHandle direction="nw" show={isHovered} manifest={manifest} />
                </>
              )}
            </>
          )}

        {previewMode === "desktop" && !isDynamicPreview && brick.id === selectedBrickId && (
          <EditableBrickArrows brick={brick} />
        )}
        {typeof brick.props.loop !== "undefined" && !isDynamicPreview && (
          <Tooltip content="This brick will be repeated for each item in the query result">
            <div
              className={tx(
                `group-hover/brick:opacity-100 absolute cursor-help -top-[12px] -right-[12px] z-[99999] w-5 h-5 rounded-full
            flex items-center justify-center text-upstart-500 group/dyn-helper bg-white/90 shadow border border-upstart-500`,
                brick.id === selectedBrickId ? "opacity-100" : "opacity-0",
              )}
            >
              <MdRepeat className="w-3 h-3" />
            </div>
          </Tooltip>
        )}

        {manifest.isContainer && !isDragging && isDropTarget && cmdKeyPressed && !isDragSource && (
          <div
            className={tx(
              "absolute inset-0 z-auto flex items-center justify-center bg-black/30 font-bold text-white rounded",
            )}
          >
            <span className="inline-flex rounded-full px-4 py-2 bg-black/50">Drop in box</span>
          </div>
        )}
      </div>
    </EditableBrickContextMenu>
  );
}

export default function EditableBrickWrapper(props: BrickWrapperProps) {
  const {
    brick: { props: brickProps, type },
  } = props;
  const pageQueries = usePageQueries();
  const manifest = useBrickManifest(type);
  const loop = brickProps.loop as LoopSettings | undefined;

  if (!loop?.over || manifest.consumesMultipleQueryRows) {
    return <EditableBrickWrapperSimple {...props} />;
  }

  const loopQuery = pageQueries.find((q) => q.alias === loop?.over);
  const limit = Math.min(loop.overrideLimit ?? Infinity, loopQuery?.queryInfo.limit ?? 1, 3);
  const { brick, ...rest } = props;

  return (
    <>
      {range(0, limit).map((i, index) => (
        <EditableBrickWrapperSimple
          key={i}
          {...rest}
          iterationIndex={index}
          isDynamicPreview={index > 0}
          brick={{
            ...brick,
            id: index > 0 ? `${brick.id}-${index}` : brick.id,
          }}
        />
      ))}
    </>
  );
}
