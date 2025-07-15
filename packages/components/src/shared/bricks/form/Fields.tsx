import type { TSchema } from "@sinclair/typebox";
import { isStandardColor } from "@upstart.gg/sdk/shared/themes/color-system";
import { tx } from "@upstart.gg/style-system/twind";
import type { FC } from "react";
import { usePageContext } from "../../hooks/use-page-context";
import { usePageTextColor } from "../../hooks/use-page-text-color";

export interface BaseFieldProps {
  fieldName: string;
  fieldSchema: TSchema;
  value: unknown;
  onChange: (value: unknown) => void;
  title: string;
  required: boolean;
  description?: string;
}

interface GenericFieldProps {
  fieldName: string;
  title: string;
  required: boolean;
  description?: string;
  children: React.ReactNode;
}

const inputClassname =
  "px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-accent-500";

/**
 * Hook to get the raw page text color value for use in style attributes
 */
function usePageTextColorValue() {
  try {
    const { attributes } = usePageContext();
    return isStandardColor(attributes.$textColor) ? (attributes.$textColor as string) : "";
  } catch {
    return "";
  }
}

const GenericFieldComponent: FC<GenericFieldProps> = ({
  fieldName,
  title,
  required,
  description,
  children,
}) => {
  return (
    <div className="flex-1 flex flex-col gap-1">
      <label htmlFor={fieldName} className="text-sm font-medium">
        {title} {required && <span>*</span>}
      </label>
      {/* {description && <p className="text-xs text-gray-500">{description}</p>} */}
      {children}
    </div>
  );
};

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
    <GenericFieldComponent fieldName={fieldName} title={title} required={required} description={description}>
      <div className="flex items-center space-x-3">
        <input
          id={fieldName}
          name={fieldName}
          type="checkbox"
          checked={booleanValue}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          className="h-4 w-4 focus:ring-accent-500 border-gray-300 rounded"
        />
        <label htmlFor={fieldName} className="block text-sm font-medium">
          {title} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
    </GenericFieldComponent>
  );
};

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
  const pageTextColor = usePageTextColor();

  return (
    <GenericFieldComponent fieldName={fieldName} title={title} required={required} description={description}>
      <input
        id={fieldName}
        name={fieldName}
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
        className={tx(
          "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          pageTextColor && `[&::placeholder]:(${pageTextColor} opacity-70)`,
        )}
      />
    </GenericFieldComponent>
  );
};

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
  const pageTextColor = usePageTextColor();
  const pageTextColorValue = usePageTextColorValue();

  // Calculer la largeur minimale basée sur l'option la plus longue
  const longestOption = options.reduce(
    (longest, current) => (current.length > longest.length ? current : longest),
    (fieldSchema["ui:placeholder"] as string) || "Choose an option",
  );

  // Estimer la largeur en caractères (approximation)
  const estimatedWidth = Math.max(longestOption.length * 0.6 + 5, 10); // 0.6em par caractère + padding

  // Forcer le type checkbox s'il n'y a qu'une seule option
  const effectiveWidget = options.length === 1 ? "checkbox" : widget;

  if (effectiveWidget === "checkbox") {
    return (
      <div className="flex-1 flex flex-col gap-1">
        <fieldset>
          <legend className="block text-sm font-medium ">
            {title} {required && <span className="text-red-500">*</span>}
          </legend>
          {/* {description && <p className="text-xs text-gray-500 mt-2">{description}</p>} */}
          <div className="space-y-2 mt-2">
            {options.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name={fieldName}
                  value={option}
                  // checked={stringValue === option}
                  onChange={(e) => onChange(e.target.checked ? e.target.value : "")}
                  required={required}
                  className={tx(
                    "h-4 w-4 focus:ring-accent-500 border-gray-300 rounded",
                    !pageTextColorValue && "accent-accent-500",
                  )}
                  style={pageTextColorValue ? { accentColor: pageTextColorValue } : undefined}
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    );
  }

  if (effectiveWidget === "radio") {
    return (
      <div className="flex-1 flex flex-col gap-1">
        <fieldset>
          <legend className="text-sm font-medium">
            {title} {required && <span className="text-red-500">*</span>}
          </legend>
          {/* {description && <p className="text-xs text-gray-500 mt-2">{description}</p>} */}
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
                  className={tx(
                    "h-4 w-4 focus:ring-accent-500 border-gray-300",
                    !pageTextColorValue && "accent-accent-600",
                  )}
                  style={pageTextColorValue ? { accentColor: pageTextColorValue } : undefined}
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    );
  }

  return (
    <GenericFieldComponent fieldName={fieldName} title={title} required={required} description={description}>
      {/* {description && <p className="text-xs text-gray-500 mt-2">{description}</p>} */}
      <select
        id={fieldName}
        name={fieldName}
        value={stringValue}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
        required={required}
        className={tx(inputClassname, "w-full")}
        style={{ minWidth: `${estimatedWidth}rem` }}
      >
        <option value="" disabled className={tx(pageTextColor && `${pageTextColor} opacity-70`)}>
          {(fieldSchema["ui:placeholder"] as string) ||
            (fieldSchema.description as string) ||
            "Choose an option"}
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </GenericFieldComponent>
  );
};

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
  const pageTextColor = usePageTextColor();

  return (
    <GenericFieldComponent fieldName={fieldName} title={title} required={required} description={description}>
      <input
        id={fieldName}
        name={fieldName}
        type="email"
        value={stringValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={fieldSchema["ui:placeholder"] as string | "email@example.com"}
        required={required}
        className={tx(inputClassname, pageTextColor && `[&::placeholder]:(${pageTextColor} opacity-70)`)}
      />
    </GenericFieldComponent>
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
  const pageTextColor = usePageTextColor();

  return (
    <GenericFieldComponent fieldName={fieldName} title={title} required={required} description={description}>
      <input
        id={fieldName}
        name={fieldName}
        type="url"
        value={stringValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={fieldSchema["ui:placeholder"]}
        required={required}
        className={tx(inputClassname, pageTextColor && `[&::placeholder]:(${pageTextColor} opacity-70)`)}
      />
    </GenericFieldComponent>
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
    <GenericFieldComponent fieldName={fieldName} title={title} required={required} description={description}>
      <input
        id={fieldName}
        name={fieldName}
        type="date"
        value={stringValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        required={required}
        className={inputClassname}
      />
    </GenericFieldComponent>
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
    <GenericFieldComponent fieldName={fieldName} title={title} required={required} description={description}>
      <input
        id={fieldName}
        name={fieldName}
        type="datetime-local"
        value={stringValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        required={required}
        className={inputClassname}
      />
    </GenericFieldComponent>
  );
};

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
  const pageTextColor = usePageTextColor();

  return (
    <GenericFieldComponent fieldName={fieldName} title={title} required={required} description={description}>
      <input
        id={fieldName}
        name={fieldName}
        type="text"
        value={stringValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder={fieldSchema["ui:placeholder"] as string | undefined}
        minLength={fieldSchema.minLength as number | undefined}
        maxLength={fieldSchema.maxLength as number | undefined}
        required={required}
        className={tx(inputClassname, pageTextColor && `[&::placeholder]:(${pageTextColor} opacity-70)`)}
      />
    </GenericFieldComponent>
  );
};

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
  const pageTextColor = usePageTextColor();

  return (
    <GenericFieldComponent fieldName={fieldName} title={title} required={required} description={description}>
      <textarea
        id={fieldName}
        name={fieldName}
        value={stringValue}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        placeholder={fieldSchema["ui:placeholder"] as string | undefined}
        minLength={fieldSchema.minLength as number | undefined}
        maxLength={fieldSchema.maxLength as number | undefined}
        required={required}
        rows={4}
        className={tx(inputClassname, pageTextColor && `[&::placeholder]:(${pageTextColor} opacity-70)`)}
      />
    </GenericFieldComponent>
  );
};
