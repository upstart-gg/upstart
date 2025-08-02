import { useBrickStyle } from "../hooks/use-brick-style";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/image.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx } from "@upstart.gg/style-system/twind";
import BrickRoot from "../components/BrickRoot";

export default function Image({ brick, editable }: BrickProps<Manifest>) {
  const { props } = brick;
  const styles = useBrickStyle(brick);
  const { image: imageStyles, ...containerStyles } = styles;
  const { src, alt } = props.image ?? {};
  const isDynamicSrc = src?.includes("{{");

  return (
    <BrickRoot
      editable={editable}
      manifest={manifest}
      as="picture"
      className={tx("group/image flex items-center justify-center", Object.values(containerStyles))}
    >
      {!isDynamicSrc && typeof src === "string" && src !== "" && (
        <img
          src={src}
          alt={alt}
          className={tx(
            "max-h-full w-full h-full rounded-[inherit] select-none pointer-events-none",
            imageStyles,
          )}
        />
      )}
      {editable && !src && (
        <div
          className={tx(
            "rounded-[inherit] transition-opacity duration-300 group-hover/image:opacity-100 flex w-full h-full p-10 items-center justify-center font-semibold",
          )}
        >
          <div className="text-ellipsis text-nowrap flex-nowrap text-center">No image set</div>
        </div>
      )}
      {editable && isDynamicSrc && (
        <div
          className={tx(
            "rounded-[inherit] transition-opacity duration-300 flex items-center  w-full h-full justify-center font-medium p-10",
          )}
        >
          <div className="text-ellipsis text-nowrap flex-nowrap text-center">Dynamic Image</div>
        </div>
      )}
    </BrickRoot>
  );
}
