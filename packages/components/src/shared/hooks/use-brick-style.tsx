import { tx, apply, css } from "@upstart.gg/style-system/twind";
import { LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import { getStyleProperties } from "@upstart.gg/sdk/shared/bricks/props/helpers";
import { brickStylesHelpersMap, brickWrapperStylesHelpersMap } from "../styles/helpers";
import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { debounce, get } from "lodash-es";
import { useBrickManifest } from "./use-brick-manifest";
import { getTextContrastedColor } from "@upstart.gg/sdk/shared/themes/color-system";
import { useEffect } from "react";
import { useGetBrick } from "~/editor/hooks/use-editor";

// Return the upper path without the last part (the property name)
function extractStylePath(path: string) {
  if (!path.includes(".")) {
    return path;
  }
  return path.split(".").slice(0, -1).join(".");
}

function getClassesFromStyleProps<T extends BrickManifest>(
  stylesProps: Record<string, string>,
  brick: BrickProps<T>["brick"],
  type: "brick" | "wrapper",
) {
  const { props, mobileProps } = brick;
  const helpers = type === "brick" ? brickStylesHelpersMap : brickWrapperStylesHelpersMap;
  const classes = Object.entries(stylesProps).reduce(
    (acc, [path, styleId]) => {
      const helper = helpers[styleId as keyof typeof helpers];
      const part = extractStylePath(path);
      acc[part] = acc[part] ?? [];
      acc[part].push(
        // @ts-expect-error
        tx(helper?.(get(props, path), get(mobileProps, path))),
      );
      return acc;
    },
    {} as Record<string, string[]>,
  );
  return classes;
}

function usePreprocessTextColors<T extends BrickManifest>(
  brick: BrickProps<T>["brick"],
  stylesProps: ReturnType<typeof getStyleProperties>,
) {
  const getBrickInfo = useGetBrick();
  const brickInfo = getBrickInfo(brick.id);
  const onChange = debounce(function process() {
    const { props } = brick;
    for (const [path, styleId] of Object.entries(stylesProps)) {
      if (styleId === "#styles:color") {
        const value = get(props, path);
        if (value === "color-auto") {
          const selector = `#${brick.id}.color-auto, #${brick.id} .color-auto`;
          const elements = document.querySelectorAll<HTMLElement>(selector);
          if (!elements.length) {
            console.warn("No elements found for selector %s", selector);
          }
          elements.forEach((el) => {
            const chosenColor = getTextContrastedColor(el);
            el.style.setProperty("--color-auto", `${chosenColor}`);
          });
        }
      }
    }
  }, 300);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(onChange, [brickInfo]);
}

/**
 * The classNames for the brick
 */
export function useBrickStyle<T extends BrickManifest>(brick: BrickProps<T>["brick"]) {
  const manifest = useBrickManifest(brick.type);
  const stylesProps = getStyleProperties(manifest.props);
  return getClassesFromStyleProps(stylesProps, brick, "brick");
}

export function useBrickWrapperStyle<T extends BrickManifest>({ brick, editable, selected }: BrickProps<T>) {
  const { props, position } = brick;
  const isContainerChild = brick.parentId !== undefined;
  const manifest = useBrickManifest(brick.type);
  const stylesProps = getStyleProperties(manifest.props);
  usePreprocessTextColors(brick, stylesProps);
  const styleIds = Object.values(stylesProps);
  const classes = getClassesFromStyleProps(stylesProps, brick, "wrapper");

  return tx(
    apply(props.className as string),
    // no transition otherwise it will slow down the drag
    "brick group/brick flex",
    styleIds.includes("#styles:fixedPositioned") === false && "relative",

    // container children expand to fill the space
    isContainerChild && "container-child flex-1",

    getBrickWrapperEditorStyles(editable === true, !!brick.isContainer, isContainerChild, selected),

    // Position of the wrapper
    //
    // Note:  for container children, we don't set it as they are not positioned
    //        relatively to the page grid but to the container
    //
    // Warning: those 2 rules blocks are pretty sensible!
    !isContainerChild &&
      `@desktop:(
        col-start-${position.desktop.x + 1}
        col-span-${position.desktop.w}
        row-start-${position.desktop.y + 1}
        row-span-${position.desktop.h}
        h-auto
      )
      @mobile:(
        col-start-${position.mobile.x + 1}
        col-span-${position.mobile.w}
        row-start-${position.mobile.y + 1}
        row-span-${position.mobile.manualHeight ?? position.mobile.h}
        ${position.mobile.manualHeight ? `h-[${position.mobile.manualHeight * LAYOUT_ROW_HEIGHT}px]` : ""}
      )`,

    ...Object.values(classes).flat(),

    // getFlexStyles(props as BrickStyleProps),
    // getBasicAlignmentStyles(props as BrickStyleProps),
  );
}

function getBrickWrapperEditorStyles(
  editable: boolean,
  isContainer: boolean,
  isContainerChild: boolean,
  selected?: boolean,
) {
  if (!editable) {
    return null;
  }
  return [
    "select-none hover:z-[9999] transition-colors delay-300 duration-300 rounded-sm outline outline-2 outline-transparent -outline-offset-1",
    selected && "outline-upstart-500 shadow-lg shadow-upstart-500/20",
    !selected && !isContainerChild && !isContainer && "hover:(outline-upstart-500/60)",
    !selected && !isContainerChild && isContainer && "hover:(outline-dotted outline-upstart-500/30)",
    !selected && isContainerChild && "hover:(outline-upstart-500/40)",
    css({
      "&.selected-group": {
        outline: "2px dotted var(--violet-8) !important",
      },
      "& [data-brick-part]:hover": {
        outline: "1px dashed var(--violet-8)",
      },
    }),
  ];
}
