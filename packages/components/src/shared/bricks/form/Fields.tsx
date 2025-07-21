import type { TSchema } from "@sinclair/typebox";
import { tx } from "@upstart.gg/style-system/twind";
import type { FC } from "react";

export interface BaseFieldProps<T = unknown> {
  fieldName: string;
  fieldSchema: TSchema;
  value: T | unknown;
  onChange: (value: T | unknown) => void;
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

const inputClassname = tx(
  `px-3 py-2 border border-base-200 rounded-md shadow-inset
  focus:(outline-2 outline-offset-0 outline-accent-500 ring-none border-accent-500)
  placeholder:text-inherit placeholder:opacity-70`,
);

const GenericFieldComponent: FC<GenericFieldProps> = ({
  fieldName,
  title,
  required,
  description,
  children,
}) => {
  return (
    <div className="flex-1 flex flex-col gap-1">
      <label htmlFor={fieldName} className="font-medium">
        {title} {required && <span>*</span>}
      </label>
      {/* {description && <p className="text-xs text-gray-500">{description}</p>} */}
      {children}
    </div>
  );
};

export const BooleanField: FC<BaseFieldProps<boolean>> = ({
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
          defaultChecked={booleanValue}
          onChange={(e) => onChange(e.target.checked)}
          required={required}
          className={tx(
            "rounded border border-base-200 focus:outline-none focus:(ring-2 ring-accent-500 border-accent-500) text-accent-500",
          )}
        />
        <label htmlFor={fieldName} className="font-medium">
          {title} {required && <span>*</span>}
        </label>
      </div>
    </GenericFieldComponent>
  );
};

export const NumberField: FC<BaseFieldProps<number>> = ({
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
    <GenericFieldComponent fieldName={fieldName} title={title} required={required} description={description}>
      <input
        id={fieldName}
        name={fieldName}
        type="number"
        value={numberValue}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e.target.value;
          onChange(val === "" ? 0 : Number(val));
        }}
        placeholder={fieldSchema["ui:placeholder"] as string | undefined}
        min={fieldSchema.minimum as number | undefined}
        max={fieldSchema.maximum as number | undefined}
        required={required}
        className={inputClassname}
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
                    "rounded border border-base-200 focus:outline-none focus:(ring-2 ring-accent-500 border-accent-500) text-accent-500",
                  )}
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
          <legend className="font-medium">
            {title} {required && <span>*</span>}
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
                  className="border border-base-200 focus:outline-none focus:(ring-2 ring-accent-500 border-accent-500) text-accent-500"
                />
                <span>{option}</span>
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
        <option value="" disabled>
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
        className={inputClassname}
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
        className={inputClassname}
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
        className={tx(inputClassname)}
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
        className={inputClassname}
      />
    </GenericFieldComponent>
  );
};
