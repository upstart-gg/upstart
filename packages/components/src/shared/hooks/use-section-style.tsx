import { tx, apply, css } from "@upstart.gg/style-system/twind";
import type { Section } from "@upstart.gg/sdk/shared/bricks";
import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import { getBackgroundStyles } from "../styles/helpers";
import type { ResponsiveMode } from "@upstart.gg/sdk/shared/responsive";

type UseSectionStyleProps = {
  section: Section;
  editable?: boolean;
  /**
   * Not used yet
   */
  selected?: boolean;
  previewMode?: ResponsiveMode;
};

export function useSectionStyle({ section, editable, previewMode }: UseSectionStyleProps) {
  if (section.label === "Header") {
    console.log(section);
  }
  return tx("grid group/section overflow-visible relative", [
    typeof section.position.desktop.h === "number" &&
      `h-[${LAYOUT_ROW_HEIGHT * section.position.desktop.h}px]`,

    // full height
    section.position.desktop.h === "full" && editable && "h-[calc(100dvh-60px)]", // when in editor mode
    section.position.desktop.h === "full" && !editable && "h-dvh", // when in real mode

    // entire width of the grid
    " w-full py-0",
    // mobile grid
    `@mobile:(
      grid-cols-${LAYOUT_COLS.mobile}
      grid-rows-[repeat(auto-fill,${LAYOUT_ROW_HEIGHT}px)]
    )`,
    // Desktop grid
    `@desktop:(
      grid-cols-${LAYOUT_COLS.desktop}
      grid-rows-[repeat(auto-fill,${LAYOUT_ROW_HEIGHT}px)]
    )`,

    // Background
    section.props.background && getBackgroundStyles(section.props.background),

    // Section editor styles
    getSectionEditorStyles({ editable, previewMode, section }),

    css({
      paddingInline: `${section.props.$paddingHorizontal ?? 0}px`,
    }),

    // Manage the section order using css "order" (flex) property
    css({
      order: section.order,
    }),
  ]);
}

function getSectionEditorStyles({ section, editable, previewMode }: UseSectionStyleProps) {
  if (!editable) {
    return null;
  }
  return [
    "select-none hover:z-[9999] transition-colors duration-500 relative",
    "outline-dotted outline-4 outline-transparent -outline-offset-2 hover:(outline-upstart-500/60 shadow-upstart-500/20)",
    "self-stretch",

    // this is the grid overlay shown when dragging
    editable &&
      previewMode &&
      css`
      &:has(.moving), &:has(.moving) ~ section {
        &::before {
          content: "";
          position: absolute;
          opacity: 0.7;
          inset: 0;
          left: ${section.props.$paddingHorizontal ?? 0}px;
          right: ${section.props.$paddingHorizontal ?? 0}px;
          z-index: 999999;
          pointer-events: none;
          background-size:
            calc(100%/${LAYOUT_COLS[previewMode]}) 100%,
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
          outline: 2px dotted #FF9900;
          outline-offset: 0px;
        }
      }
    `,
  ];
}
