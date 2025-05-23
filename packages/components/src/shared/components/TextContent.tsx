import { forwardRef, lazy, Suspense } from "react";
import type { TextEditorProps } from "./TextEditor";

const TextEditor = lazy(() => import("./TextEditor"));

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const TextContent = forwardRef<HTMLDivElement, TextEditorProps<any>>(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  (props: TextEditorProps<any>, ref) => {
    if (props.editable) {
      return (
        <Suspense>
          <TextEditor ref={ref} {...props} />
        </Suspense>
      );
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
