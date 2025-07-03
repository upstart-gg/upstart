import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/form.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx } from "@upstart.gg/style-system/twind";
import { forwardRef } from "react";
import { DatarecordForm } from "../../editor/components/json-form/DatarecordForm";
import { useDatarecord } from "../../editor/hooks/use-datarecord";

const WidgetForm = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  const { brick } = props;
  const {
    title,
    intro,
    datarecordId,
    align = "vertical",
    padding,
    backgroundColor,
    color,
    buttonLabel,
  } = brick.props;

  const { datarecord, schema, error } = useDatarecord(datarecordId);

  if (error) {
    return (
      <div ref={ref} className="p-4 border border-red-200 bg-red-50 text-red-600 rounded">
        Error loading datarecord: {error.message}
      </div>
    );
  }

  if (!datarecord || !schema) {
    return (
      <div ref={ref} className="p-4 border border-gray-200 bg-gray-50 text-gray-600 rounded">
        {datarecordId ? "Loading datarecord..." : "Please select a datarecord to display the form"}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={tx("max-w-full")}
      style={{
        padding,
        backgroundColor,
        color,
      }}
    >
      {title && <h2 className="form-title text-xl font-semibold mb-4">{title}</h2>}
      {intro && <p className="form-intro text-gray-600 mb-6">{intro}</p>}

      <div className={tx(align === "horizontal" ? "space-x-4" : "space-y-4")}>
        <DatarecordForm
          schema={schema}
          onSubmit={(data) => {
            console.log("Form submitted:", data);
            // TODO: Implémenter la logique de soumission
          }}
          showSubmitButton={true}
          buttonLabel={buttonLabel}
        />
      </div>
    </div>
  );
});

export default WidgetForm;
