import { type PageAttributes, pageAttributesSchema } from "@upstart.gg/sdk/shared/attributes";
import type { Resolution } from "@upstart.gg/sdk/shared/responsive";
import type { Theme } from "@upstart.gg/sdk/shared/theme";
import { tx, css } from "@upstart.gg/style-system/twind";
import { getStyleProperties } from "../styles/style-props";
import { usePageAttributes, useSiteAttributes } from "~/editor/hooks/use-page-data";
import get from "lodash-es/get";
import { extractStylePath, pageStylesHelpersMap } from "../styles/helpers";
import { useFontWatcher } from "~/editor/hooks/use-font-watcher";

type UsePageStyleProps = {
  // attributes: PageAttributes;
  editable?: boolean;
  // previewMode?: Resolution;
  // typography: Theme["typography"];
  showIntro?: boolean;
};

export function usePageStyle({ editable, showIntro }: UsePageStyleProps = {}) {
  const stylesProps = getStyleProperties(pageAttributesSchema);
  const classes = useClassesFromStyleProps(stylesProps);
  const typography = useFontWatcher();

  return tx(
    "flex flex-col group/page mx-auto relative max-w-full w-full p-0 antialiased",
    editable && "overflow-hidden min-h-[100cqh]",
    // pageAttributes.colorPreset?.color ?? siteAttributes.colorPreset?.color,
    Object.values(classes),
    getTypographyStyles(typography),
    // Animate all bricks when the page is loading
    editable && showIntro && "[&>.brick-wrapper]:(opacity-0 animate-elastic-pop)",
  );
}

function useClassesFromStyleProps(stylesProps: Record<string, string>) {
  const pageAttributes = usePageAttributes();

  const classes = Object.entries(stylesProps).reduce(
    (acc, [path, styleId]) => {
      const helper = pageStylesHelpersMap[styleId as keyof typeof pageStylesHelpersMap];
      if (!helper) {
        return acc;
      }
      const part = extractStylePath(path);
      acc[part] = acc[part] ?? [];

      const resolvedProps = get(pageAttributes, path);
      const schema = get(pageAttributesSchema.properties, path);

      acc[part].push(tx(helper?.(resolvedProps, undefined, schema)));
      return acc;
    },
    {} as Record<string, string[]>,
  );
  return classes;
}

function getTypographyStyles(typography: Theme["typography"]) {
  function formatFontFamily(font: typeof typography.body) {
    return font.type === "stack" ? `var(--font-${font.family})` : `"${font.family}"`;
  }
  return css({
    fontFamily: formatFontFamily(typography.body),
    fontSize: `${typography.base}px`,
    "& h1, & h2, & h3, & h4, & h5, & h6, & h7": {
      fontFamily: formatFontFamily(typography.heading),
    },
  });
}
