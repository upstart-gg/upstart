import { Type, type Static } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { commonProps, contentAwareProps } from "./props/common";
import { memoizeWithout } from "../utils/memoize-without";
import { useEditableText } from "~/editor/hooks/use-editable-text";
import { useBrickStyle } from "../hooks/use-brick-style";
import { commonStyleProps } from "./props/style-props";
import { defineBrickManifest } from "@upstart.gg/sdk/shared/bricks";
import { LAYOUT_COLS } from "@upstart.gg/sdk/shared/layout-constants";

export const manifest = defineBrickManifest({
  type: "text",
  kind: "brick",
  title: "Text",
  description: "Text with formatting options",
  preferredWidth: {
    mobile: LAYOUT_COLS.mobile / 2,
    desktop: LAYOUT_COLS.desktop / 4,
  },
  preferredHeight: {
    mobile: 6,
    desktop: 6,
  },
  minWidth: {
    mobile: 3,
    desktop: 3,
  },
  minHeight: {
    mobile: 3,
    desktop: 3,
  },
  // svg icon for "text" block
  icon: `
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 7h16M4 12h16M4 17h16"></path>
    </svg>
 `,
  props: Type.Composite([commonProps, contentAwareProps, commonStyleProps]),
});

export type Manifest = Static<typeof manifest>;
export const defaults = Value.Create(manifest);

/**
 * Text brick
 */
const Text = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  return props.editable ? <EditableText ref={ref} {...props} /> : <NonEditableText ref={ref} {...props} />;
});

const NonEditableText = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  const className = useBrickStyle(props);
  return (
    <div ref={ref} className={className}>
      {props.content}
    </div>
  );
});

const EditableText = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  const className = useBrickStyle(props);
  const content = useEditableText(props.id, props.content);
  return (
    <div ref={ref} className={className}>
      {content}
    </div>
  );
});

// Memoize the component to avoid re-rendering when the text content changes
export default memoizeWithout(Text, "content");
