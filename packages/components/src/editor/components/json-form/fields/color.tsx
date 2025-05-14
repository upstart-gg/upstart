import { IconButton, Popover, Text } from "@upstart.gg/style-system/system";
import transSvg from "./trans.svg?url";
import {
  isStandardColor,
  type ColorType,
  type ElementColor,
  type ElementColorType,
} from "@upstart.gg/sdk/shared/themes/color-system";
import BaseColorPicker, { ElementColorPicker } from "~/editor/components/ColorPicker";
import type { FieldProps } from "./types";
import { IoCloseOutline } from "react-icons/io5";
import { fieldLabel } from "../form-class";
import { FieldTitle } from "../field-factory";
import { tx, css } from "@upstart.gg/style-system/twind";

const ColorField: React.FC<FieldProps<string | undefined> & { hideColorLabel?: boolean }> = (props) => {
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
      hideColorLabel={props.hideColorLabel}
    />
  );
};

type ColorFieldRowProps = {
  name?: string;
  labelClassName?: string;
  description?: string;
  required?: boolean;
  showReset?: boolean;
  labelPlacement?: "left" | "right";
  hideColorLabel?: boolean;
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
  hideColorLabel,
  labelPlacement = "left",
}: ColorFieldRowProps) {
  return (
    <div
      className={tx("color-field flex-1 flex items-center", {
        "justify-between": labelPlacement === "left",
        "justify-start gap-1.5": labelPlacement === "right",
      })}
    >
      {labelPlacement === "left" && <FieldTitle title={name} description={description} />}
      {colorType && (
        <ColorBasePreviewPill
          onChange={onChange}
          colorType={colorType}
          color={color}
          showReset={showReset}
          hideColorLabel={hideColorLabel}
        />
      )}
      {elementColorType && (
        <ColorElementPreviewPill
          onChange={onChange}
          elementColorType={elementColorType}
          color={color}
          showReset={showReset}
          hideColorLabel={hideColorLabel}
        />
      )}
      {labelPlacement === "right" && <FieldTitle title={name} description={description} />}
    </div>
  );
}

type ColorElementPreviewPillProps = {
  color?: ElementColor;
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  elementColorType: ElementColorType;
  showReset?: boolean;
  hideColorLabel?: boolean;
  onChange: (newVal: ElementColor | null) => void;
};

function formatColorName(color?: ElementColor) {
  if (!color) {
    return "transparent";
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
  if (color.startsWith("bg-")) {
    return color.substring(3);
  }
  if (color.startsWith("var(")) {
    return color
      .substring(6, color.length - 1)
      .replace("color", "")
      .replace(/-+/, "");
  }
  return color;
}

function getColorPillBackgroundClass(color: string) {
  if (isStandardColor(color)) {
    return css({ backgroundColor: `${color}` });
  }
  if (color.startsWith("bg-")) {
    return color;
  }
  if (color.match(/^(border|text|shadow)-/)) {
    return color.replace(/^(border|text|shadow)-/, "bg-");
  }
  return `bg-${color}`;
}

function ColorElementPreviewPill({
  color,
  onChange,
  elementColorType,
  side = "bottom",
  align = "end",
  showReset,
  hideColorLabel,
}: ColorElementPreviewPillProps) {
  const pillBgFile = color === "transparent" ? `url("${transSvg}")` : "none";
  const backgroundSize = color === "transparent" ? "12px 12px" : "auto";

  return (
    <Popover.Root>
      <Popover.Trigger>
        <div className="flex items-center gap-2 font-normal">
          {!hideColorLabel && formatColorName(color)}
          <button
            type="button"
            data-color={color}
            data-element-color-type={elementColorType}
            className={tx(
              "rounded-full w-6 h-6 ring ring-transparent hover:ring-upstart-400 border border-gray-200",
              getColorPillBackgroundClass(color ?? "bg-transparent"),
              !color?.includes("gradient") &&
                css({
                  backgroundImage: pillBgFile,
                }),
              css({
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
  hideColorLabel?: boolean;
  onChange: (newVal: string) => void;
};

function ColorBasePreviewPill({
  color,
  onChange,
  colorType,
  side = "bottom",
  align = "center",
  showReset,
  hideColorLabel,
}: ColorBasePreviewPillProps) {
  const pillBgFile = color === "transparent" ? `url("${transSvg}")` : "none";
  const backgroundSize = color === "transparent" ? "100% 100%" : "auto";
  return (
    <Popover.Root>
      <Popover.Trigger>
        <div className="flex items-center gap-2">
          {!hideColorLabel && formatColorName(color)}
          <button
            type="button"
            className={tx(
              "rounded-full w-6 h-6 ring ring-transparent hover:ring-upstart-400 border border-gray-200",
              getColorPillBackgroundClass(color ?? "bg-transparent"),
              !color?.includes("gradient") &&
                css({
                  backgroundImage: pillBgFile,
                }),
              css({
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
  const width = "240px";
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
      width = "310px";
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
