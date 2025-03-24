import { tx, apply, css } from "@upstart.gg/style-system/twind";
import type { Section } from "@upstart.gg/sdk/shared/bricks";
import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import { getBackgroundStyles } from "../styles/helpers";

type UseSectionStyleProps = {
  section: Section;
  editable?: boolean;
  /**
   * Not used yet
   */
  selected?: boolean;
};

export function useSectionStyle({ section, editable }: UseSectionStyleProps) {
  return tx(apply("grid group/section overflow-visible"), [
    typeof section.position.desktop.h === "number" &&
      `h-[${LAYOUT_ROW_HEIGHT * section.position.desktop.h}px]`,

    // full height
    section.position.desktop.h === "full" && editable && "h-[calc(100dvh-60px)]", // when in editor mode
    section.position.desktop.h === "full" && !editable && "h-dvh", // when in real mode

    // entire width of the grid
    "col-span-full w-full",
    // mobile grid
    `@mobile:(
      grid-cols-${LAYOUT_COLS.mobile}
      auto-rows-[minmax(${LAYOUT_ROW_HEIGHT}px,_max-content)]
      px-0
      py-0
    )`,
    // Desktop grid
    `@desktop:(
        grid-cols-${LAYOUT_COLS.desktop}
        auto-rows-[${LAYOUT_ROW_HEIGHT}px]
        py-0
        px-0
      )`,

    // Background
    section.props.background && getBackgroundStyles(section.props.background),

    // Section editor styles
    getSectionEditorStyles(!!editable),

    // Manage the section order using css "order" (flex) property
    css({
      order: section.order,
    }),
  ]);
}

function getSectionEditorStyles(editable: boolean) {
  if (!editable) {
    return null;
  }
  return [
    "select-none hover:z-[9999] transition-colors duration-500 relative",
    "outline-dotted outline-4 outline-transparent -outline-offset-2 hover:(outline-upstart-500/60 shadow-upstart-500/20)",
    "self-stretch",
    css`
    &:has(.moving) {
      position: static;

      &>[data-element-kind="brick"]:not(.moving) {
        outline: 2px dotted #FF9900;
        outline-offset: 0px;
      }
    }
    &:has(.moving) ~ section {
      position: static;
    }
    `,
  ];
}
