import type { FieldProps } from "./types";
import { Text } from "@upstart.gg/style-system/system";
import { useTextEditMode } from "~/editor/hooks/use-editor";
import { tx } from "@upstart.gg/style-system/twind";
import type { TextContentSettings } from "@upstart.gg/sdk/shared/bricks/props/text";
import TextEditor from "~/shared/components/TextEditor";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";

const RichTextField: React.FC<FieldProps<TextContentSettings>> = (props) => {
  const { onChange, title, currentValue, brickId } = props;
  const textEditMode = useTextEditMode();

  invariant(brickId, "RichTextField must have a brickId");

  return (
    <div className="field field-rich-text">
      {title && (
        <div className="flex items-center justify-between">
          <Text as="label" size="2" weight="medium">
            {title}
          </Text>
        </div>
      )}
      <div className={tx("relative")}>
        <TextEditor
          onUpdate={({ editor }) => {
            onChange(editor.getHTML());
          }}
          paragraphMode={props.schema["ui:paragraph-mode"]}
          brickId={brickId}
          initialContent={currentValue}
          className={tx("form-textarea focus:ring-0 h-full", {
            "flex-1 rounded rounded-t-none border-gray-300": textEditMode === "large",
            "border-0": textEditMode !== "large",
          })}
        />
      </div>
    </div>
  );
};

export default RichTextField;
