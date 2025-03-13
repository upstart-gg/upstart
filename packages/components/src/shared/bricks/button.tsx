import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { tx, css } from "@upstart.gg/style-system/twind";
import TextBrick from "./text";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/button.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { getBrickManifestDefaults } from "@upstart.gg/sdk/shared/brick-manifest";

const Button = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  // if (!content.startsWith("<h")) {
  //   content = `<h1>${content}</h1>`;
  // }

  // const sizeClass = css({
  //   "font-size": `var(--${heroFontSize})`,
  // });

  return (
    <button type="button">
      <TextBrick {...props} ref={ref} />
    </button>
  );
});

export default Button;
