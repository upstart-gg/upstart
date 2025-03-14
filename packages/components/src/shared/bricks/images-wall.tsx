import { forwardRef } from "react";
import { type Manifest, datasource } from "@upstart.gg/sdk/bricks/manifests/images-wall.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx, css } from "@upstart.gg/style-system/twind";
import { useDatasource } from "../hooks/use-datasource";
import { useBrickStyle } from "../hooks/use-brick-style";

/**
 * Containers can operate in two modes: Static and Dynamic.
 * `props.childrenBricks` are present only when the container is in Static mode. Its children are the bricks that are inside the container.
 * Otherwise, the children data are fetched from the datasource and rendered accordingly.
 */
const ImagesWall = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick }, ref) => {
  const { props } = brick;
  const className = useBrickStyle<Manifest>(brick);
  const { datasourceId, data, isSample } = useDatasource<
    Manifest["props"]["datasourceRef"],
    typeof datasource
  >(props.content.datasource, datasource);
  // const children = props.childrenBricks;
  const gapInt = parseInt(props.styles.gap.replace("gap-", "")) / 4;
  return (
    <div
      ref={ref}
      className={tx(
        className,
        "transition-all relative",
        props.styles.layoutType === "flex" && "flex flex-wrap justify-stretch items-center",
        props.styles.layoutType === "flex" &&
          css`
          &>div {
            flex-basis: calc(100% / ${props.styles.columns} - ${gapInt}rem / ${props.styles.columns} * (${props.styles.columns} - 1));
          }
        `,
        props.styles.layoutType === "grid" &&
          css({
            display: "grid",
            gridTemplateColumns: `repeat(${props.styles.columns}, 1fr)`,
          }),
        props.styles.gap,
      )}
    >
      {props.editable && isSample && (
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/30 rounded-lg flex items-center justify-center">
          <div className="text-white text-center rounded-md bg-black/30 p-4">
            <div className="text-2xl font-bold">Images Wall</div>
            <div className="text-base">Drag and drop images here or edit content in the panel</div>
          </div>
        </div>
      )}
      {data.map((image, index) => (
        <div key={index} className="flex bg-white/30 rounded-lg p-2 flex-1">
          <img key={index} src={image.src} alt={image.alt} className="flex-1" />
        </div>
      ))}
    </div>
  );
});

export default ImagesWall;
