import { TextArea } from "@upstart.gg/style-system/system";
import type { FC } from "react";
import type { BaseFieldProps } from "./types";

export const TextareaField: FC<BaseFieldProps> = ({
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
    <div className="field-container">
      <label htmlFor={fieldName} className="block text-sm font-medium text-gray-700">
        {title} {required && <span className="text-red-500">*</span>}
      </label>
      <TextArea
        id={fieldName}
        value={stringValue}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        placeholder={fieldSchema["ui:placeholder"] as string | undefined}
        minLength={fieldSchema.minLength as number | undefined}
        maxLength={fieldSchema.maxLength as number | undefined}
        required={required}
        resize="vertical"
        size="2"
        rows={4}
        className="!mt-1"
      />
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
};
