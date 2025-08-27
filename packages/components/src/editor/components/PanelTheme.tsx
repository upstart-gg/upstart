import { Tabs, Callout, useAutoAnimate, Text, Select } from "@upstart.gg/style-system/system";
import { type Theme, themeSchema, type FontType } from "@upstart.gg/sdk/shared/theme";
import { useDraft, useDraftHelpers, useTheme, useThemes } from "~/editor/hooks/use-page-data";
import { ColorFieldRow } from "./json-form/fields/color";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import {
  getContrastingTextColor,
  chroma,
  type ColorType,
  generateColorsVars,
} from "@upstart.gg/sdk/shared/themes/color-system";
import FontPicker from "./json-form/fields/font";
import { css, tx } from "@upstart.gg/style-system/twind";
import { PanelBlockTitle } from "./PanelBlockTitle";
import ThemePreview from "./ThemePreview";
import { generateRelatedNeutral } from "../utils/colors";
import { useEffect, useState } from "react";
import { useDebugMode, useEditorHelpers } from "../hooks/use-editor";
import { getThemeCss } from "~/shared/utils/get-theme-css";

export default function ThemePanel() {
  const draft = useDraft();
  const [genListRef] = useAutoAnimate(/* optional config */);
  const baseSizes = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
  const theme = useTheme();
  const debug = useDebugMode();

  return (
    <div className="flex flex-col h-full">
      <PanelBlockTitle>Theme</PanelBlockTitle>
      <Tabs.Root defaultValue="current" className="flex-1 flex flex-col h-full">
        <Tabs.List size="1" className="sticky top-0 z-50 bg-gray-100">
          <Tabs.Trigger value="current" className="!flex-1">
            Current Theme
          </Tabs.Trigger>
          <Tabs.Trigger value="list" className="!flex-1">
            Themes library
          </Tabs.Trigger>
          {debug && (
            <Tabs.Trigger value="debug" className="!flex-1">
              Debug
            </Tabs.Trigger>
          )}
        </Tabs.List>
        <ScrollablePanelTab tab="current" className="px-2 overflow-auto">
          <Callout.Root className="-mx-2 !py-2 !px-3 !rounded-none">
            <Callout.Text size="1" className={tx("text-pretty")}>
              Customize your theme colors and typography to match your brand. Theme is applied to your entire
              site, not just the current page.
            </Callout.Text>
          </Callout.Root>
          <div className="flex flex-col">
            <PanelBlockTitle className="-mx-2 my-2">Colors</PanelBlockTitle>
            <div className="grid grid-cols-2 gap-x-3 text-sm flex-col gap-y-3 pb-2">
              {Object.entries(draft.theme.colors)
                // Don't show base200 and base300 in the color picker because they are automatically computed
                .filter(
                  ([colorType]) =>
                    ["base200", "base300"].includes(colorType) === false &&
                    colorType.endsWith("Content") === false,
                )
                .map(([colorType, color]) => (
                  <ColorFieldRow
                    key={colorType}
                    hideColorLabel
                    labelPlacement="right"
                    /* @ts-ignore */
                    name={themeSchema.properties.colors.properties[colorType].title}
                    /* @ts-ignore */
                    description={themeSchema.properties.colors.properties[colorType].description}
                    color={color}
                    labelClassName="font-medium"
                    colorType={colorType as ColorType}
                    onChange={(newColor: string) => {
                      const colors = { [colorType]: newColor };
                      let browserColorScheme = theme.browserColorScheme;
                      if (
                        [
                          "primary",
                          "secondary",
                          "accent",
                          "neutral",
                          "base100",
                          "base200",
                          "base300",
                        ].includes(colorType)
                      ) {
                        const color = chroma(newColor);
                        const textColor = getContrastingTextColor(newColor);
                        if (!colorType.startsWith("base")) {
                          colors[`${colorType}Content`] = textColor;
                          if (colorType === "primary") {
                            // Update neutral color based on primary
                            colors.neutral = generateRelatedNeutral(
                              // @ts-ignore oklch is a valid color format
                              color.css("oklch"),
                            );
                          }
                          // If color is base100, we need to compute the baseContent as well as base200 and base300
                        } else if (colorType === "base100") {
                          // check if it's a dark or a light color
                          const isDark = color.luminance() < 0.5;
                          // update browserColorScheme based on the lightness of base100
                          browserColorScheme = isDark ? "dark" : "light";
                          // set base100 content color
                          colors.baseContent = textColor;
                          const [l] = color.lch();
                          const base200 = isDark ? color.set("lch.l", l + 10) : color.set("lch.l", l - 4);
                          const base300 = isDark ? color.set("lch.l", l + 20) : color.set("lch.l", l - 8);
                          // @ts-ignore oklch is a valid color format
                          colors.base200 = base200.css("oklch");
                          // @ts-ignore oklch is a valid color format
                          colors.base300 = base300.css("oklch");
                        }
                      }
                      draft.setTheme({
                        ...theme,
                        browserColorScheme,
                        colors: {
                          ...theme.colors,
                          ...colors,
                        },
                      });
                    }}
                  />
                ))}
            </div>

            <PanelBlockTitle className="-mx-2 my-2">Typography</PanelBlockTitle>
            <div className="text-sm flex flex-col gap-y-4 p-2">
              {Object.entries(draft.theme.typography)
                .filter((obj) => obj[0] === "body" || obj[0] === "heading")
                .map(([fontType, font]) => (
                  <div key={fontType}>
                    <label className="font-medium">
                      {/* @ts-ignore */}
                      {themeSchema.properties.typography.properties[fontType].title}
                    </label>
                    <Text color="gray" as="p" size="1" className="mb-1.5">
                      {/* @ts-ignore */}
                      {themeSchema.properties.typography.properties[fontType].description}
                    </Text>
                    <FontPicker
                      fontType={fontType as "body" | "heading"}
                      initialValue={font as FontType}
                      onChange={(chosen) => {
                        draft.setTheme({
                          ...theme,
                          typography: {
                            ...theme.typography,
                            [fontType]: chosen,
                          },
                        });
                      }}
                    />
                  </div>
                ))}

              <div>
                <label className="font-medium">Base Font size</label>
                <Text color="gray" as="p" size="1" className="mb-2">
                  Can be changed for fonts that are too small or too big
                </Text>
                <Select.Root
                  defaultValue={`${draft.theme.typography.base}`}
                  size="2"
                  onValueChange={(chosen) => {
                    draft.setTheme({
                      ...theme,
                      typography: {
                        ...theme.typography,
                        base: parseInt(chosen),
                      },
                    });
                  }}
                >
                  <Select.Trigger className="!w-full" radius="large" variant="surface" />
                  <Select.Content position="popper">
                    {baseSizes.map((size) => (
                      <Select.Item key={`base-${size}`} value={`${size}`}>
                        {size} px
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
          </div>
        </ScrollablePanelTab>
        <ScrollablePanelTab tab="list" className="px-2 overflow-auto !h-[calc(100dvh-66px)]">
          <Callout.Root className="-mx-2 !py-2 !px-3 !rounded-none">
            <Callout.Text size="1" className={tx("text-pretty")}>
              Here are some pre-made color themes. Click on a theme to preview it. Also feel free to use the
              Upstart AI chat to ask for a specific theme!
            </Callout.Text>
          </Callout.Root>
          <ThemeList />
        </ScrollablePanelTab>
        {debug && (
          <ScrollablePanelTab tab="debug" className="h-full">
            <DebugTab />
          </ScrollablePanelTab>
        )}
      </Tabs.Root>
    </div>
  );
}

const colorSchemes = [
  "modern",
  "rustic",
  "playful",
  "vibrant",
  "professional",
  "neutral",
  "pastel",
  "tech",
  "elegant",
  "classic",
  "organic",
  "luxurious",
  "warm",
  "serene",
  "bold",
  "minimalist",
  "fresh",
  "calming",
  "energetic",
  "earthy",
].toSorted();

function ThemeList() {
  const siteThemes = useThemes();
  const draft = useDraft();
  const [loaded, setLoaded] = useState(false);
  const [colorScheme, setColorScheme] = useState("bold");
  const [browserColorScheme, setBrowserColorScheme] = useState<"light" | "dark">("light");
  const [upstartThemes, setUpstartThemes] = useState<Theme[]>([]);

  // Fetch default themes from /themes endpoint
  useEffect(() => {
    const fetchThemes = async () => {
      const response = await fetch(
        `/editor/themes?colorScheme=${colorScheme}&browserColorScheme=${browserColorScheme}`,
      );
      const data = await response.json();
      setUpstartThemes(data);
      setLoaded(true);
    };
    fetchThemes();
  }, [colorScheme, browserColorScheme]);

  const allThemes = [...siteThemes, ...upstartThemes];

  if (!loaded) {
    return (
      <div className="absolute inset-0 text-center text-gray-500 h-full flex-1 flex items-center justify-center">
        Loading themes...
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-2 items-center mt-2 mx-w-full">
        <span className="text-sm font-medium">Style</span>
        <Select.Root value={colorScheme} onValueChange={setColorScheme}>
          <Select.Trigger className="!flex-grow !capitalize" radius="large" variant="surface" />
          <Select.Content position="popper">
            <Select.Group>
              <Select.Label>Category</Select.Label>
              {colorSchemes.map((scheme) => (
                <Select.Item key={scheme} value={scheme} className="capitalize">
                  {scheme}
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <Select.Root
          defaultValue={browserColorScheme}
          onValueChange={(value) => setBrowserColorScheme(value as "light" | "dark")}
        >
          <Select.Trigger className="!flex-grow !capitalize pr-0.5" radius="large" variant="surface" />
          <Select.Content position="popper">
            <Select.Group>
              <Select.Label>Lightness</Select.Label>
              {["light", "dark"].map((scheme) => (
                <Select.Item key={scheme} value={scheme} className="capitalize">
                  {scheme}
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
      <div className={tx("grid grid-cols-2 gap-3 pt-3 pb-2 relative pr-1.5")}>
        {allThemes.map((theme) => (
          <ThemePreview
            key={theme.id}
            selected={draft.previewTheme?.id === theme.id}
            theme={theme}
            onClick={() => draft.setPreviewTheme(theme)}
          />
        ))}
      </div>
      {allThemes.length === 0 && (
        <div className="absolute inset-0 text-center text-gray-500 h-full flex-1 flex items-center justify-center pointer-events-none">
          No themes found for specified filters.
        </div>
      )}
    </>
  );
}

function DebugTab() {
  const codeClassName = tx(
    css({
      display: "block",
      fontFamily: "monospace",
      fontSize: "0.7rem",
      lineHeight: "1.3",
      wordWrap: "break-word",
      whiteSpace: "pre-wrap",
    }),
  );
  const { previewTheme, theme } = useDraft();
  return (
    <div className="overflow-y-auto scrollbar-thin grow-0 max-h-[92cqh]">
      {previewTheme && (
        <>
          <PanelBlockTitle>Preview theme</PanelBlockTitle>
          <div className="flex-1 ">
            <pre className="p-1">
              <code className={codeClassName}>{JSON.stringify(previewTheme, null, 2)}</code>
            </pre>
          </div>
        </>
      )}
      <PanelBlockTitle>Theme</PanelBlockTitle>
      <div className="flex-1 ">
        <pre className="p-1">
          <code className={codeClassName}>{JSON.stringify(theme, null, 2)}</code>
        </pre>
      </div>
      <PanelBlockTitle>Theme colors vars</PanelBlockTitle>
      <div className="flex-1 ">
        <pre className="p-1">
          <code className={codeClassName}>{JSON.stringify(generateColorsVars(theme), null, 2)}</code>
        </pre>
      </div>
    </div>
  );
}
