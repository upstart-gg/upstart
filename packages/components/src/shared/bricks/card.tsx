import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { css, tx } from "@upstart.gg/style-system/twind";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/card.manifest";
import TextBrick from "./text";
import type { BrickWithProps } from "@upstart.gg/sdk/shared/bricks";

const Card = forwardRef<HTMLDivElement, BrickWithProps<Manifest>>(({ props }, ref) => {
  return (
    <div className={tx("card flex flex-col")} ref={ref}>
      {props.cardTitle?.content && (
        <TextBrick
          {...props}
          textContent={props.cardTitle.content}
          className={tx(props.className, "card-title flex-1")}
        />
      )}
      {props.cardBody?.content && (
        <TextBrick
          {...props}
          textContent={props.cardBody.content}
          className={tx(props.className, "card-body flex-1")}
        />
      )}
    </div>
  );
});

export default Card;
