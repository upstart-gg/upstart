import { css } from "@emotion/css";
import { LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import { getStyleProperties } from "@upstart.gg/sdk/shared/bricks/props/helpers";
import { brickStylesHelpersMap, brickWrapperStylesHelpersMap } from "../styles/helpers";
import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { debounce, get, merge } from "lodash-es";
import { useBrickManifest } from "./use-brick-manifest";
import { getTextContrastedColor } from "@upstart.gg/sdk/shared/themes/color-system";
import { useEffect } from "react";
import { useGetBrick } from "~/editor/hooks/use-editor";
import { defaultProps } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
import clsx from "clsx";

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
  const mergedProps = merge({}, props, defaultProps[brick.type].props);
  const helpers = type === "brick" ? brickStylesHelpersMap : brickWrapperStylesHelpersMap;
  const classes = Object.entries(stylesProps).reduce(
    (acc, [path, styleId]) => {
      const helper = helpers[styleId as keyof typeof helpers];
      const part = extractStylePath(path);
      acc[part] = acc[part] ?? [];
      acc[part].push(
        // @ts-expect-error
        clsx(helper?.(get(mergedProps, path), get(mobileProps, path))),
      );
      return acc;
    },
    {} as Record<string, string[]>,
  );
  if (brick.type === "text" && type === "wrapper") {
    // console.log("getClassesFromStyleProps", { mergedProps, stylesProps });
    // console.log("getClassesFromStyleProps text", classes);
  }
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
            el.style.setProperty("--up-color-auto", `${chosenColor}`);
          });
        }
      }
    }
  }, 800);

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

export function useColorsPreprocessing<T extends BrickManifest>({ brick }: BrickProps<T>) {
  const manifest = useBrickManifest(brick.type);
  const stylesProps = getStyleProperties(manifest.props);
  usePreprocessTextColors(brick, stylesProps);
}

export function useBrickWrapperStyle<T extends BrickManifest>({ brick, editable, selected }: BrickProps<T>) {
  const { props } = brick;
  const isContainerChild = brick.parentId !== undefined;
  const manifest = useBrickManifest(brick.type);
  const stylesProps = getStyleProperties(manifest.props);
  const styleIds = Object.values(stylesProps);
  const classes = getClassesFromStyleProps(stylesProps, brick, "wrapper");

  return clsx(
    props.className as string,
    // no transition otherwise it will slow down the drag
    "brick-wrapper group/brick flex flex-1",
    styleIds.includes("#styles:fixedPositioned") === false && "relative",
    styleIds.includes("#styles:fixedPositioned") &&
      // css({
      //   height: `${position.desktop.h * LAYOUT_ROW_HEIGHT}px`,
      //   maxHeight: `${position.desktop.h * LAYOUT_ROW_HEIGHT}px`,
      // }),

      // container children expand to fill the space
      isContainerChild &&
      "container-child",

    getBrickWrapperEditorStyles(editable === true, !!brick.isContainer, isContainerChild, selected),

    // Position of the wrapper
    //
    // Note:  for container children, we don't set it as they are NOT positioned
    //        relatively to the page grid but to the container
    //
    // Warning: those 2 rules blocks are pretty sensible, especially the height!
    // !isContainerChild &&
    //   `@desktop:(
    //     col-start-${position.desktop.x + 1}
    //     col-span-${position.desktop.w}
    //     row-start-${position.desktop.y + 1}
    //     h-fit
    //     min-h-[${position.desktop.h * LAYOUT_ROW_HEIGHT}px]
    //     max-h-fit
    //   )
    //   @mobile:(
    //     col-start-${position.mobile.x + 1}
    //     col-span-${position.mobile.w}
    //     row-start-${position.mobile.y + 1}
    //     h-fit
    //     min-h-[${position.mobile.h * LAYOUT_ROW_HEIGHT}px]
    //     max-h-fit
    //   )`,
    // ${position.mobile.manualHeight ? `h-[${position.mobile.manualHeight * LAYOUT_ROW_HEIGHT}px]` : ""}

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
    "select-none transition-colors delay-300 duration-300",
    "outline outline-2 outline-transparent -outline-offset-1",
    selected && !isContainer && "!outline-upstart-500 shadow-lg shadow-upstart-500/20",
    selected && isContainer && "!outline-orange-300 shadow-lg shadow-orange-300/20",
    !selected && !isContainerChild && !isContainer && "hover:(outline-upstart-500/60)",
    !selected && !isContainerChild && isContainer && "hover:(outline-dotted outline-orange-500/30)",
    !selected && isContainerChild && "hover:(outline-upstart-500/40)",
    css({
      "&.selected-group": {
        outlineColor: "var(--violet-8) !important",
      },
      "& [data-brick-group]:hover": {
        outline: "1px dashed var(--violet-8)",
        opacity: 0.85,
      },
      "&.moving [data-ui]": {
        display: "none",
      },
    }),
  ];
}
