import { Type, type Static } from "@sinclair/typebox";
import { defineBrickManifest } from "./manifest";
import { Value } from "@sinclair/typebox/value";
import DOMPurify from "dompurify";
import { tx } from "../twind";
import { commonBrickProps, editableTextProps, getHtmlAttributesAndRest } from "./common";
import { forwardRef, useState } from "react";
import TextEditor, { createTextEditorUpdateHandler } from "./text-editor";

// get filename from esm import.meta
const filename = new URL(import.meta.url).pathname.split("/").pop() as string;

export const manifest = defineBrickManifest({
  type: "text-with-title",
  title: "Title & Text",
  description: "A textual brick with a title",
  icon: "text-title",
  file: filename,
  props: Type.Composite([
    Type.Object({
      title: Type.String({
        default: "Click to edit",
        title: "Content",
        description: "The text content",
        "ui:widget": "hidden",
      }),
      titleClassName: Type.String({
        default: "text-lg font-bold",
        title: "Title Class Name",
        description: "The class name to apply to the title",
        "ui:widget": "hidden",
      }),
      titleLevel: Type.Union(
        [
          Type.Literal("h1", { title: "h1", description: "Title" }),
          Type.Literal("h2", { title: "h2", description: "Subtitle" }),
          Type.Literal("h3", { title: "h3", description: "Heading level 3" }),
          Type.Literal("h4", { title: "h4", description: "Heading level 4" }),
          Type.Literal("h5", { title: "h5", description: "Heading level 5" }),
          Type.Literal("h6", { title: "h6", description: "Heading level 6" }),
        ],
        {
          default: "h2",
          title: "Title Level",
          description: "The title level",
          "ui:field": "enum",
          "ui:display": "button-group",
        },
      ),
      titleJustify: editableTextProps.properties.justify,
    }),
    editableTextProps,
    commonBrickProps,
  ]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);

const TextWithTitle = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  // let { title, className, justify, titleJustify, titleClassName, titleLevel, id, ...attrs } = props;

  let {
    attributes,
    classes,
    rest: { textEditable, content, titleJustify, titleClassName, title, titleLevel },
  } = getHtmlAttributesAndRest(props);

  // biome-ignore lint/suspicious/noMisleadingCharacterClass: remove potential zero-width characters due to copy-paste
  content = content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "");
  // biome-ignore lint/suspicious/noMisleadingCharacterClass: remove potential zero-width characters due to copy-paste
  title = title.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "");

  const TitleTag = titleLevel as keyof JSX.IntrinsicElements;

  return (
    <div ref={ref} className={tx(classes, titleClassName)}>
      {textEditable ? (
        <>
          <TitleTag className={tx(titleClassName, titleJustify)}>
            <TextEditor
              initialContent={DOMPurify.sanitize(title)}
              onUpdate={createTextEditorUpdateHandler(attributes.id, "title")}
              brickId={attributes.id}
            />
          </TitleTag>
          <div className={tx(classes)}>
            <TextEditor
              initialContent={DOMPurify.sanitize(content)}
              onUpdate={createTextEditorUpdateHandler(attributes.id)}
              brickId={attributes.id}
            />
          </div>
        </>
      ) : (
        <>
          <TitleTag
            className={tx(titleClassName, titleJustify)}
            // biome-ignore lint/security/noDangerouslySetInnerHtml:  needed for html content
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(title) }}
          />
          <div
            className={tx(classes)}
            /* biome-ignore lint/security/noDangerouslySetInnerHtml: need for html content */
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
          />
        </>
      )}
    </div>
  );
});

export default TextWithTitle;
