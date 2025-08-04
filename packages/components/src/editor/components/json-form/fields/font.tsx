/**
 * THIS COMPONENT IS REALLY REALLY DIRTY AND SLOW - We shoukd fix it.
 * I tried to use react-window for performance but encountered issues with scrolling to
 * the selected item because we use groups of items with react-select.
 *
 * TODO: use tanstack virtual for better performance
 */

import Select, { type GroupHeadingProps, type Props, createFilter } from "react-select";
import { useState } from "react";
import type { FontType } from "@upstart.gg/sdk/shared/theme";
import { tx, css } from "@upstart.gg/style-system/twind";
import { getFontLabel, useFonts } from "~/editor/hooks/use-fonts";

type OptionType = {
  label: string;
  value: FontType;
};

type FontPickerProps = {
  initialValue: FontType;
  onChange: (value: FontType) => void;
  fontType: "body" | "heading";
};

const GroupHeading = ({ data }: GroupHeadingProps<OptionType, false>) => {
  // @ts-ignore
  return <div className="px-2 py-1 text-xs bg-gray-200 text-gray-600">{data.group}</div>;
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
      return tx("text-sm py-2");
    },
    indicatorsContainer: () => "text-sm pr-1.5 font-normal scale-75",

    option: (state) =>
      state.isSelected
        ? tx("bg-upstart-100 px-2 py-1.5")
        : tx("bg-white px-2 py-1.5 hover:(bg-upstart-600 text-white)"),
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
