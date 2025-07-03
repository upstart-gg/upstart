import type { FC } from "react";
import type { BaseFieldProps } from "./types";

export const BooleanField: FC<BaseFieldProps> = ({
  fieldName,
  fieldSchema,
  value,
  onChange,
  title,
  required,
  description,
}) => {
  const booleanValue = typeof value === "boolean" ? value : false;

  return (
    <div className="field-container space-y-2">
      <div className="flex items-center space-x-3">
        <input
          id={fieldName}
          type="checkbox"
          checked={booleanValue}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700">
          {title} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
};
