import { css, tx } from "@upstart.gg/style-system/twind";
import { type KeyboardEventHandler, useState } from "react";
import type { MultiValue, Props, SingleValue } from "react-select";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";

type OptionType = {
  label: string;
  value: string;
};

function getClassNames(className?: string): Props<OptionType>["classNames"] {
  const classNames: Props<OptionType>["classNames"] = {
    control: (state) =>
      !state.isFocused
        ? tx(
            "rounded py-[3px] outline outline-transparent bg-white overflow-visible !min-h-full border border-gray-300 max-w-full",
          )
        : tx(
            "rounded py-[3px] outline outline-upstart-500 bg-white overflow-visible !min-h-full border border-gray-300 max-w-full",
          ),
    valueContainer: () => tx("bg-white px-[3px] flex gap-1"),
    singleValue: () => tx("text-sm px-2"),
    multiValueLabel: () => tx("bg-upstart-50 px-2 flex py-0.5 rounded-l"),
    multiValueRemove: () =>
      tx(
        "bg-upstart-100 font-normal text-upstart-400 px-0.5 py-px hover:(bg-red-200 text-gray-700) rounded-r",
      ),
    placeholder: () => tx("text-sm text-gray-500 bg-white py-[2px] px-1"),
    input: () =>
      tx(
        "py-[2px] px-1 text-sm outline-none !focus:outline-none !focus-within:outline-none cursor-text [&>input]:focus:ring-0 [&>input]:focus-within:ring-0",
      ),
    container: () => tx("text-sm min-h-8", className),
    menu: () => tx("text-sm bg-white shadow-2xl rounded py-1"),
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
    indicatorsContainer: () => tx("text-sm pr-1.5 font-normal scale-75"),

    option: (state) =>
      state.isSelected
        ? tx("bg-upstart-100 px-2 py-1.5")
        : tx("bg-white px-2 py-1.5 hover:(bg-upstart-600 text-white)"),
  };

  return classNames;
}

export default function TagsInput({
  initialValue,
  onChange,
  className,
  placeholder,
  isSearchable = false,
}: {
  initialValue: string[];
  onChange: (value: string[]) => void;
  className?: string;
  placeholder?: string;
  isSearchable?: boolean;
}) {
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<readonly OptionType[]>([]);

  const createOption = (label: string) => ({
    label,
    value: label,
  });

  const handleKeyDown: KeyboardEventHandler = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        setValue((prev) => [...prev, createOption(inputValue)]);
        setInputValue("");
        event.preventDefault();
    }
  };

  const components = isSearchable
    ? undefined
    : {
        DropdownIndicator: null,
      };

  return (
    <CreatableSelect
      unstyled
      isMulti
      isClearable={false}
      inputValue={inputValue}
      components={components}
      value={value}
      onChange={(newValue) => setValue(newValue)}
      onInputChange={(newValue) => setInputValue(newValue)}
      onKeyDown={handleKeyDown}
      classNames={getClassNames(className)}
      menuIsOpen={false}
      //   isSearchable={isSearchable}
      placeholder={placeholder}
    />
  );
}

export function TagsSelect({
  initialValue,
  onChange,
  options,
  className,
  placeholder,
  isSearchable = true,
  isMulti = true,
  creatable = false,
  clearable = false,
}: {
  initialValue: string[];
  onChange: (value: string | string[] | undefined) => void;
  className?: string;
  placeholder?: string;
  isSearchable?: boolean;
  options: OptionType[];
  isMulti?: boolean;
  creatable?: boolean;
  clearable?: boolean;
}) {
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState<readonly OptionType[] | OptionType | null>([]);

  const createOption = (label: string) => ({
    label,
    value: label,
  });

  const handleKeyDown: KeyboardEventHandler = (event) => {
    event.stopPropagation();
    if (!inputValue) return;
    switch (event.key) {
      case "Enter":
      case "Tab":
        event.preventDefault();
        setValue((prev) => {
          if (Array.isArray(prev)) {
            return [...prev, createOption(inputValue)];
          } else {
            return createOption(inputValue);
          }
        });
        setInputValue("");
    }
  };

  const components = isSearchable
    ? undefined
    : {
        DropdownIndicator: null,
      };

  return creatable ? (
    <CreatableSelect
      unstyled
      formatCreateLabel={(inputValue) => `Set to "${inputValue}"`}
      isMulti={isMulti}
      isClearable={clearable}
      inputValue={inputValue}
      components={components}
      options={options}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
        if (Array.isArray(newValue)) {
          onChange(newValue.map((v) => v.value));
        } else {
          onChange((newValue as OptionType).value ?? null);
        }
      }}
      onInputChange={(newValue) => setInputValue(newValue)}
      onKeyDown={handleKeyDown}
      classNames={getClassNames(className)}
      //   menuIsOpen={false}
      isSearchable={isSearchable}
      placeholder={placeholder}
    />
  ) : (
    <Select
      unstyled
      isMulti={isMulti}
      isClearable={clearable}
      inputValue={inputValue}
      //   components={components}
      options={options}
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
        if (Array.isArray(newValue)) {
          onChange(newValue.map((v) => v.value));
        } else {
          onChange((newValue as OptionType).value ?? null);
        }
      }}
      onInputChange={(newValue) => setInputValue(newValue)}
      //   onKeyDown={handleKeyDown}
      classNames={getClassNames(className)}
      //   menuIsOpen={false}
      isSearchable={isSearchable}
      placeholder={placeholder}
    />
  );
}
