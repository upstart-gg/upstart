import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/hero.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { memoizeIgnoringPaths } from "../utils/memoize";
import { useBrickStyle } from "../hooks/use-brick-style";
import TextContent from "../components/TextContent";
import { tx, css } from "@upstart.gg/style-system/twind";
import { isTextContentEmpty } from "../utils/text-content";

const Hero = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable, selected }, ref) => {
  const styles = useBrickStyle<Manifest>(brick);
  const props = brick.props;
  const classes = Object.values(styles);

  return (
    <div
      className={tx(
        "flex-1 flex",
        ...classes,
        // props.layout === "sided" ? "flex-row gap-[10%]" : "flex-col gap-[10%] items-center justify-center",
      )}
      ref={ref}
    >
      <div className={tx("flex-1 flex flex-col gap-[1.5rem]")}>
        <TextContent
          as="h1"
          propPath="content"
          brickId={brick.id}
          content={props.content}
          textSizeMode="hero"
          editable={editable}
          noTextType
        />
        <TextContent
          as="p"
          propPath="tagline"
          className={tx(
            "tagline text-2xl font-bold text-balance",
            isTextContentEmpty(props.tagline) && !selected ? "opacity-0 hover:opacity-80" : "opacity-80",
          )}
          brickId={brick.id}
          content={props.tagline}
          editable={editable}
        />
      </div>
    </div>
  );
});

// export default memoizeIgnoringPaths(Hero, ["brick.props.content"]);
export default Hero;
