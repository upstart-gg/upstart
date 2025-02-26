import { forwardRef } from "react";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/images-wall.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx, css } from "@upstart.gg/style-system/twind";
import { useDatasource } from "../hooks/use-datasource";
import { useBrickStyle } from "../hooks/use-brick-style";

const ImagesWall = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  const { id, data, isSample } = useDatasource<Manifest["props"]["datasources"]>(props.datasources);
  const className = useBrickStyle(props);
  console.log("useDatasource", { id, data, props });
  const gapInt = parseInt(props.imagesWallGap.replace("gap-", "")) / 4;
  return (
    <div
      ref={ref}
      className={tx(
        className,
        "transition-all relative",
        props.imagesWallLayout === "flex" && "flex flex-wrap justify-stretch items-center",
        props.imagesWallLayout === "flex" &&
          css`
          &>div {
            flex-basis: calc(100% / ${props.imagesWallColumns} - ${gapInt}rem / ${props.imagesWallColumns} * (${props.imagesWallColumns} - 1));
          }
        `,
        props.imagesWallLayout === "grid" &&
          css({
            display: "grid",
            gridTemplateColumns: `repeat(${props.imagesWallColumns}, 1fr)`,
          }),
        props.imagesWallGap,
      )}
    >
      {isSample && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/30 rounded-lg flex items-center justify-center">
          <div className="text-white text-center rounded-md bg-black/30 p-4">
            <div className="text-2xl font-bold">Images Wall</div>
            <div className="text-base">Drag and drop images here to add them to the wall</div>
          </div>
        </div>
      )}
      {data.images.map((image, index) => (
        <div key={index} className="flex bg-white/30 rounded-lg p-2 flex-1">
          <img key={index} src={image.src} alt={image.alt} className="flex-1" />
        </div>
      ))}
    </div>
  );
});

export default ImagesWall;
