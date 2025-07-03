import type { FC } from "react";
import type { BaseFieldProps } from "./types";

export const NumberField: FC<BaseFieldProps> = ({
  fieldName,
  fieldSchema,
  value,
  onChange,
  title,
  required,
  description,
}) => {
  const numberValue = typeof value === "number" ? value : "";

  return (
    <div className="field-container space-y-2">
      <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700">
        {title} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={fieldName}
        type="number"
        value={numberValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e.target.value;
          onChange(val === "" ? undefined : Number(val));
        }}
        placeholder={fieldSchema["ui:placeholder"] as string | undefined}
        min={fieldSchema.minimum as number | undefined}
        max={fieldSchema.maximum as number | undefined}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
};
