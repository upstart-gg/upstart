import { useCallback, lazy, Suspense } from "react";
import type { EditorEvents } from "@tiptap/react";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { useDraft, useDraftHelpers, useGetBrick } from "~/editor/hooks/use-editor";
import TextEditor, { type TextEditorProps } from "../components/TextEditor";

// const TextEditorAsync = lazy(() => import("../components/TextEditor"));

export function useEditableText({
  brickId,
  initialContent,
  ...props
}: Pick<TextEditorProps, "brickId" | "initialContent" | "inline" | "paragraphMode">) {
  // biome-ignore lint/suspicious/noMisleadingCharacterClass: <explanation>
  const content = initialContent.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "");
  const onUpdateHandler = useCallback(createTextEditorUpdateHandler(brickId), []);
  return <TextEditor initialContent={content} onUpdate={onUpdateHandler} brickId={brickId} {...props} />;
}

function createTextEditorUpdateHandler(brickId: Brick["id"], prop = "textContent") {
  // console.log("createTextEditorUpdateHandler for brick %s and prop %s", brickId, prop);
  const getBrick = useGetBrick();
  const helpers = useDraftHelpers();
  return (e: EditorEvents["update"]) => {
    console.log("text editor update for brick %s", brickId, e.editor.getHTML());
    const brick = getBrick(brickId);
    if (!brick) {
      console.warn("No brick for update found for id", brickId);
      return;
    }
    helpers.updateBrickProps(brickId, {
      ...brick.props,
      [prop]: e.editor.getHTML(),
    });
  };
}
