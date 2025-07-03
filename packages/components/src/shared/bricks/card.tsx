import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/card.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { TextContent } from "../components/TextContent";
import { tx, css } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";

const Card = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const props = structuredClone(brick.props);
  const styles = useBrickStyle<Manifest>(brick);

  if (!props.cardTitle && !props.cardBody) {
    // Put some sample content in the card if both title and body are empty
    props.cardTitle = "Card Title";
    props.cardBody = "This is the body of the card. You can edit this content.";
  }

  const isOverlay = props.cardImage && props.variants?.includes("image-overlay");
  return (
    <div
      className={tx(
        "flex flex-1 relative overflow-hidden max-w-[100cqw] rounded-[inherit] min-h-fit",
        props.variants?.includes("image-side") ? "flex-row" : "flex-col",
        props.variants?.includes("centered") && "text-center",
        props.variants?.includes("text-sm") && "text-sm",
        props.variants?.includes("text-lg") && "text-lg",
        props.variants?.includes("text-xl") && "text-xl",
        props.variants?.includes("text-2xl") && "text-2xl",
        props.variants?.includes("text-base") && "text-base",

        isOverlay &&
          css({
            backgroundImage: `url(${props.cardImage?.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }),
        isOverlay && "justify-center",
      )}
      ref={ref}
    >
      {isOverlay && <div className="absolute inset-0 bg-white/90 -z-1" />}
      <div
        className={tx("card-inner-wrapper", props.variants?.includes("image-first") ? "order-2" : "order-1")}
      >
        {props.cardTitle && !props.variants.includes("hide-title") && (
          <div className={tx("text-[120%] font-semibold z-auto my-4 mx-4")}>
            <TextContent
              propPath="cardTitle.content"
              className={tx("flex-1")}
              brickId={brick.id}
              content={props.cardTitle}
              editable={editable}
              inline
            />
          </div>
        )}
        {props.cardBody && (
          <div
            className={tx(
              "z-auto pb-4 pt-2 mx-4",
              props.variants?.includes("image-first")
                ? "order-3"
                : props.variants?.includes("image-between")
                  ? "order-4"
                  : "order-2",
            )}
          >
            <TextContent
              propPath="cardBody.content"
              className={tx("flex-1")}
              brickId={brick.id}
              content={props.cardBody}
              editable={editable}
            />
          </div>
        )}
      </div>
      {props.cardImage?.src && !props.variants?.includes("image-overlay") && (
        <img
          className={tx(
            " select-none pointer-events-none bg-transparent",
            props.cardImage.position ?? "object-center",
            props.cardImage.fit ?? "object-cover",
            props.variants?.includes("image-between") && "order-2",
            props.variants?.includes("image-first") && "order-1",
            props.variants?.includes("image-last") && "order-4 mt-auto",
            props.variants?.includes("image-side")
              ? "h-inherit w-[clamp(50px,50%,300px)]"
              : "w-inherit h-[clamp(200px,50%,300px)]",
          )}
          src={props.cardImage.src}
          alt={props.cardImage.alt || "Card Image"}
        />
      )}
    </div>
  );
});

export default Card;
