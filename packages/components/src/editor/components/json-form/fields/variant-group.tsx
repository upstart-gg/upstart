import { Select } from "@upstart.gg/style-system/system";
import type { FC } from "react";
import { FieldTitle } from "../field-factory";
import type { FieldProps } from "./types";

interface VariantOption {
  const: string;
  title: string;
  "ui:variant-type"?: string;
}

interface VariantGroup {
  [key: string]: VariantOption[];
}

const VariantGroupField: FC<FieldProps<string[]>> = ({
  currentValue = [],
  onChange,
  title,
  description,
  schema,
}) => {
  // Extract options from schema (array of Union items)
  const schemaItems = schema.items as { anyOf?: VariantOption[]; "ui:grid-cols"?: number };
  const options: VariantOption[] = schemaItems?.anyOf || [];
  const gridCols = schemaItems?.["ui:grid-cols"];

  // Group options by variant type
  const variantGroups: VariantGroup = options.reduce((acc, option) => {
    const variantType = option["ui:variant-type"] || "other";
    if (!acc[variantType]) {
      acc[variantType] = [];
    }
    acc[variantType].push(option);
    return acc;
  }, {} as VariantGroup);

  // Get current value for a specific variant type
  const getCurrentValueForType = (variantType: string): string | undefined => {
    const typeOptions = variantGroups[variantType] || [];
    return currentValue.find((value) => typeOptions.some((option) => option.const === value));
  };

  // Handle change for a specific variant type
  const handleTypeChange = (variantType: string, newValue: string | null) => {
    const typeOptions = variantGroups[variantType] || [];
    const typeValues = typeOptions.map((option) => option.const);

    // Remove all values of this type
    const newCurrentValue = currentValue.filter((value) => !typeValues.includes(value));

    // Add new value if it's not null/empty and not the special "none" value
    if (newValue && newValue !== "" && newValue !== "__none__") {
      newCurrentValue.push(newValue);
    }

    onChange(newCurrentValue);
  };

  // Capitalize first letter for display
  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="flex flex-col flex-1 gap-4">
      <FieldTitle title={title} description={description} />

      <div className={gridCols ? `grid grid-cols-${gridCols} gap-4` : "flex flex-col gap-4"}>
        {Object.entries(variantGroups).map(([variantType, typeOptions]) => {
          const currentValueForType = getCurrentValueForType(variantType);

          return (
            <div
              key={variantType}
              className={gridCols ? "flex flex-col gap-1" : "flex justify-between flex-1 pr-1 gap-1"}
            >
              <label
                className={
                  gridCols
                    ? "block text-sm font-medium text-gray-700"
                    : "block text-sm font-medium text-gray-700 min-w-0 flex-shrink-0"
                }
              >
                {capitalizeFirst(variantType)}
              </label>

              <Select.Root
                value={currentValueForType || "__none__"}
                onValueChange={(value) => handleTypeChange(variantType, value || null)}
              >
                <Select.Trigger
                  radius="large"
                  variant="ghost"
                  placeholder="None"
                  className={gridCols ? "w-full" : "min-w-0 flex-1"}
                />
                <Select.Content position="popper">
                  <Select.Group>
                    {/* Option to clear/reset */}
                    <Select.Item value="__none__">
                      <span className="text-gray-400 italic">Default</span>
                    </Select.Item>

                    {/* Type-specific options */}
                    {typeOptions.map((option) => (
                      <Select.Item key={option.const} value={option.const}>
                        {option.title}
                      </Select.Item>
                    ))}
                  </Select.Group>
                </Select.Content>
              </Select.Root>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VariantGroupField;
