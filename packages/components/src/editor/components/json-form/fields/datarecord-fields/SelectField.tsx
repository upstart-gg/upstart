import type { FC } from "react";
import type { BaseFieldProps } from "./types";

export const SelectField: FC<BaseFieldProps> = ({
  fieldName,
  fieldSchema,
  value,
  onChange,
  title,
  required,
  description,
}) => {
  const options = (fieldSchema.enum as string[]) || [];
  const stringValue = typeof value === "string" ? value : "";
  const widget = fieldSchema.metadata?.["ui:widget"] as "checkbox" | "radio" | "select" | undefined;

  // Forcer le type checkbox s'il n'y a qu'une seule option
  const effectiveWidget = options.length === 1 ? "checkbox" : widget;

  if (effectiveWidget === "checkbox") {
    return (
      <div className="field-container space-y-2">
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700">
            {title} {required && <span className="text-red-500">*</span>}
          </legend>
          <div className="space-y-2 mt-2">
            {options.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={fieldName}
                  value={option}
                  checked={stringValue === option}
                  onChange={(e) => onChange(e.target.checked ? e.target.value : "")}
                  required={required}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {description && <p className="text-xs text-gray-500 mt-2">{description}</p>}
      </div>
    );
  }

  if (effectiveWidget === "radio") {
    return (
      <div className="field-container space-y-2">
        <fieldset>
          <legend className="block text-sm font-medium text-gray-700">
            {title} {required && <span className="text-red-500">*</span>}
          </legend>
          <div className="space-y-2 mt-2">
            {options.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={fieldName}
                  value={option}
                  checked={stringValue === option}
                  onChange={(e) => onChange(e.target.value)}
                  required={required}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {description && <p className="text-xs text-gray-500 mt-2">{description}</p>}
      </div>
    );
  }

  return (
    <div className="field-container space-y-2">
      <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700">
        {title} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        id={fieldName}
        value={stringValue}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="" disabled>
          {(fieldSchema["ui:placeholder"] as string) ||
            (fieldSchema.description as string) ||
            "Sélectionnez une option"}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
};
