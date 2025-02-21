import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { tx } from "@upstart.gg/style-system/twind";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/hero.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { memoizeWithout } from "../utils/memoize-without";
import { useBrickStyle } from "../hooks/use-brick-style";
import { useEditableText } from "../hooks/use-editable-text";

const Hero = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };

  let { content = "my hero" } = props;

  if (!content.trim().startsWith("<h")) {
    content = `<h1>${content}</h1>`;
  }

  return props.editable ? (
    <EditableText
      ref={ref}
      {...props}
      content={content}
      className={tx(props.className, "hero", props.heroSize, props.textShadow)}
    />
  ) : (
    <NonEditableText
      ref={ref}
      {...props}
      content={content}
      className={tx(props.className, "hero", props.heroSize, props.textShadow)}
    />
  );
});

const NonEditableText = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  const className = useBrickStyle(props);
  return (
    <div
      ref={ref}
      className={tx(className)}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
      dangerouslySetInnerHTML={{ __html: props.content }}
    />
  );
});

const EditableText = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  const className = useBrickStyle(props);
  const content = useEditableText({
    brickId: props.id,
    initialContent: props.content,
    inline: true,
    enabled: true,
    paragraphMode: "hero",
  });
  return (
    <div ref={ref} className={tx(className)}>
      {content}
    </div>
  );
});

// Memoize the component to avoid re-rendering when the text content changes
export default memoizeWithout(Hero, "content");
