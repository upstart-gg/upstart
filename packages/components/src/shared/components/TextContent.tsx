import { forwardRef } from "react";
import TextEditor, { type TextEditorProps } from "./TextEditor";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const TextContent = forwardRef<HTMLDivElement, TextEditorProps<any>>(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  (props: TextEditorProps<any>, ref) => {
    if (props.editable) {
      return <TextEditor ref={ref} {...props} />;
    }
    const Component = props.as || "div";
    return (
      <Component
        ref={ref}
        className={props.className}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: props.content }}
      />
    );
  },
);
