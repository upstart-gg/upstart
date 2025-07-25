import { brickStylesHelpersMap, brickWrapperStylesHelpersMap, extractStylePath } from "../styles/helpers";
import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { get, merge } from "lodash-es";
import { useBrickManifest } from "./use-brick-manifest";
import { defaultProps } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
import { tx, css } from "@upstart.gg/style-system/twind";
import { resolveSchema } from "@upstart.gg/sdk/shared/utils/schema-resolver";
import type { FieldFilter } from "@upstart.gg/sdk/shared/utils/schema";
import { getStyleProperties } from "../styles/style-props";

function useClassesFromStyleProps<T extends BrickManifest>(
  stylesProps: Record<string, string>,
  brick: BrickProps<T>["brick"],
  type: "brick" | "wrapper",
) {
  const { props, mobileProps } = brick;
  const mergedProps = merge({}, defaultProps[brick.type].props, props);

  const manifest = useBrickManifest(brick.type);

  const filtered = Object.entries(stylesProps).reduce((acc, [key, value]) => {
    const manifestField = get(manifest.props.properties, key);
    if (manifestField) {
      // resolve eventual ref
      const resolvedField = resolveSchema(manifestField);
      if (resolvedField.metadata?.filter) {
        const filter = resolvedField.metadata.filter as FieldFilter;
        if (!filter(resolvedField, mergedProps)) {
          acc.push(key);
        }
      }
    }
    // console.log("manifestField", manifestField);
    return acc;
  }, [] as string[]);

  const helpers = type === "brick" ? brickStylesHelpersMap : brickWrapperStylesHelpersMap;
  const classes = Object.entries(stylesProps).reduce(
    (acc, [path, styleId]) => {
      const helper = helpers[styleId as keyof typeof helpers];
      if (!helper) {
        return acc;
      }
      if (filtered.includes(path)) {
        return acc;
      }
      const part = extractStylePath(path);
      acc[part] = acc[part] ?? [];

      const resolvedProps = get(mergedProps, path);
      const resolvedMobileProps = get(mobileProps, path);
      const schema = get(manifest.props.properties, path);

      acc[part].push(
        // @ts-expect-error
        tx(helper?.(resolvedProps, resolvedMobileProps, schema)),
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
  return useClassesFromStyleProps(stylesProps, brick, "brick");
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
  const { props, mobileProps } = brick;
  const manifest = useBrickManifest(brick.type);
  const stylesProps = getStyleProperties(manifest.props);
  const styleIds = Object.values(stylesProps);
  const classes = useClassesFromStyleProps(stylesProps, brick, "wrapper");

  return tx(
    manifest.staticClasses,
    props.className as string,
    props.preset as string,
    "brick-wrapper group/brick flex",

    manifest.minWidth?.mobile ? `@mobile:min-w-[${manifest.minWidth.mobile}px]` : "@mobile:min-w-min",
    manifest.minWidth?.desktop ? `@desktop:min-w-[${manifest.minWidth.desktop}px]` : "@desktop:min-w-min",

    manifest.minHeight?.mobile ? `@mobile:min-h-[${manifest.minHeight.mobile}px]` : "@mobile:min-h-fit",
    manifest.minHeight?.desktop ? `@desktop:min-h-[${manifest.minHeight.desktop}px]` : "@desktop:min-h-fit",

    manifest.maxHeight?.mobile && `@mobile:max-h-[${manifest.maxHeight.mobile}px]`,
    manifest.maxHeight?.desktop && `@desktop:max-h-[${manifest.maxHeight.desktop}px]`,

    // Always respect the parent container width
    isContainerChild && "flex-grow",

    !isContainerChild && typeof props.width !== "undefined" && `@desktop:w-[${props.width}]`,

    !isContainerChild &&
      typeof props.width === "undefined" &&
      `@desktop:w-[${manifest.defaultWidth.desktop}]`,

    !isContainerChild && typeof mobileProps?.width !== "undefined"
      ? `@mobile:min-w-[${mobileProps.width}]`
      : `@mobile:w-[${manifest.defaultWidth.mobile}]`,

    // Max width
    manifest.maxWidth?.mobile && `@mobile:max-w-[${manifest.maxWidth.mobile}px]`,
    manifest.maxWidth?.desktop
      ? `@desktop:max-w-[${manifest.maxWidth.desktop}px]`
      : typeof props.width !== "undefined"
        ? `@desktop:max-w-[${props.width}px]`
        : null,

    typeof props.height !== "undefined" &&
      css({
        height: `${props.height}`,
      }),

    typeof props.height === "undefined" &&
      `@mobile:h-[${manifest.defaultHeight.mobile}] @desktop:h-[${manifest.defaultHeight.desktop}]`,

    styleIds.includes("styles:fixedPositioned") === false && "relative",

    // container children expand to fill the space
    isContainerChild && "container-child",

    // When a brick is hidden on mobile, hide the wrapper as well
    "@mobile:[&:has([data-mobile-hidden])]:hidden",

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
    "select-none transition-[outline] duration-[200ms]",
    "outline outline-2 outline-transparent outline-dashed",
    !isContainer ? "outline-offset-2" : "outline-offset-[6px]",
    selected && !isContainer && "!outline-upstart-400",
    selected && isContainer && "!outline-orange-300",
    !selected && !isContainerChild && !isContainer && "hover:(outline-upstart-400/60)",
    !selected && !isContainerChild && isContainer && "hover:(outline-orange-300/20)",
    !selected &&
      isContainerChild &&
      "hover:(outline-upstart-400/60) group-hover/brick:(outline-upstart-400/60)",
    css({
      "&.selected-group": {
        outlineColor: "var(--violet-8) !important",
      },
      "&.moving": {
        outlineColor: "var(--violet-8)",
      },
      "&.resizing": {
        outlineColor: "var(--violet-8)",
      },
      "& [data-brick-group]:hover": {
        outline: "1px dashed var(--violet-8)",
        opacity: 0.85,
      },
      // This is the class of the drag element original emplacement
      // "&.moving": {
      //   backgroundColor: "var(--gray-a6)",
      // },
      // Hide all content when dragging
      // "&.moving > *": {
      //   visibility: "hidden",
      // },
      // Hide any UI children elements when dragging
      "&.moving [data-ui]": {
        display: "none",
      },
    }),
  ];
}
