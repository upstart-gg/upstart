/**
 * THIS COMPONENT IS REALLY REALLY DIRTY AND SLOW - We shoukd fix it.
 * I tried to use react-window for performance but encountered issues with scrolling to
 * the selected item because we use groups of items with react-select.
 */

import Select, {
  type GroupHeadingProps,
  type Props,
  createFilter,
  type MenuListProps,
  type OptionProps,
  type GroupBase,
} from "react-select";
import { css } from "@emotion/css";
import { createRef, useMemo, useState } from "react";
import googleFonts from "../../../utils/fonts.json";
import { useTheme } from "~/editor/hooks/use-editor";
import { fontStacks, type FontType } from "@upstart.gg/sdk/shared/theme";
import { type FixedSizeList, FixedSizeList as List, type ListChildComponentProps } from "react-window";
import clsx from "clsx";

type OptionType = {
  label: string;
  value: FontType;
};

type FontPickerProps = {
  initialValue: FontType;
  onChange: (value: FontType) => void;
  fontType: "body" | "heading";
};

function getFontLabel(font: FontType) {
  if (font.type === "stack") {
    return fontStacks.find((f) => f.value === font.family)?.label ?? font.family;
  }
  return font.family;
}

const Option = (props: OptionProps<OptionType>) => {
  const { children, innerProps, getStyles, isSelected } = props;
  // biome-ignore lint/performance/noDelete: <explanation>
  delete props.innerProps.onMouseMove;
  // biome-ignore lint/performance/noDelete: <explanation>
  delete props.innerProps.onMouseOver;
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const className =
    isHovered || isPressed
      ? "bg-upstart-100 px-2 py-1.5"
      : "bg-white px-2 py-1.5 hover:(bg-upstart-600 text-white)";

  return (
    <div
      className={className}
      // style={customStyles as React.CSSProperties}
      role="button"
      id={innerProps.id}
      tabIndex={innerProps.tabIndex}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={innerProps.onClick}
      onKeyDown={innerProps.onKeyDown}
    >
      {children}
    </div>
  );
};

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

const GroupHeading = ({ data }: GroupHeadingProps<OptionType, false>) => {
  // @ts-ignore
  return <div className="px-2 py-1 text-xs bg-gray-200 text-gray-600">{data.group}</div>;
};

const MenuList = (props: MenuListProps<OptionType, false>) => {
  const itemHeight = 30;
  const { options, children, maxHeight, getValue } = props;
  const [value] = getValue();
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const listRef = createRef<FixedSizeList<any>>();

  // const initialOffset = options.indexOf(value) * itemHeight;
  const initialOffset = useMemo(() => {
    let groupIndex = 1;
    let itemsCount = 0;
    // find the index in one of the sub options
    for (const group of options) {
      const index = (group as GroupBase<OptionType>).options.findIndex((opt) => {
        return opt.value.family === value?.value?.family;
      });
      if (index !== -1) {
        return groupIndex * 20 + index * itemHeight + itemsCount * itemHeight;
      }
      groupIndex++;
      itemsCount += (group as GroupBase<OptionType>).options.length;
    }
    return 0;
  }, [value, options]);

  return Array.isArray(children) ? (
    <div>
      <List
        ref={listRef}
        height={maxHeight}
        itemCount={children.length}
        itemSize={itemHeight}
        initialScrollOffset={initialOffset}
        width="100%"
      >
        {({ index, style }: ListChildComponentProps) => <div style={{ ...style }}>{children[index]}</div>}
      </List>
    </div>
  ) : null;
};

export default function FontPicker({ initialValue, onChange, fontType }: FontPickerProps) {
  const [selected, setSelected] = useState(initialValue);
  const allFonts = useFonts(fontType);
  const classNames: Props["classNames"] = {
    control: (state) =>
      !state.isFocused
        ? "outline-none bg-white rounded !min-h-full border border-gray-300"
        : "outline-none bg-white rounded !min-h-full border border-gray-300",
    valueContainer: () => "bg-white px-2.5",
    placeholder: () => "text-sm bg-white",
    input: () =>
      "text-sm outline-none !focus:outline-none !focus-within:outline-none [&>input]:focus:ring-0 [&>input]:focus-within:ring-0",
    container: () => "text-sm h-8",
    menu: () => "text-sm bg-white shadow-2xl rounded py-1",
    menuList: () =>
      css({
        scrollbarColor: "var(--violet-4) var(--violet-2)",
        scrollBehavior: "smooth",
        scrollbarWidth: "thin",
        "&:hover": {
          scrollbarColor: "var(--violet-7) var(--violet-3)",
        },
      }),
    loadingMessage(props) {
      return clsx("text-sm py-2");
    },
    indicatorsContainer: () => "text-sm pr-1.5 font-normal scale-75",

    option: (state) =>
      state.isSelected
        ? clsx("bg-upstart-100 px-2 py-1.5")
        : clsx("bg-white px-2 py-1.5 hover:(bg-upstart-600 text-white)"),
  };

  return (
    <Select<FontType & { label: string }>
      unstyled
      filterOption={createFilter({ ignoreAccents: false, matchFrom: "start", ignoreCase: true })}
      defaultValue={{ ...selected, label: getFontLabel(selected) }}
      onChange={(e) => {
        if (e === null) return;
        // @ts-ignore
        setSelected(e.value);
        // @ts-ignore
        onChange(e.value);
      }}
      // @ts-ignore
      classNames={classNames}
      components={{
        // @ts-ignore
        GroupHeading,
        // Uncomment this to use react-window
        // MenuList, Option
      }}
      // @ts-ignore
      options={allFonts}
    />
  );
}
