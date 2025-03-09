import { tx, apply, css } from "@upstart.gg/style-system/twind";
import type { Section } from "@upstart.gg/sdk/shared/bricks";
import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import { getBackgroundStyles, type BrickStyleProps } from "../styles/helpers";
import { usePreviewMode } from "~/editor/hooks/use-editor";

type UseSectionStyleProps = {
  section: Section;
  editable?: boolean;
  selected?: boolean;
};

export function useSectionStyle({ section, editable }: UseSectionStyleProps) {
  return tx(apply("grid group/section bg-yellow-300 relative overflow-visible"), [
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
      px-[10px]
      py-[10px]
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
  ];
}
