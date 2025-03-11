import type React from "react";
import { useCallback, useEffect, useMemo, useState, type ChangeEvent, type PropsWithChildren } from "react";
import {
  chroma,
  colorAdjustmentBaseValues,
  getColorsSuggestions,
  colorAdjustmentsLuminous,
  colorAdjustmentsSubdued,
  type ColorAdjustment,
  type ColorType,
  type ElementColorType,
  generateVariantClasses,
  type ElementColor,
} from "@upstart.gg/sdk/themes/color-system";
import { tx } from "@upstart.gg/style-system/twind";
import { Button, TextField, Text, Select, Tabs, Inset } from "@upstart.gg/style-system/system";
import { useColorAdjustment, useEditor, useTheme } from "~/editor/hooks/use-editor";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";

interface BaseColorPickerProps {
  colorType: ColorType;
  initialValue?: number | string;
  onChange?: (color: string, oklabValues: number[]) => void;
  steps?: number;
}

const BaseColorPicker: React.FC<BaseColorPickerProps> = ({
  colorType,
  initialValue = 120,
  steps = 81, // Default to 81 colors
  onChange = () => {},
}) => {
  const theme = useTheme();
  const editor = useEditor();
  const colorAdjustment = useColorAdjustment();

  const { lightness, saturation } = useMemo(
    () => colorAdjustmentBaseValues[colorAdjustment][colorType],
    [colorAdjustment, colorType],
  );

  const generateColor = useCallback(
    (hue: number) => {
      try {
        const color = chroma.hsl(hue, saturation / 100, lightness / 100);
        const oklabValues = color.oklab();
        return {
          color: color.hex(),
          oklabValues,
        };
      } catch (error) {
        console.error(`Error generating color for hue: ${hue}`, error);
        return {
          color: "#000000",
          oklabValues: [lightness / 100, 0, 0],
        };
      }
    },
    [lightness, saturation],
  );

  const initialColor = generateColor(
    typeof initialValue === "string" ? chroma(initialValue).hsl()[0] : initialValue,
  );
  const [selectedColor, setSelectedColor] = useState(initialColor.color);
  const suggestions = colorType === "primary" ? [] : getColorsSuggestions(theme.colors.primary, theme);

  const colors = useMemo(() => {
    const spacing = 360 / steps;
    const hues = Array.from({ length: steps }, (_, i) => i * spacing);
    return hues.map((hue) => generateColor(hue));
  }, [generateColor, steps]);

  const suggestedColors = useMemo(() => {
    return suggestions.map(generateColor);
  }, [generateColor, suggestions]);

  // Handle color selection
  const handleColorSelect = (color: string, oklabValues: number[]) => {
    setSelectedColor(color);
    onChange(color, oklabValues);
  };
  return (
    <div>
      <Text as="p" size="2" color="gray" className="!capitalize !font-medium">
        {colorType} color
      </Text>
      <Select.Root
        defaultValue={colorAdjustment}
        size="1"
        onValueChange={(adjustment) => {
          editor.setColorAdjustment(adjustment as ColorAdjustment);
        }}
      >
        <Select.Trigger className="!w-full !mt-2" />
        <Select.Content>
          <Select.Group>
            <Select.Label>Luminous styles</Select.Label>
            {colorAdjustmentsLuminous.map((option) => (
              <Select.Item key={option} value={option}>
                <span className="capitalize">{option} palette</span>
              </Select.Item>
            ))}
          </Select.Group>
          <Select.Group>
            <Select.Label>Subdued styles</Select.Label>
            {colorAdjustmentsSubdued.map((option) => (
              <Select.Item key={option} value={option}>
                <span className="capitalize">{option} palette</span>
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      {/* Color circles */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {colors.map((color, i) => (
          <button
            type="button"
            key={i}
            className="w-6 h-6 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              background: color.color,
              boxShadow: selectedColor === color.color ? `0 0 0 2px white, 0 0 0 4px ${color.color}` : "none",
            }}
            onClick={() => handleColorSelect(color.color, color.oklabValues)}
            aria-label={`Select color ${color.color}`}
          />
        ))}
      </div>

      {/* Current color display */}
      <div className="flex items-center gap-3 p-2 bg-gray-100 rounded mt-3">
        <div className="w-8 h-8 rounded-md shadow-sm" style={{ background: selectedColor }} />
        <code className="text-sm font-mono">{selectedColor}</code>
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
        <div className={tx("flex text-sm gap-x-1")}>
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
        </div>
      </form>
    </div>
  );
};

export default BaseColorPicker;

interface ElementColorPickerProps {
  elementColorType: ElementColorType;
  initialValue?: ElementColor;
  onChange?: (color: ElementColor) => void;
}

type ColorPillListProps =
  | {
      type: "solid";
      elementColorType: ElementColorType;
      colors: string[];
      cols: number;
      onChange: (color: ElementColor) => void;
      currentColor?: ElementColor;
    }
  | {
      type: "gradient";
      elementColorType: ElementColorType;
      colors: { from: string; to: string }[];
      cols: number;
      onChange: (color: ElementColor) => void;
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

  function getInitialGradientDir() {
    const match = currentColor?.match(/to-(\w+)/);
    if (match) {
      return match[1];
    }
    return "t";
  }

  if (type === "solid") {
    return (
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
              onChange(`var(--color-${color})`);
            }}
          />
        ))}
        {children}
      </div>
    );
  } else if (type === "gradient") {
    const mixs = [
      ["50", "200"],
      ["200", "400"],
      ["400", "600"],
      ["600", "800"],
      ["800", "900"],
    ];
    return (
      <>
        <Select.Root
          defaultValue={gradientDir}
          size="1"
          onValueChange={(g) => {
            setGradientDir(g);
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
        <div className={`grid grid-cols-${mixs.length} gap-3 mt-3.5`}>
          {colors.flatMap((color) =>
            mixs
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

export const ElementColorPicker: React.FC<ElementColorPickerProps> = ({
  initialValue,
  elementColorType,
  onChange = () => {},
}) => {
  const defaultColorType = initialValue?.includes("gradient") ? "gradient" : "solid";
  function makeCominations(colors: string[], shades: string[]) {
    return colors.flatMap((color) => shades.map((shade) => `${color}-${shade}`));
  }

  function makeGradientCombinations(colors: string[]) {
    // combine gradients between each color
    const gradients: { from: string; to: string }[] = [];
    for (let i = 0; i < colors.length; i++) {
      for (let j = i; j < colors.length; j++) {
        // don't mix neutral with other colors
        if (
          (colors[i] === "neutral" && colors[j] !== "neutral") ||
          (colors[i] !== "neutral" && colors[j] === "neutral")
        ) {
          continue;
        }
        gradients.push({ from: colors[i], to: colors[j] });
      }
    }
    return gradients;
  }

  if (elementColorType === "page-background") {
    const colors = ["primary", "secondary", "accent", "neutral"];
    const shades = ["100", "300", "500", "700", "900"];

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
            <div className={tx(`flex gap-1 mt-1 justify-between`, `col-span-${shades.length}`)}>
              <button
                type="button"
                onClick={() => onChange("transparent")}
                className="flex-1 h-6 text-xs rounded-md outline outline-gray-200 hover:outline-gray-300 bg-white"
              >
                Transparent
              </button>
              <button
                type="button"
                onClick={() => onChange("#FFFFFF")}
                className="flex-1 h-6 text-xs rounded-md outline outline-gray-200 hover:outline-gray-300 bg-white"
              >
                White
              </button>
              <button
                type="button"
                onClick={() => onChange("#000000")}
                className="flex-1 h-6 text-xs rounded-md outline outline-gray-200 hover:outline-gray-300 bg-white"
              >
                Black
              </button>
            </div>
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

  if (elementColorType === "page-text") {
    const colors = ["gray", "neutral"];
    const shades = ["50", "100", "800", "900"];

    return (
      <ColorPillList
        type="solid"
        elementColorType={elementColorType}
        currentColor={initialValue}
        cols={shades.length}
        colors={makeCominations(colors, shades)}
        onChange={onChange}
      >
        <div className={tx(`flex gap-3 mt-1`, `col-span-${shades.length}`)}>
          <button
            type="button"
            onClick={() => onChange("#FFFFFF")}
            className="flex-1 h-6 col-span-3 text-xs rounded-lg
          outline outline-gray-200 hover:outline-gray-300 bg-white"
          >
            White
          </button>
          <button
            type="button"
            onClick={() => onChange("#000000")}
            className="flex-1 h-6 col-span-3 text-xs rounded-lg
          outline outline-gray-200 hover:outline-gray-300 bg-black"
          >
            Black
          </button>
        </div>
      </ColorPillList>
    );
  }

  if (elementColorType === "border") {
    const colors = ["gray", "primary", "secondary", "accent", "neutral"];
    const shades = ["100", "200", "300", "400"];

    return (
      <ColorPillList
        type="solid"
        elementColorType={elementColorType}
        currentColor={initialValue}
        cols={shades.length}
        colors={makeCominations(colors, shades)}
        onChange={onChange}
      />
    );
  }
  if (elementColorType === "text") {
    const colors = ["gray", "primary", "secondary", "accent", "neutral"];
    const shades = ["100", "300", "500", "700", "900"];

    return (
      <ColorPillList
        type="solid"
        elementColorType={elementColorType}
        currentColor={initialValue}
        cols={shades.length}
        colors={makeCominations(colors, shades)}
        onChange={onChange}
      />
    );
  }

  if (elementColorType === "background") {
    const colors = ["primary", "secondary", "neutral"];
    const shades = ["50", "100", "200"];

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
          />
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
  return <div>Element color picker "{elementColorType}"</div>;
};
