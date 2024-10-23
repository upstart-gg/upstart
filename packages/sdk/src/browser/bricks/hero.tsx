import { Type, type Static } from "@sinclair/typebox";
import { defineBrickManifest } from "./manifest";
import { Value } from "@sinclair/typebox/value";
import { parse } from "marked";
import DOMPurify from "dompurify";
import { forwardRef, useCallback } from "react";
import { tx } from "../twind";
import { getCommonBrickProps, editableTextProps } from "./common";
import TextEditor, { createTextEditorUpdateHandler } from "./text-editor";

// get filename from esm import.meta
const filename = new URL(import.meta.url).pathname.split("/").pop() as string;

export const manifest = defineBrickManifest({
  type: "hero",
  title: "hero",
  description: "A hero brick",
  icon: "hero",
  file: filename,
  props: Type.Object({
    ...editableTextProps,
    ...getCommonBrickProps("hero-5 font-extrabold"),
  }),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);

const Text = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  let { content, className, justify, id, textEditable, ...attrs } = props;
  // biome-ignore lint/suspicious/noMisleadingCharacterClass: remove potential zero-width characters due to copy-paste
  content = content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "");

  const onUpdateHandler = useCallback(createTextEditorUpdateHandler(id), []);

  return textEditable ? (
    <div className={tx("flex-1 relative", className, justify)} {...attrs}>
      <TextEditor
        className={className}
        initialContent={DOMPurify.sanitize(content)}
        onUpdate={onUpdateHandler}
        brickId={id}
      />
    </div>
  ) : (
    <div
      ref={ref}
      className={tx("flex-1", className, justify)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: need for html content
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
      {...attrs}
    />
  );
});

export default Text;
