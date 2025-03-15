import { forwardRef, type ComponentPropsWithoutRef, type ElementType, type PropsWithChildren } from "react";
import TextEditor from "./TextEditor";

type PolymorphicProps<E extends ElementType> = PropsWithChildren<
  ComponentPropsWithoutRef<E> & {
    as?: E;
  }
>;

type TextContentProps<E extends ElementType> = PolymorphicProps<E> & {
  content: string;
  brickId: string;
  propPath: string;
  editable?: boolean;
  inline?: boolean;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const TextContent = forwardRef<HTMLDivElement, TextContentProps<any>>(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  (props: TextContentProps<any>, ref) => {
    if (props.editable) {
      return (
        <TextEditor
          propPath={props.propPath}
          initialContent={props.content}
          className={props.className}
          brickId={props.brickId}
          inline={props.inline}
        />
      );
    }
    const Component = props.as || "div";
    return (
      <Component
        ref={ref}
        className="text-content"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: props.content }}
      />
    );
  },
);
