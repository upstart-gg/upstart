import type React from "react";
import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type PropsWithChildren } from "react";
import {
  chroma,
  getColorsSuggestions,
  type ColorType,
  type ElementColorType,
  type ElementColor,
  baseColorsLabels,
} from "@upstart.gg/sdk/themes/color-system";
import { Button, TextField, Text, Select, Tabs, Inset } from "@upstart.gg/style-system/system";
import { useEditor, useTheme } from "~/editor/hooks/use-editor";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";
import { tx, css } from "@upstart.gg/style-system/twind";
import { colorPalette } from "@upstart.gg/style-system/colors";

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
  onChange?: (color: string, oklabValues: number[]) => void;
  steps?: number;
}

const BaseColorPicker: React.FC<BaseColorPickerProps> = ({
  colorType,
  initialValue = 120,
  onChange = () => {},
}) => {
  const theme = useTheme();
  const [selectedColor, setSelectedColor] = useState(initialValue);

  // Handle color selection
  const handleColorSelect = (color: string, oklabValues: number[]) => {
    setSelectedColor(color);
    onChange(color, oklabValues);
  };
  return (
    <div>
      <Text as="p" size="2" color="gray" className="!capitalize !font-medium">
        {baseColorsLabels[colorType]}
      </Text>

      {/* Color circles */}
      <div className="grid grid-cols-7 gap-1.5 mt-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-color-upstart-200">
        {Object.entries(colorPalette).map(([colorName, shades], i) =>
          Object.entries(shades)
            .filter((shade) => {
              const shadeInt = parseInt(shade[0], 10);
              return shadeInt >= 200 && shadeInt <= 800;
            })
            .map(([shadeName, color]) => (
              <button
                type="button"
                id={`${colorName}-${shadeName}`}
                key={`${colorName}-${shadeName}`}
                className="w-7 h-7 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  background: color,
                  boxShadow: selectedColor === color ? `0 0 0 2px white, 0 0 0 4px ${color}` : "none",
                }}
                onClick={() => handleColorSelect(color, chroma(color).oklab())}
                aria-label={`Select color ${color}`}
              />
            )),
        )}
      </div>

      {/* Current color display */}
      <div className="flex items-center gap-3 p-2 bg-gray-100 rounded mt-3">
        <div className="w-8 h-8 flex-nowrap rounded-md shadow-sm" style={{ background: selectedColor }} />
        <code className="text-xs font-mono">{selectedColor}</code>
      </div>

      <form
        className="group mt-2"
        onSubmit={(e) => {
          e.preventDefault();
          const color = new FormData(e.currentTarget).get("customColor") as string;
          invariant(color, "Color is required");
          handleColorSelect(color, chroma(color).oklab());
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
        { label: "None", value: null },
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
        { label: "Auto", value: "border-auto" },
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
        { label: "White", value: "#FFFFFF" },
        { label: "Black", value: "#000000" },
      ],
    };
  }
  return {
    colors: ["gray", "primary", "secondary", "accent", "neutral"],
    shades: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  };
}

function makeCominations(colors: string[], shades: string[]) {
  return colors.flatMap((color) => shades.map((shade) => `${color}-${shade}`));
}

export const ElementColorPicker: React.FC<ElementColorPickerProps> = ({
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
