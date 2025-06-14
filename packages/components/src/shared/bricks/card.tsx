import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/card.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { TextContent } from "../components/TextContent";
import { tx, css } from "@upstart.gg/style-system/twind";

const Card = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const props = brick.props;
  return (
    <div className={tx("card flex flex-col")} ref={ref}>
      {props.cardTitle?.content && (
        <TextContent
          propPath="cardTitle.content"
          className="card-title flex-1"
          brickId={brick.id}
          content={props.cardTitle.content}
          editable={editable}
          inline
        />
      )}
      {props.cardBody?.content && (
        <TextContent
          propPath="cardTitle.content"
          className="card-body flex-1"
          brickId={brick.id}
          content={props.cardBody.content}
          editable={editable}
        />
      )}
    </div>
  );
});

export default Card;
