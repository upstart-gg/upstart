import type { FieldProps } from "./types";
import { FieldTitle } from "../field-factory";
import { Button } from "@upstart.gg/style-system/system";
import { useEditorHelpers } from "~/editor/hooks/use-editor";

export default function SiteQueriesField(props: FieldProps<unknown>) {
  const { currentValue, onChange, schema, title, description } = props;
  const editorHelpers = useEditorHelpers();

  return (
    <div className="flex site-queries-field justify-between flex-1 gap-1 flex-wrap">
      <FieldTitle title={title} description={description} />
      <Button
        variant="soft"
        size="1"
        radius="full"
        type="button"
        onClick={() => {
          editorHelpers.toggleModal("queries");
        }}
      >
        Manage site queries
      </Button>
    </div>
  );
}
