import { Tabs, Callout, useAutoAnimate, Text, Select } from "@upstart.gg/style-system/system";
import { forwardRef, useState, type ComponentProps } from "react";
import { LuArrowRightCircle } from "react-icons/lu";
import { nanoid } from "nanoid";
import { type Theme, themeSchema, type FontType } from "@upstart.gg/sdk/shared/theme";
import { useDraft, useEditorHelpers, useThemes } from "~/editor/hooks/use-editor";
import { ColorFieldRow } from "./json-form/fields/color";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import { getContrastingTextColor, type ColorType } from "@upstart.gg/sdk/shared/themes/color-system";
import FontPicker from "./json-form/fields/font";
import { tx, css } from "@upstart.gg/style-system/twind";
import { PanelBlockTitle } from "./PanelBlockTitle";
import ThemePreview from "./ThemePreview";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";

export default function ThemePanel() {
  const draft = useDraft();
  const [genListRef] = useAutoAnimate(/* optional config */);
  const baseSizes = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

  invariant(draft.theme, "ThemePanel: No theme found");

  const theme = draft.theme;

  return (
    <Tabs.Root defaultValue="current">
      <Tabs.List className="sticky top-0 z-50 bg-gray-100">
        <Tabs.Trigger value="current" className="!flex-1">
          Theme
        </Tabs.Trigger>
        <Tabs.Trigger value="list" className="!flex-1">
          Themes library
        </Tabs.Trigger>
      </Tabs.List>

      <ScrollablePanelTab tab="current" className="p-2">
        <Callout.Root>
          <Callout.Text size="2" className={tx("text-pretty")}>
            Customize your theme colors and typography to match your brand. Theme is applied to your entire
            site, not just the current page.
          </Callout.Text>
        </Callout.Root>
        <div className="flex flex-col">
          <PanelBlockTitle className="-mx-2 my-2">Colors</PanelBlockTitle>
          <div className="grid grid-cols-2 gap-x-3 text-sm flex-col gap-y-3 pb-2">
            {Object.entries(draft.theme.colors)
              .filter(([colorType]) => ["base200", "base300"].includes(colorType) === false)
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
                    if (
                      ["primary", "secondary", "accent", "neutral", "base100", "base200", "base300"].includes(
                        colorType,
                      )
                    ) {
                      const textColor = getContrastingTextColor(newColor);
                      if (!colorType.startsWith("base")) {
                        colors[`${colorType}Content`] = textColor;
                      } else if (colorType === "base100") {
                        colors.baseContent = textColor;
                      }
                    }
                    draft.setTheme({
                      ...theme,
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
      <ScrollablePanelTab tab="list" className="p-2">
        <Callout.Root>
          <Callout.Text size="2" className={tx("text-pretty")}>
            Here are some pre-made color themes. Click on a theme to preview it. Also feel free to use the
            Upstart AI chat to ask for a specific theme!
          </Callout.Text>
        </Callout.Root>
        <ThemeList />
      </ScrollablePanelTab>
    </Tabs.Root>
  );
}

function ThemeList() {
  const themes = useThemes();
  const draft = useDraft();
  const [parentRef] = useAutoAnimate();
  return (
    <div ref={parentRef} className={tx("grid grid-cols-2 gap-2 mt-2")}>
      {themes.map((theme) => (
        <ThemePreview key={theme.id} theme={theme} onClick={() => draft.setPreviewTheme(theme)} />
      ))}
    </div>
  );
}
