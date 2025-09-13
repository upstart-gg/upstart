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
  return (
    <BrickRoot
      brick={brick}
      editable={editable}
      manifest={manifest}
      className={tx(
        "flex relative overflow-hidden !flex-nowrap",
        brickProps.imagePosition === "left" || brickProps.imagePosition === "right" ? "flex-row" : "flex-col",
        classes,
      )}
    >
      <div
        className={tx(
          "card-inner-wrapper",
          brickProps.imagePosition === "top"
            ? "order-2"
            : brickProps.imagePosition === "left"
              ? "order-last"
              : "order-1",
        )}
      >
        {!brickProps.noTitle && (
          <div className={tx("text-[120%] font-semibold z-auto my-4 mx-4")}>
            <TextContent
              propPath="title.content"
              className={tx("flex-1")}
              brickId={brick.id}
              content={brickProps.title}
              rawContent={brick.props.title}
              editable={editable}
              inline
            />
          </div>
        )}
        {brickProps.imagePosition !== "middle" && (
          <div className={tx("z-auto p-4", !brickProps.noTitle && "pt-0")}>
            <TextContent
              propPath="text.content"
              className={tx("flex-grow")}
              brickId={brick.id}
              content={brickProps.text}
              rawContent={brick.props.text}
              editable={editable}
            />
          </div>
        )}
      </div>
      {brickProps.cardImage?.src && (
        <img
          className={tx(
            " select-none pointer-events-none bg-transparent",
            brickProps.cardImage.position ?? "object-center",
            brickProps.cardImage.fit ?? "object-cover",
            brickProps.imagePosition === "left" && "order-1",
            brickProps.imagePosition === "right" && "order-last",
            brickProps.imagePosition === "middle" && "order-2",
            brickProps.imagePosition === "top" && "order-first",
            brickProps.imagePosition === "bottom" && "order-last mt-auto",
            brickProps.imagePosition === "left" || brickProps.imagePosition === "right"
              ? "h-auto w-[clamp(100px,40%,400px)]"
              : "w-inherit h-[clamp(100px,50%,250px)]",
          )}
          src={brickProps.cardImage.src}
          alt={brickProps.cardImage.alt || "Card Image"}
        />
      )}
      {brickProps.text && brickProps.imagePosition === "middle" && (
        <div className={tx("z-auto p-4 order-last")}>
          <TextContent
            propPath="text.content"
            className={tx("flex-1 prose lg:prose-lg")}
            brickId={brick.id}
            content={brickProps.text}
            rawContent={brick.props.text}
            editable={editable}
          />
        </div>
      )}
    </BrickRoot>
  );
}
