import { TextField } from "@upstart.gg/style-system/system";
import type { FC } from "react";
import type { BaseFieldProps } from "./types";

export const StringField: FC<BaseFieldProps> = ({
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
      <TextField.Root
        id={fieldName}
        value={stringValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={fieldSchema["ui:placeholder"] as string | undefined}
        minLength={fieldSchema.minLength as number | undefined}
        maxLength={fieldSchema.maxLength as number | undefined}
        required={required}
        size="2"
        className="!mt-1"
      />
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
};
