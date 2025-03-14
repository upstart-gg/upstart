import type { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from "react";
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

export function TextContent<T extends ElementType = "div">(props: TextContentProps<T>) {
  const Component = props.as || "div";
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
  return (
    <Component
      className="text-content"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{ __html: props.content }}
    />
  );
}
