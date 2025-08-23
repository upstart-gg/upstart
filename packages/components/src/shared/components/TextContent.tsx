import { lazy, Suspense } from "react";
import type { TextEditorProps } from "./TextEditor";

const TextEditor = lazy(() => import("./TextEditor"));

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export default function TextContent(props: TextEditorProps<any>) {
  if (props.editable) {
    return (
      <Suspense>
        <TextEditor {...props} content={props.content} inline />
      </Suspense>
    );
  }
  const Component = props.as || "div";
  return (
    <Component
      className={props.className}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: We do actually want the user to be able to set HTML content
      dangerouslySetInnerHTML={{ __html: props.content }}
    />
  );
}
