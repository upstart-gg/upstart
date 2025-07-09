import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/card.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import TextContent from "../components/TextContent";
import { tx, css } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";
import { useColorPreset } from "../hooks/use-color-preset";

const Card = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const props = structuredClone(brick.props);
  const styles = useBrickStyle<Manifest>(brick);
  const presetClasses = useColorPreset<Manifest>(brick);
  const classes = Object.values(styles);

  if (!props.cardTitle && !props.cardBody) {
    // Put some sample content in the card if both title and body are empty
    props.cardTitle = "Card Title";
    props.cardBody = "This is the body of the card. You can edit this content.";
  }

  const isOverlay = props.cardImage && props.imagePosition === "overlay";
  return (
    <div
      className={tx(
        "flex flex-1 relative overflow-hidden max-w-[100cqw] min-h-fit",
        props.imagePosition === "side" ? "flex-row" : "flex-col",
        presetClasses.container,
        classes,

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
      {isOverlay && <div className="absolute inset-0 bg-[inherit] opacity-20 -z-1" />}
      <div className={tx("card-inner-wrapper", props.imagePosition === "top" ? "order-2" : "order-1")}>
        {props.cardTitle && !props.noTitle && (
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
        {props.cardBody && props.imagePosition !== "middle" && (
          <div className={tx("z-auto p-4", !props.noTitle && "pt-0")}>
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
      {props.cardImage?.src && props.imagePosition !== "overlay" && (
        <img
          className={tx(
            " select-none pointer-events-none bg-transparent",
            props.cardImage.position ?? "object-center",
            props.cardImage.fit ?? "object-cover",
            props.imagePosition === "middle" && "order-2",
            props.imagePosition === "top" && "order-first",
            props.imagePosition === "bottom" && "order-last mt-auto",
            props.imagePosition === "side"
              ? "h-auto w-[clamp(100px,40%,400px)]"
              : "w-inherit h-[clamp(200px,50%,300px)]",
          )}
          src={props.cardImage.src}
          alt={props.cardImage.alt || "Card Image"}
        />
      )}
      {props.cardBody && props.imagePosition === "middle" && (
        <div className={tx("z-auto p-4 order-last")}>
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
  );
});

export default Card;
