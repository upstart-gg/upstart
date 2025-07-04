import { isStandardColor } from "@upstart.gg/sdk/shared/themes/color-system";
import type { Attributes } from "@upstart.gg/sdk/shared/attributes";
import type { Resolution } from "@upstart.gg/sdk/shared/responsive";
import type { Theme } from "@upstart.gg/sdk/shared/theme";
import { tx, css } from "@upstart.gg/style-system/twind";

type UsePageStyleProps = {
  attributes: Attributes;
  editable?: boolean;
  previewMode?: Resolution;
  typography: Theme["typography"];
  showIntro?: boolean;
};

export function useBodyStyle({ attributes }: { attributes: Attributes }) {
  return tx(
    isStandardColor(attributes.$bodyBackground?.color) &&
      css({ backgroundColor: attributes.$bodyBackground?.color as string }),
    !isStandardColor(attributes.$bodyBackground?.color) && (attributes.$bodyBackground?.color as string),
    typeof attributes.$bodyBackground?.image === "string" &&
      css({
        backgroundImage: `url(${attributes.$bodyBackground.image})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: attributes.$bodyBackground.size ?? "cover",
        backgroundPosition: "center top",
      }),
  );
}

export function usePageStyle({ attributes, editable, typography, showIntro }: UsePageStyleProps) {
  // console.log("usePageStyle", { attributes, editable });
  return tx(
    "flex flex-col group/page mx-auto relative max-w-full w-full p-0 antialiased",
    editable && "overflow-hidden min-h-full transition-all duration-300",
    isStandardColor(attributes.$pageBackground?.color) &&
      css({ backgroundColor: attributes.$pageBackground?.color as string }),
    attributes.$pageBackground?.color &&
      !isStandardColor(attributes.$pageBackground?.color) &&
      (attributes.$pageBackground?.color as string),
    isStandardColor(attributes.$textColor) && css({ color: attributes.$textColor as string }),
    !isStandardColor(attributes.$textColor) && (attributes.$textColor as string),
    typeof attributes.$pageBackground?.image === "string" &&
      css({
        backgroundImage: `url(${attributes.$pageBackground.image})`,
        backgroundRepeat: attributes.$pageBackground.repeat ?? "no-repeat",
        backgroundSize: attributes.$pageBackground.size ?? "cover",
        backgroundPosition: "center top",
      }),

    getTypographyStyles(typography),

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
    fontFamily: formatFontFamily(typography.body),
    fontSize: `${typography.base}px`,
    "& h1, & h2, & h3, & h4, & h5, & h6, & h7": {
      fontFamily: formatFontFamily(typography.heading),
    },
  });
}
