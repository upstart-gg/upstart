import { Tabs, Callout, useAutoAnimate, Text, Select } from "@upstart.gg/style-system/system";
import { themes } from "@upstart.gg/sdk/shared/themes/all-themes";
import { forwardRef, useState, type ComponentProps } from "react";
import { LuArrowRightCircle } from "react-icons/lu";
import { nanoid } from "nanoid";
import { type Theme, themeSchema, type FontType } from "@upstart.gg/sdk/shared/theme";
import { useDraft, useEditorHelpers } from "~/editor/hooks/use-editor";
import { ColorFieldRow } from "./json-form/fields/color";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import { getContrastingTextColor, type ColorType } from "@upstart.gg/sdk/shared/themes/color-system";
import FontPicker from "./json-form/fields/font";
import { tx, css } from "@upstart.gg/style-system/twind";
import { PanelBlockTitle } from "./PanelBlockTitle";

export default function ThemePanel() {
  const draft = useDraft();
  const [genListRef] = useAutoAnimate(/* optional config */);
  const baseSizes = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];

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
        <Callout.Root size="1">
          <Callout.Text size="1" className={tx("text-pretty")}>
            Customize your theme colors and typography to match your brand. Please note that the theme will be
            applied to your entire site, not just the current page.
          </Callout.Text>
        </Callout.Root>
        <div className="flex flex-col">
          <PanelBlockTitle className="-mx-2 my-2">Colors</PanelBlockTitle>
          <div className="grid grid-cols-2 gap-x-3 text-sm flex-col gap-y-3 pb-2">
            {Object.entries(draft.theme.colors).map(([colorType, color]) => (
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
                    if (colorType.startsWith("base")) {
                      colors.baseContent = textColor;
                    } else {
                      colors[`${colorType}Content`] = textColor;
                    }
                  }

                  draft.setTheme({
                    ...draft.theme,
                    colors: {
                      ...draft.theme.colors,
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
                        ...draft.theme,
                        typography: {
                          ...draft.theme.typography,
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
                    ...draft.theme,
                    typography: {
                      ...draft.theme.typography,
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
        <Callout.Root size="1">
          <Callout.Text size="1" className={tx("text-pretty")}>
            Here are some pre-made themes you can use. Click on a theme to preview it. Also feel free to use
            the Upstart AI chat to ask for a specific theme!
          </Callout.Text>
        </Callout.Root>
        <ThemeListWrapper>
          {themes.map((theme) => (
            <ThemePreview key={theme.id} theme={theme} />
          ))}
        </ThemeListWrapper>
      </ScrollablePanelTab>
    </Tabs.Root>
  );
}

const ThemeListWrapper = forwardRef<HTMLDivElement, ComponentProps<"div">>(function ThemeListWrapper(
  { children, className }: ComponentProps<"div">,
  ref,
) {
  return (
    <div ref={ref} className={tx("grid grid-cols-2 gap-2 mt-2", className)}>
      {children}
    </div>
  );
});

function ThemePreview({ theme }: { theme: Theme }) {
  const draft = useDraft();
  return (
    <button
      type="button"
      className={tx(
        "relative border border-upstart-300 flex flex-col text-xs items-center p-1 group w-full rounded hover:(ring-2 ring-upstart-300) transition-all",
        css({ backgroundColor: theme.colors.base100, color: theme.colors.baseContent }),
      )}
      onClick={() => draft.setPreviewTheme(theme)}
    >
      <div
        className={tx(
          "h-5 self-stretch",
          css({ backgroundColor: theme.colors.primary, color: theme.colors.primaryContent }),
        )}
      />
      <div
        className={tx(
          "h-5 self-stretch",
          css({ backgroundColor: theme.colors.secondary, color: theme.colors.secondaryContent }),
        )}
      />
      <div
        className={tx(
          "h-5 self-stretch",
          css({ backgroundColor: theme.colors.accent, color: theme.colors.accentContent }),
        )}
      />

      <h3 className="pt-1">{theme.name}</h3>
      <span
        className={tx(
          `!opacity-0 w-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
           text-xs text-white font-medium
          justify-end items-center gap-1.5 text-upstart-700 px-2 py-1 bg-upstart-700/80 rounded-md
          group-hover:!opacity-100 transition-opacity duration-150 `,
        )}
      >
        Preview
      </span>
    </button>
  );
}
