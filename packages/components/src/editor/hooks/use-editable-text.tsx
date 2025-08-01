import type { EditorEvents } from "@tiptap/react";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { useDraftHelpers } from "~/editor/hooks/use-page-data";
import TextEditor, {
  DatasourceItemButton,
  insertInEditor,
  type TextEditorRef,
} from "~/shared/components/TextEditor";
import type { FieldProps } from "../components/json-form/fields/types";
import { useRef } from "react";
import { css, tx } from "@upstart.gg/style-system/twind";
import { useDebounceCallback } from "usehooks-ts";
import { IconButton } from "@upstart.gg/style-system/system";
import { RiBracesLine } from "react-icons/ri";
import { getEditorNodeFromField } from "~/shared/utils/editor-nodes";

export function useTextEditorUpdateHandler(
  brickId: Brick["id"],
  propPath: string,
  dynamic = false,
  enabled = true,
) {
  const helpers = useDraftHelpers();
  if (!enabled) {
    return;
  }
  return (e: EditorEvents["update"]) => {
    if (dynamic) {
      helpers.updateBrickProps(brickId, {
        [propPath]: e.editor.getText(),
      });
    } else {
      helpers.updateBrickProps(brickId, { [propPath]: e.editor.getHTML() });
    }
  };
}

// biome-ignore lint/suspicious/noExplicitAny: Allow all types of fields
type UseEditorComponentProps = FieldProps<any> & {
  dynamic?: boolean;
};

export function useDynamicTextEditor({ currentValue, brickId, schema, onChange }: UseEditorComponentProps) {
  const textEditorRef = useRef<TextEditorRef>(null);
  const onChangeDebounced = useDebounceCallback(onChange, 300);
  return (
    <>
      <div className="rounded-md border border-gray-300 focus:border-upstart-600 focus:ring-1 focus:ring-upstart-600 px-1.5 py-1.5 text-sm w-full bg-white">
        <TextEditor
          content={currentValue}
          brickId={brickId}
          ref={textEditorRef}
          className={tx(
            css({ lineHeight: "1.5" }),
            schema["ui:multiline"] && `scrollbar-thin ${schema["ui:textarea-class"] ?? "h-24"}`,
          )}
          placeholder={schema["ui:placeholder"]}
          spellCheck={!!schema["ui:spellcheck"]}
          singleline
          noMenuBar
          dynamic
          onChange={(e: EditorEvents["update"]) => {
            onChangeDebounced(e.editor.getText());
          }}
        />
      </div>
      <DatasourceItemButton
        brickId={brickId}
        onFieldClick={(field) => {
          if (textEditorRef.current?.editor) {
            insertInEditor(textEditorRef.current.editor, getEditorNodeFromField(field));
          }
        }}
      >
        <IconButton variant="outline">
          <RiBracesLine />
        </IconButton>
      </DatasourceItemButton>
    </>
  );
}
