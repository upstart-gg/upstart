import { Type, type Static } from "@sinclair/typebox";
import { defineBrickManifest } from "./manifest";
import { Value } from "@sinclair/typebox/value";
import { parse } from "marked";
import DOMPurify from "dompurify";
import { forwardRef, useState } from "react";
import { tx } from "@twind/core";
import { getCommonBrickProps } from "./common";
import ReactQuill, { Quill } from "react-quill";
import clsx from "clsx";

// get filename from esm import.meta
const filename = new URL(import.meta.url).pathname.split("/").pop() as string;

export const manifest = defineBrickManifest({
  type: "text",
  title: "Text",
  description: "A textual brick",
  icon: "text",
  file: filename,
  props: Type.Object({
    content: Type.String({
      default: "Click to edit",
      title: "Content",
      description: "The text content",
      "ep:prop-type": "content",
    }),
    justify: Type.Union(
      [
        Type.Literal("text-left", { title: "Left", description: "Left align" }),
        Type.Literal("text-center", { title: "Center", description: "Center align" }),
        Type.Literal("text-right", { title: "Right", description: "Right align" }),
        Type.Literal("text-justify", { title: "Justify", description: "Justify align" }),
      ],
      {
        default: "text-left",
        title: "Justify",
        description: "The text alignment",
        "ui:field": "enum",
        "ui:display": "button-group",
      },
    ),
    format: Type.Union(
      [
        Type.Literal("plain", { title: "Plain", description: "Plain text mode" }),
        Type.Literal("html", { title: "HTML", description: "HTML mode" }),
        Type.Literal("markdown", { title: "Markdown", description: "Markdown mode" }),
      ],
      {
        default: "plain",
        title: "Format",
        description: "The text format",
        "ui:field": "enum",
        "ui:display": "button-group",
      },
    ),
    ...getCommonBrickProps("p-4"),
  }),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);

const Text = forwardRef<HTMLDivElement, Manifest["props"] & { contentEditable?: boolean }>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  let { format, content, className, justify, contentEditable, ...attrs } = props;
  // biome-ignore lint/suspicious/noMisleadingCharacterClass: remove potential zero-width characters due to copy-paste
  content = content.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, "");

  const [textValue, setTextValue] = useState(DOMPurify.sanitize(content));
  const [hasFocus, setHasFocus] = useState(false);

  if (format === "html") {
    return contentEditable ? (
      <div
        className={tx("flex-1 relative", className)}
        onMouseEnter={() => setHasFocus(true)}
        onMouseLeave={() => setHasFocus(false)}
      >
        <div
          className={clsx(
            `toolbar-${props.id}`,
            "bg-primary-300 absolute -top-8 z-50 h-8 p-1 rounded w-48 items-center transition-all duration-300 gap-1",
            tx({ flex: hasFocus, hidden: !hasFocus }),
          )}
        >
          <button
            type="button"
            className="ql-bold fill-transparent stroke-white w-5"
            style={{ strokeWidth: "2px" }}
          />
          <button type="button" className="ql-italic stroke-white w-5 " />
        </div>
        <ReactQuill
          theme="bubble"
          value={textValue}
          onChange={setTextValue}
          onChangeSelection={(range, source, editor) => {
            console.log("selection", range, source, editor);
          }}
          formats={["bold", "italic"]}
          onFocus={() => {
            setHasFocus(true);
          }}
          onBlur={() => {
            setHasFocus(false);
          }}
          modules={{
            // biome-ignore lint/style/useTemplate: <explanation>
            toolbar: ".toolbar-" + props.id,
          }}
          {...attrs}
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
  } else if (format === "markdown") {
    return (
      <div
        ref={ref}
        className={tx("flex-1", className, justify)}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: need for html content
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            parse(content, {
              async: false,
              breaks: true,
            }),
          ),
        }}
        {...attrs}
      />
    );
  } else {
    return (
      <p ref={ref} className={tx("flex-1", className, justify)} {...attrs}>
        {content}
      </p>
    );
  }
});

export default Text;
