import { useMemo } from "react";
import { fontStacks, type FontType } from "@upstart.gg/sdk/shared/themes/theme";
import googleFonts from "../utils/fonts.json";
import { useTheme } from "./use-page-data";

export function getFontLabel(font: FontType) {
  if (font.type === "stack") {
    return fontStacks.find((f) => f.value === font.family)?.label ?? font.family;
  }
  return font.family;
}

export function useFonts(fontType: "body" | "heading") {
  const ggFonts = useMemo(
    () => googleFonts.map((font: string) => ({ value: { type: "google", family: font }, label: font })),
    [],
  );
  const theme = useTheme();
  const genericFonts = fontStacks.map((font) => ({
    value: { type: "stack", family: font.value },
    label: font.label,
  }));

  const suggestedFonts =
    theme.typography.alternatives?.map((font) => ({
      label: getFontLabel(font[fontType]),
      value: font[fontType],
    })) ?? [];

  const allFonts = useMemo(
    () => [
      ...(suggestedFonts.length ? [{ group: "Suggested Fonts", options: suggestedFonts }] : []),
      {
        group: "Generic Fonts",
        options: genericFonts,
      },
      {
        group: "Google Fonts",
        options: ggFonts,
      },
    ],
    [suggestedFonts, genericFonts, ggFonts],
  );

  return allFonts;
}
