import type { Section } from "@upstart.gg/sdk/shared/bricks";
import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import { getBackgroundStyles } from "../styles/helpers";
import type { Resolution } from "@upstart.gg/sdk/shared/responsive";
import { tx, css } from "@upstart.gg/style-system/twind";

type UseSectionStyleProps = {
  section: Section;
  editable?: boolean;
  selected?: boolean;
  previewMode?: Resolution;
};

export function useSectionStyle({ section, selected, editable, previewMode }: UseSectionStyleProps) {
  const GAP = section.props.gap ?? "12px"; // Default gap if not set
  // console.log("useSectionStyle props", { props: section.props });
  return tx(
    "flex @mobile:flex-col @desktop:flex-row w-full py-0 @container/section group/section overflow-visible relative mx-auto max-sm:max-w-dvw",
    [
      section.props.preset as string,
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
      css({ gap: `${GAP}`, paddingInline: `${GAP}`, paddingBlock: `${GAP}` }),

      // section.props.layout?.wrap === true ? "flex-wrap" : "flex-nowrap",

      "flex-nowrap",

      section.props.fillSpace && "[&>*]:grow",
      // "[&>*]:flex-shrink-0",

      // Background
      !!section.props.background && getBackgroundStyles(section.props.background),

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
  const GAP = section.props.gap ?? "12px"; // Default gap if not set
  return [
    "select-none transition-[outline] duration-[200ms] delay-[100ms] relative",
    "outline-dashed outline-2 -outline-offset-2 hover:(outline-upstart-500/60 shadow-upstart-500/20)",
    "self-stretch",

    selected ? "outline-upstart-500" : "outline-transparent",

    // this is the grid overlay shown when dragging
    editable &&
      previewMode &&
      css`
      &:has(.moving), &:has(.moving) ~ section {
        &::before {
          content: "";
          position: absolute;
          opacity: 0.7;
          top: ${GAP};
          bottom: ${GAP};
          left: ${GAP};
          right: ${GAP};
          z-index: 999999;
          pointer-events: none;
          background-size:
            calc(100%/${LAYOUT_COLS}) 100%,
            100% ${LAYOUT_ROW_HEIGHT}px;
          background-image:
            repeating-linear-gradient(to right,
              rgba(81, 101, 255, 0.4) 0px,
              rgba(81, 101, 255, 0.4) 1px,
              transparent 1px,
              transparent 200px
            ),
            repeating-linear-gradient(to bottom,
              rgba(81, 101, 255, 0.4) 0px,
              rgba(81, 101, 255, 0.4) 1px,
              transparent 1px,
              transparent 80px
            );
        }
        & [data-floating-ui-portal] {
          display: none;
        }
        &>[data-element-kind="brick"]:not(.moving) {
          /*outline: 2px dotted #FF9900;
          outline-offset: 0px;*/
        }
      }`,
  ];
}
