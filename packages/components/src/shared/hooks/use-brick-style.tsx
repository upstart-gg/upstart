import { getStyleProperties } from "@upstart.gg/sdk/shared/bricks/props/helpers";
import { brickStylesHelpersMap, brickWrapperStylesHelpersMap, extractStylePath } from "../styles/helpers";
import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { debounce, get, merge } from "lodash-es";
import { useBrickManifest } from "./use-brick-manifest";
import { defaultProps } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
import { tx, css } from "@upstart.gg/style-system/twind";

function getClassesFromStyleProps<T extends BrickManifest>(
  stylesProps: Record<string, string>,
  brick: BrickProps<T>["brick"],
  type: "brick" | "wrapper",
) {
  const { props, mobileProps } = brick;
  const mergedProps = merge({}, defaultProps[brick.type].props, props);
  const helpers = type === "brick" ? brickStylesHelpersMap : brickWrapperStylesHelpersMap;
  const classes = Object.entries(stylesProps).reduce(
    (acc, [path, styleId]) => {
      const helper = helpers[styleId as keyof typeof helpers];
      if (!helper) {
        // console.warn(`No helper found for styleId: ${styleId} in path: ${path} for type: ${type}`);
        return acc;
      }
      const part = extractStylePath(path);
      acc[part] = acc[part] ?? [];

      const resolvedProps = get(mergedProps, path);
      const resolvedMobileProps = get(mobileProps, path);
      acc[part].push(
        // @ts-expect-error
        tx(helper?.(resolvedProps, resolvedMobileProps)),
      );
      return acc;
    },
    {} as Record<string, string[]>,
  );
  return classes;
}

/**
 * The classNames for the brick
 */
export function useBrickStyle<T extends BrickManifest>(brick: BrickProps<T>["brick"]) {
  const manifest = useBrickManifest(brick.type);
  const stylesProps = getStyleProperties(manifest.props);
  return getClassesFromStyleProps(stylesProps, brick, "brick");
}

/**
 * Styles for the wrapper of the brick.
 * IMPORTANT: do not add any transitions or animations here, as it will affect the drag-and-drop experience.
 */
export function useBrickWrapperStyle<T extends BrickManifest>({
  brick,
  editable,
  selected,
  isContainerChild = false,
}: BrickProps<T>) {
  const { props } = brick;
  const manifest = useBrickManifest(brick.type);
  const stylesProps = getStyleProperties(manifest.props);
  const styleIds = Object.values(stylesProps);
  const classes = getClassesFromStyleProps(stylesProps, brick, "wrapper");

  return tx(
    manifest.staticClasses,
    props.className as string,
    props.preset as string,
    "brick-wrapper group/brick flex",

    manifest.minWidth &&
      `@mobile:min-w-[${manifest.minWidth.mobile}px] @desktop:min-w-[${manifest.minWidth.desktop}px]`,
    manifest.minHeight &&
      `@mobile:min-h-[${manifest.minHeight.mobile}px] @desktop:min-h-[${manifest.minHeight.desktop}px]`,
    manifest.maxWidth &&
      `@mobile:max-w-[${manifest.maxWidth.mobile}px] @desktop:max-w-[${manifest.maxWidth.desktop}px]`,
    manifest.maxHeight &&
      `@mobile:max-h-[${manifest.maxHeight.mobile}px] @desktop:max-h-[${manifest.maxHeight.desktop}px]`,

    typeof props.width !== "undefined" &&
      css({
        width: `${props.width}`,
      }),

    typeof props.height !== "undefined" &&
      css({
        height: `${props.height}`,
      }),

    styleIds.includes("styles:fixedPositioned") === false && "relative",

    // container children expand to fill the space
    isContainerChild && "container-child",

    getBrickWrapperEditorStyles(editable === true, manifest.isContainer, isContainerChild, selected),

    ...Object.values(classes).flat(),
  );
}

function getBrickWrapperEditorStyles(
  editable: boolean,
  isContainer: boolean,
  isContainerChild: boolean,
  selected?: boolean,
  modKeyPressed?: boolean,
) {
  if (!editable) {
    return null;
  }
  return [
    "select-none transition-colors delay-100 duration-200",
    "outline outline-transparent",
    selected && !isContainer && "!outline-upstart-400 shadow-xl shadow-upstart-500/20",
    selected && isContainer && "!outline-orange-300 shadow-xl",
    !selected && !isContainerChild && !isContainer && "hover:(outline-upstart-400/60)",
    !selected && !isContainerChild && isContainer && "hover:(outline-orange-300/20)",
    !selected &&
      isContainerChild &&
      "hover:(outline-upstart-400/60) group-hover/brick:(outline-upstart-400/60)",
    css({
      "&.selected-group": {
        outlineColor: "var(--violet-8) !important",
      },
      "& [data-brick-group]:hover": {
        outline: "1px dashed var(--violet-8)",
        opacity: 0.85,
      },
      // This is the class of the drag element original emplacement
      "&.moving": {
        backgroundColor: "var(--gray-a6)",
      },
      // Hide all content when dragging
      "&.moving > *": {
        visibility: "hidden",
      },
      // Hide any UI children elements when dragging
      "&.moving [data-ui]": {
        display: "none",
      },
    }),
  ];
}
