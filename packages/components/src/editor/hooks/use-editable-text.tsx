import type { EditorEvents } from "@tiptap/react";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { useDraftHelpers } from "~/editor/hooks/use-page-data";
import TextEditor, { DatasourceItemButton, type TextEditorRef } from "~/shared/components/TextEditor";
import type { FieldProps } from "../components/json-form/fields/types";
import { useRef } from "react";
import { css, tx } from "@upstart.gg/style-system/twind";
import { useDebounceCallback } from "usehooks-ts";
import { IconButton } from "@upstart.gg/style-system/system";
import { RiBracesLine } from "react-icons/ri";
import { getEditorNodeFromField, insertInEditor } from "~/shared/utils/editor-utils";

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
    console.log("Updating text editor props", brickId, propPath);
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

export function useDynamicTextEditor({
  currentValue,
  brickId,
  schema,
  onChange,
  placeholder,
}: UseEditorComponentProps) {
  const textEditorRef = useRef<TextEditorRef>(null);
  const onChangeDebounced = useDebounceCallback(onChange, 300);
  return (
    <>
      <div
        className={tx(
          "rounded border border-gray-300 px-2 py-[4px] text-sm flex-grow max-w-[calc(100%-34px)] bg-white",
          css({
            "&:has([contenteditable='true']:focus)": {
              outline: "1px solid var(--violet-8)",
              borderColor: "var(--violet-8)",
            },
          }),
        )}
      >
        <TextEditor
          content={currentValue}
          brickId={brickId}
          ref={textEditorRef}
          className={tx(
            css({ lineHeight: "1.5" }),
            schema["ui:multiline"] && `scrollbar-thin ${schema["ui:textarea-class"] ?? "h-24"}`,
          )}
          placeholder={schema["ui:placeholder"] ?? placeholder}
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
        <IconButton variant="surface" radius="large" className="!w-[31px] !h-[31px]">
          <RiBracesLine className="w-4 h-4" />
        </IconButton>
      </DatasourceItemButton>
    </>
  );
}
