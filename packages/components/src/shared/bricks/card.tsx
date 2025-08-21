import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/card.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import TextContent from "../components/TextContent";
import { tx, css } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";
import BrickRoot from "../components/BrickRoot";
import { useBrickProps } from "../hooks/use-brick-props";

export default function Card(props: BrickProps<Manifest>) {
  const { brick, editable } = props;
  const brickProps = useBrickProps(props);
  const styles = useBrickStyle<Manifest>(brick);
  const classes = Object.values(styles);
  const isOverlay = brickProps.cardImage && brickProps.imagePosition === "overlay";
  return (
    <BrickRoot
      editable={editable}
      manifest={manifest}
      className={tx(
        "flex relative overflow-hidden",
        brickProps.imagePosition === "side" ? "flex-row" : "flex-col",
        classes,
        isOverlay &&
          css({
            backgroundImage: `url(${brickProps.cardImage?.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }),
        isOverlay && "justify-center",
      )}
    >
      {isOverlay && <div className="absolute inset-0 bg-[inherit] opacity-20 -z-1" />}
      <div className={tx("card-inner-wrapper", brickProps.imagePosition === "top" ? "order-2" : "order-1")}>
        {!brickProps.noTitle && (
          <div className={tx("text-[120%] font-semibold z-auto my-4 mx-4")}>
            <TextContent
              propPath="cardTitle.content"
              className={tx("flex-1")}
              brickId={brick.id}
              content={brickProps.cardTitle}
              editable={editable}
              inline
            />
          </div>
        )}
        {brickProps.imagePosition !== "middle" && (
          <div className={tx("z-auto p-4", !brickProps.noTitle && "pt-0")}>
            <TextContent
              propPath="cardBody.content"
              className={tx("flex-grow")}
              brickId={brick.id}
              content={brickProps.cardBody}
              editable={editable}
            />
          </div>
        )}
      </div>
      {brickProps.cardImage?.src && brickProps.imagePosition !== "overlay" && (
        <img
          className={tx(
            " select-none pointer-events-none bg-transparent",
            brickProps.cardImage.position ?? "object-center",
            brickProps.cardImage.fit ?? "object-cover",
            brickProps.imagePosition === "middle" && "order-2",
            brickProps.imagePosition === "top" && "order-first",
            brickProps.imagePosition === "bottom" && "order-last mt-auto",
            brickProps.imagePosition === "side"
              ? "h-auto w-[clamp(100px,40%,400px)]"
              : "w-inherit h-[clamp(200px,50%,300px)]",
          )}
          src={brickProps.cardImage.src}
          alt={brickProps.cardImage.alt || "Card Image"}
        />
      )}
      {brickProps.cardBody && brickProps.imagePosition === "middle" && (
        <div className={tx("z-auto p-4 order-last")}>
          <TextContent
            propPath="cardBody.content"
            className={tx("flex-1")}
            brickId={brick.id}
            content={brickProps.cardBody}
            editable={editable}
          />
        </div>
      )}
    </BrickRoot>
  );
}
