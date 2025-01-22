import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { tx, css } from "@upstart.gg/style-system/twind";
import TextBrick from "./text";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/icon.manifest";

const Icon = forwardRef<HTMLDivElement, Manifest["props"]>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  let {
    content: { text },
  } = props;

  if (!text.startsWith("<h")) {
    text = `<h1>${text}</h1>`;
  }

  const sizeClass = css({});

  return <span>Icon</span>;
});

export default Icon;
