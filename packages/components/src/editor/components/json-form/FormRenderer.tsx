import { useMemo } from "react";
import { tx, css } from "@upstart.gg/style-system/twind";
import type { TObject, TProperties, TSchema } from "@sinclair/typebox";
import { sortJsonSchemaProperties } from "~/shared/utils/sort-json-schema-props";
import { processObjectSchemaToFields } from "./field-factory";

interface FormRendererProps {
  brickId?: string;
  formSchema: TObject<TProperties>;
  formData: Record<string, unknown>;
  onChange: (data: Record<string, unknown>, id: string) => void;
  onSubmit?: (data: Record<string, unknown>) => void;
  submitButtonLabel?: string;
  filter?: (field: TSchema) => boolean;
  previewMode?: string;
  parents?: string[];
}

interface FormGroupProps {
  groupTitle: string;
  groupName: string;
  children: React.ReactNode;
}

const FormGroup: React.FC<FormGroupProps> = ({ groupTitle, groupName, children }) => {
  return (
    <>
      <h3
        className={tx(
          "text-sm font-semibold !dark:bg-dark-600 bg-upstart-100 px-2 py-1 sticky top-0 z-[999] -mx-3",
        )}
      >
        {groupTitle}
      </h3>
      <div
        className={tx("form-group flex flex-col gap-3", css`&:not(:has(div)) { display: none; }`)}
        data-group={groupName}
      >
        {children}
      </div>
    </>
  );
};

/**
 * FormRenderer component that renders form fields based on schema
 */
export function FormRenderer({
  brickId,
  formSchema,
  formData,
  onChange,
  onSubmit,
  submitButtonLabel,
  filter,
  previewMode,
  parents = [],
}: FormRendererProps) {
  // Sort and process the form schema
  const sortedSchema = useMemo(() => sortJsonSchemaProperties(formSchema), [formSchema]);

  // Generate field components in a structured way
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const formStructure = useMemo(() => {
    const fields = processObjectSchemaToFields({
      schema: sortedSchema,
      formData,
      formSchema,
      onChange,
      options: {
        brickId,
        filter,
        parents,
      },
    });

    // Handle nested object fields (we need to add recursive FormRenderer components)
    Object.entries(sortedSchema.properties).forEach(([fieldName, fieldSchema]) => {
      const field = fieldSchema;

      // Skip non-object fields or filtered fields
      if (filter && field.type !== "object" && !filter(field)) {
        console.log("Skipping field", field);
        return;
      }

      // Build field ID
      const id = parents.length ? `${parents.join(".")}.${fieldName}` : fieldName;

      // Create recursive FormRenderer for object fields
      fields.push(
        <FormRenderer
          key={`object-${id}`}
          brickId={brickId}
          formSchema={field as TObject<TProperties>}
          formData={formData}
          onChange={onChange}
          onSubmit={onSubmit}
          submitButtonLabel={submitButtonLabel}
          filter={filter}
          previewMode={previewMode}
          parents={[...parents, fieldName]}
        />,
      );
    });

    return fields;
  }, [
    sortedSchema,
    formSchema,
    brickId,
    formData,
    filter,
    onChange,
    onSubmit,
    submitButtonLabel,
    parents,
    previewMode,
  ]);

  console.log({ formStructure });

  return formStructure;
  // Render the form with all groups and fields
  // return (
  //   <>
  //     {formStructure
  //       .map((fields, id) => (
  //         <FormGroup key={`group-id`} groupName={groupName} groupTitle={title}>
  //           {fields}
  //         </FormGroup>
  //       ))}
  //   </>
  // );
}
