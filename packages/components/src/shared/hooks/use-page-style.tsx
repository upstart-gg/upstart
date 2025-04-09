import { css, tx } from "@upstart.gg/style-system/twind";
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

export function usePageStyle({ attributes, editable, typography, showIntro }: UsePageStyleProps) {
  return tx(
    "flex flex-col group/page mx-auto relative max-w-full w-full p-0 antialiased",
    editable && "overflow-hidden",
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
    editable && showIntro && "[&>.brick-wrapper]:(opacity-0 animate-elastic-pop)",
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
