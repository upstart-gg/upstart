import type { UiSchema, ObjectFieldTemplateProps } from "@rjsf/utils";
import { tx, css } from "@upstart.gg/style-system/twind";
import type { ReactElement } from "react";
import { Fragment } from "react/jsx-runtime";

interface GroupedField {
  content: ReactElement;
  uiSchema?: UiSchema;
  hidden?: boolean;
}
interface GroupedFields {
  [key: string]: GroupedField[];
}
export const ObjectFieldTemplate = (props: ObjectFieldTemplateProps) => {
  const { properties, title } = props;
  const groupTitles: Record<string, string | null> = {};

  // Group fields by their ui:group
  const groupedFields = properties.reduce<GroupedFields>((acc, prop) => {
    const group = (prop.content.props.uiSchema?.["ui:group"] as string) || "other";
    groupTitles[group] = prop.content.props.uiSchema?.["ui:group:title"] || null;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(prop);
    return acc;
  }, {});

  const isRoot = props.idSchema.$id === "root";

  if (!isRoot) {
    return (
      <>
        {title && (
          <h3 className="text-sm font-medium bg-upstart-100 dark:bg-dark-600 px-2 py-1 sticky top-0 z-[999] -mx-3">
            {title}
          </h3>
        )}
        {Object.entries(groupedFields).map(([group, fields]) => (
          <div key={group} className={tx({ "-mx-3": !isRoot })}>
            <div className="object-fields">
              {fields
                .filter((f) => !f.hidden)
                .map((field, index) => (
                  <Fragment key={index}>{field.content}</Fragment>
                ))}
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <div className={tx("rjsf-sections", { "-mx-3": !isRoot })}>
      {title && <h2 className="text-sm bg-upstart-200 dark:bg-dark-700 px-2">{title}</h2>}
      {Object.entries(groupedFields).map(([group, fields]) => (
        <div key={group} className="form-section">
          {/* Render group title only when there is at least one non-hidden element */}
          {fields.some((field) => !field.hidden) && isRoot && groupTitles[group] && (
            <h3 className="text-sm font-medium bg-upstart-100 dark:bg-dark-600 px-2 py-1 sticky top-0 z-[999]">
              {groupTitles[group]}
            </h3>
          )}
          <div className="section-fields">
            {fields.map((field, index) => (
              <Fragment key={index}>{field.content}</Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
