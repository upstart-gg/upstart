import { sectionProps, type Section } from "@upstart.gg/sdk/shared/bricks";
import { brickStylesHelpersMap, brickWrapperStylesHelpersMap, extractStylePath } from "../styles/helpers";
import type { Resolution } from "@upstart.gg/sdk/shared/responsive";
import { tx, css } from "@upstart.gg/style-system/twind";
import { getStyleProperties } from "../styles/style-props";
import { get, merge } from "lodash-es";
import { type FieldFilter, getSchemaDefaults } from "@upstart.gg/sdk/shared/utils/schema";
import { resolveSchema } from "@upstart.gg/sdk/shared/utils/schema-resolver";
import { usePageAttributes } from "~/editor/hooks/use-page-data";

type UseSectionStyleProps = {
  section: Section;
  editable?: boolean;
  selected?: boolean;
  previewMode?: Resolution;
};

export function useSectionStyle({ section, selected, editable, previewMode }: UseSectionStyleProps) {
  const stylesProps = getStyleProperties(sectionProps);
  const classes = useClassesFromStyleProps(stylesProps, section);

  return tx(
    // @mobile:flex-col @desktop:flex-row
    "flex flex-nowrap  w-full @container/section group/section overflow-visible relative mx-auto max-sm:max-w-dvw",
    [
      Object.values(classes),
      section.props.maxWidth as string,
      typeof section.props.minHeight === "string" &&
        section.props.minHeight !== "full" &&
        `min-h-[${section.props.minHeight}]`,
      // full height
      section.props.minHeight === "full" &&
        (editable
          ? "min-h-[calc(100dvh-60px)]" // when in editor mode
          : "min-h-dvh"),

      css({
        "&:has([data-no-section-padding])": {
          // This is a hack to ensure that the navbar is not affected by the section's padding
          paddingInline: "0px !important",
          paddingBlock: "0px !important",
        },
      }),

      // Section editor styles
      getSectionEditorStyles({ editable, previewMode, section, selected }),
      // Manage the section order using css "order" (flex) property
      css({
        order: section.order,
      }),
    ],
  );
}
function getSectionEditorStyles({ section, editable, selected, previewMode }: UseSectionStyleProps) {
  if (!editable) {
    return null;
  }
  return [
    "select-none transition-[outline] duration-150 relative",
    "outline-dashed outline-2 -outline-offset-2",
    // "self-stretch",

    selected ? "outline-upstart-500/40" : "outline-transparent hover:outline-upstart-500/40",

    // this is the grid overlay shown when dragging
    editable &&
      previewMode &&
      css`
      &:has(.moving), &:has(.moving) ~ section {
        & [data-floating-ui-portal] {
          display: none;
        }
        & .resizable-handle {
          display: none;
        }
      }`,
  ];
}

const sectionDefaultProps = getSchemaDefaults(sectionProps);

function useClassesFromStyleProps(stylesProps: Record<string, string>, section: Section) {
  const { props, mobileProps } = section;
  const pageAttributes = usePageAttributes();
  const mergedProps = merge({}, sectionDefaultProps, props);
  const filtered = Object.entries(stylesProps).reduce((acc, [key, value]) => {
    const manifestField = get(sectionProps.properties, key);
    if (manifestField) {
      // resolve eventual ref
      const resolvedField = resolveSchema(manifestField);
      if (resolvedField.metadata?.filter) {
        const filter = resolvedField.metadata.filter as FieldFilter;
        if (!filter(resolvedField, mergedProps, pageAttributes)) {
          acc.push(key);
        }
      }
    }

    return acc;
  }, [] as string[]);

  const classes = Object.entries(stylesProps).reduce(
    (acc, [path, styleId]) => {
      const helper =
        brickStylesHelpersMap[styleId as keyof typeof brickStylesHelpersMap] ??
        brickWrapperStylesHelpersMap[styleId as keyof typeof brickWrapperStylesHelpersMap];
      if (!helper) {
        console.warn("No helper found for styleId", styleId);
        return acc;
      }
      if (filtered.includes(path)) {
        console.warn("Filtered out section path", path);
        return acc;
      }
      const part = extractStylePath(path);
      acc[part] = acc[part] ?? [];

      const resolvedProps = get(mergedProps, path);
      const resolvedMobileProps = get(mobileProps, path);
      const schema = get(sectionProps.properties, path);
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
