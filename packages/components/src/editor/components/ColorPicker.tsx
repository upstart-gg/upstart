import { type FC, useState, type PropsWithChildren } from "react";
import {
  chroma,
  type ColorType,
  type ElementColorType,
  type ElementColor,
  baseColors,
} from "@upstart.gg/sdk/themes/color-system";
import { Text, Select, Tabs, Inset, Callout, Button } from "@upstart.gg/style-system/system";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import { tx } from "@upstart.gg/style-system/twind";
import { colorPalette } from "@upstart.gg/style-system/colors";
import { useTheme } from "../hooks/use-page-data";
import type { Theme } from "@upstart.gg/sdk/shared/theme";
import { generateRelatedNeutral } from "../utils/colors";

const gradientMixs = [
  ["100", "200"],
  ["100", "300"],
  ["200", "400"],
  ["300", "500"],
  ["400", "600"],
  ["500", "700"],
  ["600", "800"],
  ["700", "900"],
];

interface BaseColorPickerProps {
  colorType: ColorType;
  initialValue?: number | string;
  onChange?: (color: string) => void;
  steps?: number;
}

const baseColorPalette = {
  // Gray - Pure neutrals from Tailwind
  gray: {
    "50": "hsl(0, 0%, 98%)", // Even lighter
    "100": "hsl(0, 0%, 95%)", // Even lighter
    "200": "hsl(0, 0%, 90%)", // Even lighter
    "800": "hsl(0, 0%, 25%)", // Darker
    "900": "hsl(0, 0%, 15%)", // Darker
    "950": "hsl(0, 0%, 8%)", // Much darker
  },

  // Amber - Tailwind amber color scale
  amber: {
    "50": "hsl(48, 100%, 98%)", // Even lighter
    "100": "hsl(48, 96%, 95%)", // Even lighter
    "200": "hsl(48, 97%, 90%)", // Even lighter
    "800": "hsl(32, 95%, 25%)", // Darker
    "900": "hsl(28, 93%, 15%)", // Darker
    "950": "hsl(24, 94%, 8%)", // Much darker
  },

  // Yellow - Tailwind yellow color scale
  yellow: {
    "50": "hsl(55, 92%, 98%)", // Even lighter
    "100": "hsl(55, 97%, 95%)", // Even lighter
    "200": "hsl(53, 98%, 90%)", // Even lighter
    "800": "hsl(32, 81%, 25%)", // Darker
    "900": "hsl(28, 73%, 15%)", // Darker
    "950": "hsl(26, 77%, 8%)", // Much darker
  },

  // Lime - Tailwind lime color scale
  lime: {
    "50": "hsl(78, 92%, 98%)", // Even lighter
    "100": "hsl(80, 89%, 95%)", // Even lighter
    "200": "hsl(81, 88%, 90%)", // Even lighter
    "800": "hsl(84, 81%, 25%)", // Darker
    "900": "hsl(88, 61%, 15%)", // Darker
    "950": "hsl(89, 80%, 8%)", // Much darker
  },

  // Green - Tailwind green color scale
  green: {
    "50": "hsl(138, 76%, 98%)", // Even lighter
    "100": "hsl(141, 84%, 95%)", // Even lighter
    "200": "hsl(141, 79%, 90%)", // Even lighter
    "800": "hsl(158, 64%, 25%)", // Darker
    "900": "hsl(158, 68%, 15%)", // Darker
    "950": "hsl(164, 86%, 8%)", // Much darker
  },

  // Emerald - Tailwind emerald color scale
  emerald: {
    "50": "hsl(152, 81%, 98%)", // Even lighter
    "100": "hsl(149, 80%, 95%)", // Even lighter
    "200": "hsl(152, 76%, 90%)", // Even lighter
    "800": "hsl(158, 84%, 25%)", // Darker
    "900": "hsl(158, 84%, 15%)", // Darker
    "950": "hsl(164, 96%, 8%)", // Much darker
  },

  // Teal - Tailwind teal color scale
  teal: {
    "50": "hsl(166, 76%, 98%)", // Even lighter
    "100": "hsl(167, 85%, 95%)", // Even lighter
    "200": "hsl(168, 84%, 90%)", // Even lighter
    "800": "hsl(183, 81%, 25%)", // Darker
    "900": "hsl(184, 91%, 15%)", // Darker
    "950": "hsl(186, 100%, 8%)", // Much darker
  },

  // Cyan - Tailwind cyan color scale
  cyan: {
    "50": "hsl(183, 100%, 98%)", // Even lighter
    "100": "hsl(185, 96%, 95%)", // Even lighter
    "200": "hsl(186, 94%, 90%)", // Even lighter
    "800": "hsl(200, 84%, 25%)", // Darker
    "900": "hsl(202, 83%, 15%)", // Darker
    "950": "hsl(205, 100%, 8%)", // Much darker
  },

  // Sky - Tailwind sky color scale
  sky: {
    "50": "hsl(204, 100%, 98%)", // Even lighter
    "100": "hsl(204, 94%, 95%)", // Even lighter
    "200": "hsl(201, 94%, 90%)", // Even lighter
    "800": "hsl(213, 92%, 25%)", // Darker
    "900": "hsl(218, 79%, 15%)", // Darker
    "950": "hsl(223, 88%, 8%)", // Much darker
  },

  // Blue - Tailwind blue color scale
  blue: {
    "50": "hsl(214, 100%, 98%)", // Even lighter
    "100": "hsl(214, 95%, 95%)", // Even lighter
    "200": "hsl(213, 97%, 90%)", // Even lighter
    "800": "hsl(213, 94%, 25%)", // Darker
    "900": "hsl(215, 92%, 15%)", // Darker
    "950": "hsl(221, 100%, 8%)", // Much darker
  },

  // Indigo - Tailwind indigo color scale
  indigo: {
    "50": "hsl(228, 100%, 98%)", // Even lighter
    "100": "hsl(228, 100%, 95%)", // Even lighter
    "200": "hsl(228, 100%, 90%)", // Even lighter
    "800": "hsl(228, 100%, 25%)", // Darker
    "900": "hsl(228, 100%, 15%)", // Darker
    "950": "hsl(228, 100%, 8%)", // Much darker
  },

  // Violet - Tailwind violet color scale
  violet: {
    "50": "hsl(250, 100%, 98%)", // Even lighter
    "100": "hsl(251, 91%, 95%)", // Even lighter
    "200": "hsl(251, 95%, 90%)", // Even lighter
    "800": "hsl(258, 90%, 25%)", // Darker
    "900": "hsl(259, 94%, 15%)", // Darker
    "950": "hsl(261, 100%, 8%)", // Much darker
  },

  // Purple - Tailwind purple color scale
  purple: {
    "50": "hsl(270, 100%, 98%)", // Even lighter
    "100": "hsl(269, 100%, 95%)", // Even lighter
    "200": "hsl(269, 100%, 90%)", // Even lighter
    "800": "hsl(273, 85%, 25%)", // Darker
    "900": "hsl(275, 100%, 15%)", // Darker
    "950": "hsl(279, 100%, 8%)", // Much darker
  },

  // Fuchsia - Tailwind fuchsia color scale
  fuchsia: {
    "50": "hsl(289, 100%, 98%)", // Even lighter
    "100": "hsl(287, 100%, 95%)", // Even lighter
    "200": "hsl(288, 96%, 90%)", // Even lighter
    "800": "hsl(295, 100%, 25%)", // Darker
    "900": "hsl(297, 100%, 15%)", // Darker
    "950": "hsl(303, 100%, 8%)", // Much darker
  },

  // Pink - Tailwind pink color scale
  pink: {
    "50": "hsl(327, 73%, 98%)", // Even lighter
    "100": "hsl(326, 78%, 95%)", // Even lighter
    "200": "hsl(326, 85%, 90%)", // Even lighter
    "800": "hsl(335, 78%, 25%)", // Darker
    "900": "hsl(336, 84%, 15%)", // Darker
    "950": "hsl(340, 87%, 8%)", // Much darker
  },

  // Rose - Tailwind rose color scale
  rose: {
    "50": "hsl(356, 100%, 98%)", // Even lighter
    "100": "hsl(356, 100%, 95%)", // Even lighter
    "200": "hsl(356, 100%, 90%)", // Even lighter
    "800": "hsl(356, 100%, 25%)", // Darker
    "900": "hsl(356, 100%, 15%)", // Darker
    "950": "hsl(356, 100%, 8%)", // Much darker
  },

  // Orange - Tailwind orange color scale
  orange: {
    "50": "hsl(33, 100%, 98%)", // Even lighter
    "100": "hsl(34, 100%, 95%)", // Even lighter
    "200": "hsl(32, 98%, 90%)", // Even lighter
    "800": "hsl(15, 79%, 25%)", // Darker
    "900": "hsl(9, 87%, 15%)", // Darker
    "950": "hsl(15, 86%, 8%)", // Much darker
  },

  // Red - Tailwind red color scale
  red: {
    "50": "hsl(0, 86%, 98%)", // Even lighter
    "100": "hsl(0, 93%, 95%)", // Even lighter
    "200": "hsl(0, 96%, 90%)", // Even lighter
    "800": "hsl(0, 84%, 25%)", // Darker
    "900": "hsl(0, 63%, 15%)", // Darker
    "950": "hsl(0, 75%, 8%)", // Much darker
  },
};

const BaseColorPicker: FC<BaseColorPickerProps> = ({
  colorType,
  initialValue = 120,
  onChange = () => {},
}) => {
  const [selectedColor, setSelectedColor] = useState(initialValue);
  const theme = useTheme();

  // Handle color selection
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onChange(color);
  };

  const isBaseColor = colorType === "base100";
  const isNeutralColor = colorType === "neutral";
  const palette = isBaseColor
    ? baseColorPalette
    : isNeutralColor
      ? generateNeutralOptions(theme)
      : colorPalette;
  const cols = isBaseColor ? 3 : 7; // Adjust columns for base colors

  if (isBaseColor) {
    const darkShades = Object.entries(palette)
      .flatMap(([colorName, shades]) =>
        Object.entries(shades as Record<string, string>)
          .filter((shade) => {
            const shadeInt = parseInt(shade[0], 10);
            return shadeInt >= 900; // Only keep dark shades
          })
          .map(([shadeName, color]) => {
            // @ts-ignore oklch is a valid color format
            return [colorName, shadeName, chroma(color).css("oklch")];
          }),
      )
      .toSorted((a, b) => {
        // sort by shade
        const shadeA = parseInt(a[1], 10);
        const shadeB = parseInt(b[1], 10);
        return shadeA - shadeB;
      });

    const lightShades = Object.entries(palette)
      .flatMap(([colorName, shades]) =>
        Object.entries(shades as Record<string, string>)
          .filter((shade) => {
            const shadeInt = parseInt(shade[0], 10);
            return shadeInt <= 100; // Only keep light shades
          })
          .map(([shadeName, color]) => {
            // @ts-ignore oklch is a valid color format
            return [colorName, shadeName, chroma(color).css("oklch")];
          }),
      )
      .toSorted((a, b) => {
        // sort by shade
        const shadeA = parseInt(a[1], 10);
        const shadeB = parseInt(b[1], 10);
        return shadeA - shadeB;
      });

    return (
      <div>
        <Text as="p" size="2" className="!capitalize !font-medium select-none">
          {baseColors[colorType]}
        </Text>
        <Callout.Root className="mt-3 -mx-4 !py-2 !px-3 !rounded-none">
          <Callout.Text size="1" className={tx("text-pretty")}>
            Base color are very light or very dark colors that are used as backgrounds or for large areas. So
            don't worry if those colors look too light or too dark, they are meant to!
          </Callout.Text>
        </Callout.Root>
        <Tabs.Root defaultValue={theme.browserColorScheme}>
          <Inset clip="padding-box" side="x" pb="current">
            <Tabs.List size="1">
              <Tabs.Trigger value="light" className="!flex-1">
                Light
              </Tabs.Trigger>
              <Tabs.Trigger value="dark" className="!flex-1">
                Dark
              </Tabs.Trigger>
            </Tabs.List>
          </Inset>
          <Tabs.Content value="light">
            <div className={`flex flex-wrap gap-3`}>
              {lightShades.map(([colorName, shadeName, color]) => (
                <button
                  type="button"
                  title={`${colorName} ${shadeName}`}
                  id={`${colorName}-${shadeName}`}
                  key={`${colorName}-${shadeName}`}
                  className={tx(
                    "outline outline-gray-200 outline-offset-1  transition-transform hover:scale-110 focus:outline-upstart-300",
                    "w-6 h-6 rounded-full",
                    selectedColor === color && "outline-upstart-300",
                  )}
                  style={{
                    background: color,
                    filter: "saturate(180%)",
                  }}
                  onClick={() => handleColorSelect(color)}
                  aria-label={`Select color ${color}`}
                />
              ))}
              <Button
                size="1"
                variant="outline"
                className="!mt-1 self-stretch !basis-full block"
                onClick={() => handleColorSelect("#ffffff")}
              >
                Full white
              </Button>
            </div>
          </Tabs.Content>
          <Tabs.Content value="dark">
            <div className={`flex flex-wrap gap-3`}>
              {darkShades.map(([colorName, shadeName, color]) => (
                <button
                  type="button"
                  key={`${colorName}-${shadeName}`}
                  className={tx(
                    "outline outline-gray-200 outline-offset-1 transition-transform hover:scale-110 focus:outline-upstart-300",
                    "w-6 h-6 rounded-full",
                    selectedColor === color && "outline-upstart-300",
                  )}
                  title={`Dark ${colorName} ${shadeName}`}
                  style={{
                    background: color,
                    filter: "saturate(180%)",
                  }}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
              <Button
                size="1"
                variant="outline"
                className="!mt-1 self-stretch !basis-full block"
                onClick={() => handleColorSelect("#000000")}
              >
                Full black
              </Button>
            </div>
          </Tabs.Content>
        </Tabs.Root>

        {/* Color circles */}

        {/* Current color display */}
        <div className="flex items-center gap-3 p-2 bg-gray-100 rounded mt-2">
          <div
            className="w-8 h-8 flex-nowrap shrink-0 aspect-square rounded-md shadow-sm"
            style={{ background: selectedColor }}
          />
          <code className="text-xs text-gray-600">{selectedColor}</code>
        </div>

        <form
          className="group mt-2"
          onSubmit={(e) => {
            e.preventDefault();
            const color = new FormData(e.currentTarget).get("customColor") as string;
            invariant(color, "Color is required");
            handleColorSelect(color);
          }}
        >
          {/* <div className={tx("flex text-sm gap-x-1")}>
          {colorType !== "primary" && (
            <div className="flex flex-col items-start justify-start gap-y-1 flex-shrink basis-1/2">
              <Text color="gray">Suggestions:</Text>
              <div className="gap-1">
                {suggestedColors.map((suggestion) => (
                  <button
                    key={suggestion.color}
                    type="button"
                    className="w-6 h-6 mr-1 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: suggestion.color }}
                    onClick={() => handleColorSelect(suggestion.color, chroma(suggestion.color).oklab())}
                  />
                ))}
              </div>
            </div>
          )}
           <div className="flex flex-col gap-y-1 items-start justify-start basis-1/2">
            <Text color="gray">Use a custom color</Text>
            <div className="flex gap-x-1">
              <TextField.Root
                required
                name="customColor"
                placeholder="#123456"
                size="1"
                className="w-20"
                pattern="#[0-9a-fA-F]{6}"
                maxLength={7}
              />
              <Button
                size="1"
                variant="soft"
                className="mr-2 group-invalid:pointer-events-none group-invalid:opacity-60"
                type="submit"
              >
                Save
              </Button>
            </div>
          </div>
        </div> */}
        </form>
      </div>
    );
  }

  return (
    <div>
      <Text as="p" size="2" color="gray" className="!capitalize !font-medium">
        {baseColors[colorType]}
      </Text>
      {/* Color circles */}
      {colorType.endsWith("Content") && (
        <Callout.Root className="mt-3 -mx-4 !py-2 !px-3 !rounded-none">
          <Callout.Text size="1" className={tx("text-pretty")}>
            Text content colors are auto-generated when you select the associated background color. We
            recommend using the generated one, but you can also select a different one if you want.
          </Callout.Text>
        </Callout.Root>
      )}
      {colorType === "neutral" && (
        <Callout.Root className="mt-3 -mx-4 !py-2 !px-3 !rounded-none">
          <Callout.Text size="1" className={tx("text-pretty")}>
            Neutral color is a subdued color derived from the primary color. It is used for backgrounds and
            elements that need to be less prominent.
          </Callout.Text>
        </Callout.Root>
      )}
      <div
        className={tx(
          `grid grid-cols-${cols} gap-3 mt-3 pt-1 pb-1 pl-1 w-full pr-5 max-h-[45dvh] overflow-y-scroll scrollbar-thin scrollbar-color-violet`,
        )}
        style={{
          scrollbarGutter: "stable",
        }}
      >
        {Object.entries(palette).map(([colorName, shades], i) =>
          Object.entries(shades as Record<string, string>)
            .filter((shade) => {
              const shadeInt = parseInt(shade[0], 10);
              return isNeutralColor || (shadeInt >= 200 && shadeInt <= 800);
            })
            .map(([shadeName, color]) => (
              <button
                type="button"
                id={`${colorName}-${shadeName}`}
                key={`${colorName}-${shadeName}`}
                className={tx(
                  "outline outline-gray-200 outline-offset-1 transition-transform hover:scale-110 focus:outline-upstart-300",
                  //isBaseColor ? "w-5 h-5 aspect-square rounded-full" :
                  "w-6 h-6 rounded-full",
                  selectedColor === color && "outline-upstart-300",
                )}
                style={{
                  background: color,
                }}
                onClick={() => handleColorSelect(color)}
                aria-label={`Select color ${color}`}
              />
            )),
        )}
      </div>

      {/* Current color display */}
      <div className="flex items-center gap-3 p-2 bg-gray-100 rounded mt-3">
        <div
          className="w-8 h-8 flex-nowrap shrink-0 aspect-square rounded-md shadow-sm"
          style={{ background: selectedColor }}
        />
        <code className="text-xs">{selectedColor}</code>
      </div>

      <form
        className="group mt-2"
        onSubmit={(e) => {
          e.preventDefault();
          const color = new FormData(e.currentTarget).get("customColor") as string;
          invariant(color, "Color is required");
          handleColorSelect(color);
        }}
      >
        {/* <div className={tx("flex text-sm gap-x-1")}>
          {colorType !== "primary" && (
            <div className="flex flex-col items-start justify-start gap-y-1 flex-shrink basis-1/2">
              <Text color="gray">Suggestions:</Text>
              <div className="gap-1">
                {suggestedColors.map((suggestion) => (
                  <button
                    key={suggestion.color}
                    type="button"
                    className="w-6 h-6 mr-1 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ backgroundColor: suggestion.color }}
                    onClick={() => handleColorSelect(suggestion.color, chroma(suggestion.color).oklab())}
                  />
                ))}
              </div>
            </div>
          )}
           <div className="flex flex-col gap-y-1 items-start justify-start basis-1/2">
            <Text color="gray">Use a custom color</Text>
            <div className="flex gap-x-1">
              <TextField.Root
                required
                name="customColor"
                placeholder="#123456"
                size="1"
                className="w-20"
                pattern="#[0-9a-fA-F]{6}"
                maxLength={7}
              />
              <Button
                size="1"
                variant="soft"
                className="mr-2 group-invalid:pointer-events-none group-invalid:opacity-60"
                type="submit"
              >
                Save
              </Button>
            </div>
          </div>
        </div> */}
      </form>
    </div>
  );
};

export default BaseColorPicker;

interface ElementColorPickerProps {
  elementColorType: ElementColorType;
  initialValue?: ElementColor;
  onChange?: (color: ElementColor | null) => void;
}

type ColorPillListProps =
  | {
      type: "solid";
      elementColorType: ElementColorType;
      colors: string[];
      cols: number;
      onChange: (color: ElementColor | null) => void;
      currentColor?: ElementColor;
    }
  | {
      type: "gradient";
      elementColorType: ElementColorType;
      colors: { from: string; to: string }[];
      cols: number;
      onChange: (color: ElementColor | null) => void;
      currentColor?: ElementColor;
    };

function ColorPillList({
  type,
  colors,
  onChange,
  cols,
  children,
  currentColor,
  elementColorType,
}: PropsWithChildren<ColorPillListProps>) {
  const [gradientDir, setGradientDir] = useState<string>(getInitialGradientDir());
  const [gradient, setGradient] = useState<{ from: string; to: string } | null>(getInitialGradient());

  function getInitialGradientDir() {
    const match = currentColor?.match(/to-(\w+)/);
    if (match) {
      return match[1];
    }
    return "b";
  }

  function getInitialGradient() {
    if (currentColor?.includes("bg-gradient")) {
      const from = currentColor.match(/from-(\w+)/)?.[1];
      const to = currentColor.match(/to-(\w+)/)?.[1];
      return from && to ? { from, to } : null;
    }
    return null;
  }

  if (type === "solid") {
    return (
      <div className="flex flex-col gap-3">
        <div className={`grid grid-cols-${cols} gap-2.5 mx-auto`}>
          {colors.map((color) => (
            <button
              type="button"
              key={color}
              className={tx(
                "mx-auto h-7 w-7 rounded-full shadow-sm shadow-upstart-300 transition-transform",
                `bg-${color} hover:outline-gray-300 hover:scale-110`,
              )}
              onClick={() => {
                if (elementColorType.includes("background")) {
                  onChange(`bg-${color}`);
                } else if (elementColorType.includes("text")) {
                  onChange(`text-${color}`);
                } else if (elementColorType.includes("border")) {
                  onChange(`border-${color}`);
                }
              }}
            />
          ))}
        </div>
        {children}
      </div>
    );
  } else if (type === "gradient") {
    return (
      <>
        <Select.Root
          defaultValue={gradientDir}
          size="1"
          onValueChange={(g) => {
            setGradientDir(g);
            if (gradient) {
              onChange(`bg-gradient-to-${g} from-${gradient.from} to-${gradient.to}`);
            }
          }}
        >
          <Select.Trigger className="!w-full" />
          <Select.Content>
            <Select.Group>
              <Select.Label>Gradient direction</Select.Label>
              <Select.Item value="t">To top</Select.Item>
              <Select.Item value="b">To bottom</Select.Item>
              <Select.Item value="l">To left</Select.Item>
              <Select.Item value="r">To right</Select.Item>
              <Select.Item value="tl">To top left</Select.Item>
              <Select.Item value="tr">To top right</Select.Item>
              <Select.Item value="bl">To bottom left</Select.Item>
              <Select.Item value="br">To bottom right</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
        <div className={`grid grid-cols-${gradientMixs.length} gap-3 mt-3.5`}>
          {colors.flatMap((color) =>
            gradientMixs
              .map((mix) => ({ from: `${color.from}-${mix[0]}`, to: `${color.to}-${mix[1]}` }))
              .map((color) => (
                <button
                  type="button"
                  key={`${color.from}-${color.to}`}
                  className={tx(
                    "mx-auto h-7 w-7 rounded-full shadow-sm shadow-upstart-300 transition-transform",
                    `bg-gradient-to-${gradientDir} from-${color.from} to-${color.to} hover:scale-110`,
                  )}
                  onClick={() => {
                    onChange(`bg-gradient-to-${gradientDir} from-${color.from} to-${color.to}`);
                    setGradient(color);
                  }}
                />
              )),
          )}
          {children}
        </div>
      </>
    );
  }
}

function makeGradientCombinations(colors: string[]) {
  // combine gradients between each color
  const gradients: { from: string; to: string }[] = [];
  for (let i = 0; i < colors.length; i++) {
    for (let j = i; j < colors.length; j++) {
      // don't mix neutral with other colors
      if (
        (colors[i] === "neutral" && colors[j] !== "neutral") ||
        (colors[i] !== "neutral" && colors[j] === "neutral") ||
        colors[i] !== colors[j]
      ) {
        continue;
      }
      gradients.push({ from: colors[i], to: colors[j] });
    }
  }
  return gradients;
}

function getAvailableColorsAndShadesForElement(elementType: ElementColorType) {
  if (elementType === "page-background") {
    return {
      colors: ["primary", "secondary", "neutral"],
      shades: ["100", "300", "500", "700", "900"],
      colorButtons: [
        { label: "White", value: "#FFFFFF" },
        { label: "Black", value: "#000000" },
      ],
    };
  }
  if (elementType === "background") {
    return {
      colors: ["primary", "secondary", "accent", "neutral"],
      shades: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
      colorButtons: [
        { label: "Reset", value: null },
        { label: "White", value: "#FFFFFF" },
        { label: "Black", value: "#000000" },
        { label: "Transparent", value: "transparent" },
      ],
    };
  }

  if (elementType === "border") {
    return {
      colors: ["primary", "secondary", "accent", "neutral"],
      shades: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
      colorButtons: [
        // { label: "Auto", value: "border-auto" },
        { label: "White", value: "#FFFFFF" },
        { label: "Black", value: "#000000" },
        { label: "Transparent", value: "transparent" },
      ],
    };
  }
  if (elementType === "text") {
    return {
      colors: ["primary", "secondary", "accent", "neutral"],
      shades: ["100", "300", "500", "700", "900"],
      colorButtons: [
        { label: "Reset", value: null },
        { label: "White", value: "#FFFFFF" },
        { label: "Black", value: "#000000" },
      ],
    };
  }
  return {
    colors: ["primary", "secondary", "accent", "neutral"],
    shades: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  };
}

function makeCominations(colors: string[], shades: string[]) {
  return colors.flatMap((color) => shades.map((shade) => `${color}-${shade}`));
}

export const ElementColorPicker: FC<ElementColorPickerProps> = ({
  initialValue,
  elementColorType,
  onChange = () => {},
}) => {
  const defaultColorType = initialValue?.includes("gradient") ? "gradient" : "solid";
  const { colors, shades, colorButtons } = getAvailableColorsAndShadesForElement(elementColorType);

  if (elementColorType === "page-background") {
    return (
      <Tabs.Root defaultValue={defaultColorType}>
        <Inset clip="padding-box" side="top" pb="current">
          <Tabs.List size="1">
            <Tabs.Trigger value="solid" className="!flex-1">
              Solid
            </Tabs.Trigger>
            <Tabs.Trigger value="gradient" className="!flex-1">
              Gradient
            </Tabs.Trigger>
          </Tabs.List>
        </Inset>
        <Tabs.Content value="solid">
          <ColorPillList
            type="solid"
            elementColorType={elementColorType}
            currentColor={initialValue}
            cols={shades.length}
            colors={makeCominations(colors, shades)}
            onChange={onChange}
          >
            <ButtonsBar colorButtons={colorButtons} onChange={onChange} shadesLen={shades.length} />
          </ColorPillList>
        </Tabs.Content>
        <Tabs.Content value="gradient">
          <ColorPillList
            elementColorType={elementColorType}
            currentColor={initialValue}
            type="gradient"
            cols={4}
            colors={makeGradientCombinations(colors)}
            onChange={onChange}
          />
        </Tabs.Content>
      </Tabs.Root>
    );
  }

  if (elementColorType === "border") {
    return (
      <>
        <ColorPillList
          type="solid"
          elementColorType={elementColorType}
          currentColor={initialValue}
          cols={shades.length}
          colors={makeCominations(colors, shades)}
          onChange={onChange}
        >
          <ButtonsBar colorButtons={colorButtons} onChange={onChange} shadesLen={shades.length} />
        </ColorPillList>
      </>
    );
  }
  if (elementColorType === "text") {
    return (
      <ColorPillList
        type="solid"
        elementColorType={elementColorType}
        currentColor={initialValue}
        cols={shades.length}
        colors={makeCominations(colors, shades)}
        onChange={onChange}
      >
        <ButtonsBar colorButtons={colorButtons} onChange={onChange} shadesLen={shades.length} />
      </ColorPillList>
    );
  }

  if (elementColorType === "background") {
    return (
      <Tabs.Root defaultValue={defaultColorType}>
        <Inset clip="padding-box" side="top" pb="current">
          <Tabs.List size="1">
            <Tabs.Trigger value="solid" className="!flex-1">
              Solid
            </Tabs.Trigger>
            <Tabs.Trigger value="gradient" className="!flex-1">
              Gradient
            </Tabs.Trigger>
          </Tabs.List>
        </Inset>
        <Tabs.Content value="solid">
          <ColorPillList
            type="solid"
            elementColorType={elementColorType}
            currentColor={initialValue}
            cols={shades.length}
            colors={makeCominations(colors, shades)}
            onChange={onChange}
          >
            <ButtonsBar colorButtons={colorButtons} onChange={onChange} shadesLen={shades.length} />
          </ColorPillList>
        </Tabs.Content>
        <Tabs.Content value="gradient">
          <ColorPillList
            elementColorType={elementColorType}
            currentColor={initialValue}
            type="gradient"
            cols={4}
            colors={makeGradientCombinations(colors)}
            onChange={onChange}
          />
        </Tabs.Content>
      </Tabs.Root>
    );
  }
  return null;
};

function ButtonsBar({
  colorButtons,
  onChange,
  shadesLen,
}: {
  colorButtons?: { label: string; value: string | null }[];
  onChange: (color: string | null) => void;
  shadesLen: number;
}) {
  if (!colorButtons) return null;
  return (
    <div className={tx(`flex gap-1.5 mt-1 w-full`, `col-span-${shadesLen}`)}>
      {colorButtons.map((button) => (
        <button
          key={button.value}
          type="button"
          onClick={() => onChange(button.value)}
          className="grow h-6 text-xs rounded-lg outline outline-gray-200 hover:outline-gray-300"
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}

/**
 * Generates multiple neutral options from a primary color
 * @param oklchColor - OKLCH color string
 * @returns Object with different neutral relationship options
 */
function generateNeutralOptions(theme: Theme) {
  return {
    primary: {
      default: generateRelatedNeutral(theme.colors.primary, "same-hue"),
    },
    primary_temperature: {
      default: generateRelatedNeutral(theme.colors.primary, "temperature"),
    },
    primary_analogous: {
      default: generateRelatedNeutral(theme.colors.primary, "analogous"),
    },
    primary_complementary: {
      default: generateRelatedNeutral(theme.colors.primary, "complementary"),
    },
    pureGray: {
      default: "oklch(45% 0 0)",
    },
    coolGray: {
      default: "oklch(45% 0.02 240)",
    },
    warmGray: {
      default: "oklch(45% 0.03 40)",
    },
  };
}
