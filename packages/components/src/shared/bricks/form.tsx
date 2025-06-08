import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/form.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

const WidgetForm = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  return <div>Im a form</div>;
});

export default WidgetForm;
