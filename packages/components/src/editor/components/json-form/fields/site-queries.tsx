import type { FieldProps } from "./types";
import type { BorderSettings } from "@upstart.gg/sdk/shared/bricks/props/border";
import EnumField from "./enum";
import { FieldTitle } from "../field-factory";
import { ColorElementPreviewPill } from "./color";
import { Button } from "@radix-ui/themes";
import { useEditorHelpers } from "~/editor/hooks/use-editor";

export default function SiteQueriesField(props: FieldProps<unknown>) {
  const { currentValue, onChange, schema, title, description } = props;
  const editorHelpers = useEditorHelpers();
  // const onPropsChange = (newVal: Partial<BorderSettings>) => onChange({ ...currentValue, ...newVal });

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
