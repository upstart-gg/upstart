import { css, tx } from "@upstart.gg/style-system/twind";
import { LAYOUT_COLS, LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import { isStandardColor } from "@upstart.gg/sdk/shared/themes/color-system";
import type { Attributes } from "@upstart.gg/sdk/shared/attributes";
import type { ResponsiveMode } from "@upstart.gg/sdk/shared/responsive";
import type { Theme } from "@upstart.gg/sdk/shared/theme";

type UsePageStyleProps = {
  attributes: Attributes;
  editable?: boolean;
  previewMode?: ResponsiveMode;
  typography: Theme["typography"];
  showIntro?: boolean;
};

export function useBodyStyle({ attributes }: { attributes: Attributes }) {
  return tx(
    isStandardColor(attributes.$bodyBackground.color) &&
      css({ backgroundColor: attributes.$bodyBackground.color as string }),
    !isStandardColor(attributes.$bodyBackground.color) && (attributes.$bodyBackground.color as string),
    typeof attributes.$bodyBackground.image === "string" &&
      css({
        backgroundImage: `url(${attributes.$bodyBackground.image})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: attributes.$bodyBackground.size ?? "cover",
        backgroundPosition: "center top",
      }),
  );
}

export function usePageStyle({
  attributes,
  editable,
  previewMode,
  typography,
  showIntro,
}: UsePageStyleProps) {
  return tx(
    "flex flex-col group/page mx-auto relative overflow-hidden max-w-full w-full p-0",
    isStandardColor(attributes.$pageBackground.color) &&
      css({ backgroundColor: attributes.$pageBackground.color as string }),
    !isStandardColor(attributes.$pageBackground.color) && (attributes.$pageBackground.color as string),
    isStandardColor(attributes.$textColor) && css({ color: attributes.$textColor as string }),
    !isStandardColor(attributes.$textColor) && (attributes.$textColor as string),
    typeof attributes.$pageBackground.image === "string" &&
      css({
        backgroundImage: `url(${attributes.$pageBackground.image})`,
        //todo: make it dynamic, by using attributes
        backgroundRepeat: "no-repeat",
        backgroundSize: attributes.$pageBackground.size ?? "cover",
        backgroundPosition: "center top",
      }),

    // mobile grid
    `@mobile:(
      min-h-[110%]
      h-fit
    )`,
    // Desktop grid
    `@desktop:(
      min-h-[inherit]
      h-max
    )`,

    getTypographyStyles(typography),

    editable && "transition-all duration-300",

    // Animate all bricks when the page is loading
    editable && showIntro && "[&>.brick]:(opacity-0 animate-elastic-pop)",

    // this is the grid overlay shown when dragging
    editable &&
      previewMode &&
      css`
      &:has(.moving) {
        &::before {
          content: "";
          position: absolute;
          opacity: 0.7;
          inset: 0;
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
        &>div:not(.moving) {
          outline: 2px dotted #d3daf250 !important;
        }
        & [data-floating-ui-portal] {
          display: none;
        }
      }
    `,
  );
}
//

function getTypographyStyles(typography: Theme["typography"]) {
  function formatFontFamily(font: typeof typography.body) {
    return font.type === "stack" ? `var(--font-${font.family})` : font.family;
  }
  return css({
    "font-family": formatFontFamily(typography.body),
    "font-size": `${typography.base}px`,
    "& h1, & h2, & h3, & h4, & h5, & h6, & h7": {
      "font-family": formatFontFamily(typography.heading),
    },
  });
}
