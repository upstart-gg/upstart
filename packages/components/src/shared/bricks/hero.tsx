import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/hero.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { memoizeIgnoringPaths } from "../utils/memoize";
import { useBrickStyle } from "../hooks/use-brick-style";
import { TextContent } from "../components/TextContent";
import { tx, css } from "@upstart.gg/style-system/twind";

const Hero = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const styles = useBrickStyle<Manifest>(brick);
  const props = brick.props;
  const classes = Object.values(styles);

  return (
    <div
      className={tx(
        "flex-1 flex",
        // ...classes,
        props.layout === "sided" ? "flex-row gap-[10%]" : "flex-col gap-[10%] items-center justify-center",
      )}
      ref={ref}
    >
      <div
        className={tx(
          "flex-1 flex flex-col gap-[5%]",
          props.layout === "sided" ? "items-start" : "place-items-center text-center",
        )}
      >
        <TextContent
          as="h1"
          propPath="content"
          className={tx(" ", props.layout === "centered" ? "text-center" : "text-center")}
          brickId={brick.id}
          content={props.content}
          textSizeMode="hero"
          editable={editable}
          noTextType
        />
        <TextContent
          as="h4"
          propPath="tagline"
          className={tx(
            "tagline text-2xl font-bold text-balance opacity-80",
            props.layout === "centered" ? "text-center" : "text-left",
          )}
          brickId={brick.id}
          content={props.tagline}
          editable={editable}
          noTextType
        />
      </div>
    </div>
  );
});

// Memoize the component to avoid re-rendering when the text content changes
// export default memoizeIgnoringPaths(Hero, ["brick.props.content"]);
export default Hero;
