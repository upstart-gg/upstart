import type { FC } from "react";
import type { BaseFieldProps } from "./types";

export const EmailField: FC<BaseFieldProps> = ({
  fieldName,
  fieldSchema,
  value,
  onChange,
  title,
  required,
  description,
}) => {
  const stringValue = typeof value === "string" ? value : "";

  return (
    <div className="field-container space-y-2">
      <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700">
        {title} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={fieldName}
        type="email"
        value={stringValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={fieldSchema["ui:placeholder"] as string | "email@example.com"}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
};

export const UrlField: FC<BaseFieldProps> = ({
  fieldName,
  fieldSchema,
  value,
  onChange,
  title,
  required,
  description,
}) => {
  const stringValue = typeof value === "string" ? value : "";

  return (
    <div className="field-container space-y-2">
      <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700">
        {title} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={fieldName}
        type="url"
        value={stringValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={fieldSchema["ui:placeholder"] as string | "https://example.com"}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
};

export const DateField: FC<BaseFieldProps> = ({
  fieldName,
  fieldSchema,
  value,
  onChange,
  title,
  required,
  description,
}) => {
  const stringValue = typeof value === "string" ? value : "";

  return (
    <div className="field-container space-y-2">
      <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700">
        {title} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={fieldName}
        type="date"
        value={stringValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
};

export const DateTimeField: FC<BaseFieldProps> = ({
  fieldName,
  fieldSchema,
  value,
  onChange,
  title,
  required,
  description,
}) => {
  const stringValue = typeof value === "string" ? value : "";

  return (
    <div className="field-container space-y-2">
      <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700">
        {title} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={fieldName}
        type="datetime-local"
        value={stringValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
};
