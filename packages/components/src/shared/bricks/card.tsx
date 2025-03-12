import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { css, tx } from "@upstart.gg/style-system/twind";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/card.manifest";
import TextBrick from "./text";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

const Card = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
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
