import { tx, apply, css } from "@upstart.gg/style-system/twind";
import type { Section } from "@upstart.gg/sdk/shared/bricks";
import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import { getBackgroundStyles, type BrickStyleProps } from "../styles/helpers";

type UseSectionStyleProps = {
  section: Section;
  editable?: boolean;
  selected?: boolean;
};

export function useSectionStyle({ section, editable }: UseSectionStyleProps) {
  return tx(apply("grid group/section bg-yellow-300 relative overflow-visible"), [
    typeof section.position.desktop.h === "number" &&
      `h-[${LAYOUT_ROW_HEIGHT * section.position.desktop.h}px]`,
    section.position.desktop.h === "full" && "flex-1",
    // entire width of the grid
    "col-span-full h-fit w-full",
    // mobile grid
    `@mobile:(
      grid-cols-${LAYOUT_COLS.mobile}
      auto-rows-[minmax(${LAYOUT_ROW_HEIGHT}px,_max-content)]
      px-[10px]
      py-[10px]
      min-h-[110%]
    )`,
    // Desktop grid
    `@desktop:(
        grid-cols-${LAYOUT_COLS.desktop}
        auto-rows-[${LAYOUT_ROW_HEIGHT}px]
        py-0
        px-0
      )`,

    // Background
    getBackgroundStyles({ ...section.props, mobileProps: section.mobileProps }),

    // Section editor styles
    getSectionEditorStyles(!!editable),
  ]);
}

function getSectionEditorStyles(editable: boolean, selected?: boolean) {
  if (!editable) {
    return null;
  }
  return [
    "select-none hover:z-[9999] transition-colors duration-500",
    "outline-dotted outline-4 outline-transparent -outline-offset-2 hover:(outline-upstart-500/60 shadow-upstart-500/20)",
  ];
}
