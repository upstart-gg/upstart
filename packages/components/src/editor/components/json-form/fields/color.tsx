import { IconButton, Popover, Text } from "@upstart.gg/style-system/system";
import { tx, css } from "@upstart.gg/style-system/twind";
import transSvg from "./trans.svg?url";
import type { ColorType, ElementColor, ElementColorType } from "@upstart.gg/sdk/shared/themes/color-system";
import BaseColorPicker, { ElementColorPicker } from "~/editor/components/ColorPicker";
import type { FieldProps } from "./types";
import { IoCloseOutline } from "react-icons/io5";
import { fieldLabel } from "../form-class";

const ColorField: React.FC<FieldProps<string | undefined>> = (props) => {
  const { schema, onChange, formSchema: formContext, currentValue, title, description } = props;
  const elementColorType = (schema["ui:color-type"] ??
    "page-background") as ColorElementPreviewPillProps["elementColorType"];

  return (
    <ColorFieldRow
      name={title}
      description={description}
      color={currentValue}
      required={schema.required}
      onChange={onChange}
      elementColorType={elementColorType}
    />
  );
};

type ColorFieldRowProps = {
  name?: string;
  labelClassName?: string;
  description?: string;
  required?: boolean;
  showReset?: boolean;
} & (
  | {
      color?: string;
      colorType?: ColorBasePreviewPillProps["colorType"];
      onChange: ColorBasePreviewPillProps["onChange"];
      elementColorType?: never;
    }
  | {
      color?: ElementColor;
      colorType?: never;
      elementColorType?: ColorElementPreviewPillProps["elementColorType"];
      onChange: ColorElementPreviewPillProps["onChange"];
    }
);

export function ColorPill({ colorType, elementColorType, color, onChange }: ColorFieldRowProps) {
  return (
    <>
      {colorType && <ColorBasePreviewPill onChange={onChange} colorType={colorType} color={color} />}
      {elementColorType && (
        <ColorElementPreviewPill onChange={onChange} elementColorType={elementColorType} color={color} />
      )}
    </>
  );
}

export function ColorFieldRow({
  name,
  description,
  color,
  required,
  labelClassName,
  onChange,
  colorType,
  showReset,
  elementColorType,
}: ColorFieldRowProps) {
  return (
    <div className="color-field flex-1 flex items-center justify-between">
      {name && (
        <div className="flex-1">
          <label className={fieldLabel}>{name}</label>
          {description && (
            <Text as="p" color="gray">
              {description}
            </Text>
          )}
        </div>
      )}
      {colorType && (
        <ColorBasePreviewPill onChange={onChange} colorType={colorType} color={color} showReset={showReset} />
      )}
      {elementColorType && (
        <ColorElementPreviewPill
          onChange={onChange}
          elementColorType={elementColorType}
          color={color}
          showReset={showReset}
        />
      )}
    </div>
  );
}

type ColorElementPreviewPillProps = {
  color?: ElementColor;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  elementColorType: ElementColorType;
  showReset?: boolean;
  onChange: (newVal: ElementColor) => void;
};

function formatColorName(color?: ElementColor) {
  if (!color) {
    return "transparent";
  }
  if (color === "color-auto") {
    return "auto";
  }
  if (color === "#FFFFFF") {
    return "white";
  }
  if (color === "#000000") {
    return "black";
  }
  if (color.includes("bg-gradient")) {
    return "gradient";
  }
  if (color.startsWith("preset-")) {
    return "preset";
  }
  if (color.startsWith("border-")) {
    return color.substring(7);
  }
  if (color.startsWith("var(")) {
    return color
      .substring(6, color.length - 1)
      .replace("color", "")
      .replace(/-+/, "");
  }
  return color;
}

function ColorElementPreviewPill({
  color,
  onChange,
  elementColorType,
  side = "bottom",
  align = "end",
  showReset,
}: ColorElementPreviewPillProps) {
  const pillBgFile = color === "transparent" ? `url("${transSvg}")` : "none";
  const backgroundSize = color === "transparent" ? "12px 12px" : "auto";

  return (
    <Popover.Root>
      <Popover.Trigger>
        <div className="flex items-center gap-2 font-normal">
          {formatColorName(color)}
          <button
            type="button"
            data-color={color}
            data-element-color-type={elementColorType}
            className={tx(
              "rounded-full w-6 h-6 ring ring-transparent hover:ring-upstart-400 border border-gray-200",
              css({
                backgroundImage: pillBgFile,
                backgroundColor: color === "transparent" ? "transparent" : color,
                backgroundSize,
                backgroundPosition: "center",
              }),
            )}
          />
          {showReset && (
            <IconButton
              title="Reset"
              size="1"
              variant="ghost"
              color="gray"
              onClick={() => onChange("transparent")}
            >
              <IoCloseOutline />
            </IconButton>
          )}
        </div>
      </Popover.Trigger>
      <ColorElementPopover
        elementColorType={elementColorType}
        side={side}
        align={align}
        color={color}
        onChange={onChange}
      />
    </Popover.Root>
  );
}

type ColorBasePreviewPillProps = {
  color?: string;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  colorType: ColorType;
  showReset?: boolean;
  onChange: (newVal: string) => void;
};

function ColorBasePreviewPill({
  color,
  onChange,
  colorType,
  side = "bottom",
  align = "center",
  showReset,
}: ColorBasePreviewPillProps) {
  const pillBgFile = color === "transparent" ? `url("${transSvg}")` : "none";
  const backgroundSize = color === "transparent" ? "100% 100%" : "auto";
  return (
    <Popover.Root>
      <Popover.Trigger>
        <div className="flex items-center gap-2">
          {formatColorName(color)}
          <button
            type="button"
            className={tx(
              "rounded-full w-6 h-6 ring ring-transparent hover:ring-upstart-400 border border-gray-200",
              css({
                backgroundImage: pillBgFile,
                backgroundColor: color === "transparent" ? "transparent" : color,
                backgroundSize,
              }),
            )}
          />
          {showReset && (
            <IconButton
              title="Reset"
              size="1"
              variant="ghost"
              color="gray"
              onClick={() => onChange("transparent")}
            >
              <IoCloseOutline />
            </IconButton>
          )}
        </div>
      </Popover.Trigger>
      <ColorBasePopover colorType={colorType} side={side} align={align} color={color} onChange={onChange} />
    </Popover.Root>
  );
}

function ColorBasePopover({
  colorType,
  side,
  align,
  color,
  onChange,
}: Pick<ColorBasePreviewPillProps, "align" | "side" | "color" | "colorType" | "onChange">) {
  const width = "300px";
  return (
    <Popover.Content width={width} side={side} align={align} maxWidth={width}>
      <BaseColorPicker colorType={colorType} initialValue={color} onChange={onChange} />
    </Popover.Content>
  );
}

function ColorElementPopover({
  elementColorType,
  side,
  align,
  color,
  onChange,
}: Pick<ColorElementPreviewPillProps, "align" | "side" | "color" | "elementColorType" | "onChange">) {
  let width = "398px";
  switch (elementColorType) {
    case "page-background":
    case "background":
      width = "310px";
      break;
    case "border":
      width = "186px";
      break;
    case "text":
      width = "216px";
      break;
  }
  return (
    <Popover.Content width={width} side={side} align={align} maxWidth={width}>
      <ElementColorPicker elementColorType={elementColorType} initialValue={color} onChange={onChange} />
    </Popover.Content>
  );
}

export default ColorField;
