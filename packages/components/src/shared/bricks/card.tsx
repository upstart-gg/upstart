import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/card.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { TextContent } from "../components/TextContent";
import { tx, css } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";

const Card = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const props = structuredClone(brick.props);
  const styles = useBrickStyle<Manifest>(brick);

  if (!props.cardTitle?.content && !props.cardBody?.content) {
    // Put some sample content in the card if both title and body are empty
    props.cardTitle = { content: "Card Title" };
    props.cardBody = { content: "This is the body of the card. You can edit this content." };
  }
  return (
    <div className={tx("card flex-1")} ref={ref}>
      <div className={tx("card-body")}>
        {props.cardTitle?.content && (
          <div className={tx("card-title", styles.cardTitle)}>
            <TextContent
              propPath="cardTitle.content"
              className={tx("flex-1")}
              brickId={brick.id}
              content={props.cardTitle.content}
              editable={editable}
              inline
            />
          </div>
        )}
        {props.cardBody?.content && (
          <TextContent
            propPath="cardBody.content"
            className="flex-1"
            brickId={brick.id}
            content={props.cardBody.content}
            editable={editable}
          />
        )}
      </div>
    </div>
  );
});

export default Card;
