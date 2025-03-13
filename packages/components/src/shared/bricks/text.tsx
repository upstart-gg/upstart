import { forwardRef } from "react";
import { memoizeWithout } from "../utils/memoize-without";
import { useEditableText } from "~/shared/hooks/use-editable-text";
import { useBrickStyle } from "../hooks/use-brick-style";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/text.manifest";
import { tx } from "@upstart.gg/style-system/twind";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

/**
 * Text brick
 */
const Text = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  const { brick } = props;
  return brick.props.editable ? (
    <EditableText ref={ref} {...props} />
  ) : (
    <NonEditableText ref={ref} {...props} />
  );
});

const NonEditableText = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  const { brick } = props;
  const className = useBrickStyle<Manifest>(brick);
  return (
    <div
      ref={ref}
      className={tx(className)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{ __html: brick.props.content }}
    />
  );
});

const EditableText = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  const { brick } = props;
  const className = useBrickStyle<Manifest>(brick);
  const content = useEditableText({
    brickId: brick.id,
    initialContent: brick.props.content,
    inline: true,
  });
  return (
    <div ref={ref} className={tx(className)}>
      {content}
    </div>
  );
});

// Memoize the component to avoid re-rendering when the text content changes
export default memoizeWithout(Text, "textContent");
