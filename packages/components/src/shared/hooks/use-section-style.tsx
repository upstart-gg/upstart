import { sectionProps, type Section } from "@upstart.gg/sdk/shared/bricks";
import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import { getBackgroundStyles, getGapStyles, simpleClassHandler } from "../styles/helpers";
import type { Resolution } from "@upstart.gg/sdk/shared/responsive";
import { tx, css } from "@upstart.gg/style-system/twind";
import type { ColorPresets } from "@upstart.gg/sdk/shared/bricks/props/preset";

type UseSectionStyleProps = {
  section: Section;
  editable?: boolean;
  selected?: boolean;
  previewMode?: Resolution;
};

export function useSectionStyle({ section, selected, editable, previewMode }: UseSectionStyleProps) {
  const GAP = section.props.gap ?? "12px"; // Default gap if not set
  const availablePresets = sectionProps.properties.colorPreset["ui:presets"] as ColorPresets;
  const presetClasses = section.props.colorPreset
    ? availablePresets[section.props.colorPreset].value.main
    : undefined;
  // console.log("useSectionStyle props", { props: section.props });
  return tx(
    "flex @mobile:flex-col @desktop:flex-row w-full @container/section group/section overflow-visible relative mx-auto max-sm:max-w-dvw",
    [
      // section.props.preset as string,
      presetClasses,
      section.props.maxWidth as string,
      typeof section.props.minHeight === "string" &&
        section.props.minHeight !== "full" &&
        `min-h-[${section.props.minHeight}]`,
      // full height
      section.props.minHeight === "full" && editable && "min-h-[calc(100dvh-60px)]", // when in editor mode
      section.props.minHeight === "full" && !editable && "min-h-dvh", // when in real mode

      section.props.alignItems,
      section.props.justifyContent,

      // Padding and gap
      // css({ gap: `${GAP}`, paddingInline: `${GAP}`, paddingBlock: `${GAP}` }),
      getGapStyles(GAP, section.mobileProps?.gap),
      simpleClassHandler(
        `p-[${GAP}]`,
        section.mobileProps?.gap ? `p-[${section.mobileProps.gap}]` : undefined,
      ),

      css({
        "&:has(.navbar)": {
          // This is a hack to ensure that the navbar is not affected by the section's padding
          paddingInline: "0px !important",
          paddingBlock: "0px !important",
        },
      }),

      // section.props.layout?.wrap === true ? "flex-wrap" : "flex-nowrap",

      "flex-nowrap",

      section.props.fillSpace && "[&>*]:grow",
      // "[&>*]:flex-shrink-0",

      // Background
      // !!section.props.background && getBackgroundStyles(section.props.background),

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
    "outline-dashed outline-2 -outline-offset-2 hover:(outline-upstart-500/60 shadow-upstart-500/20)",
    "self-stretch",

    selected ? "outline-upstart-500" : "outline-transparent",

    // this is the grid overlay shown when dragging
    editable &&
      previewMode &&
      css`
      &:has(.moving), &:has(.moving) ~ section {
        & [data-floating-ui-portal] {
          display: none;
        }
      }`,
  ];
}
