import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/hero.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useBrickStyle } from "../hooks/use-brick-style";
import TextContent from "../components/TextContent";
import { tx } from "@upstart.gg/style-system/twind";
import { isTextContentEmpty } from "../utils/text-content";
import { useColorPreset } from "../hooks/use-color-preset";

const Hero = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable, selected }, ref) => {
  const props = brick.props;
  const styles = useBrickStyle<Manifest>(brick);
  const classes = Object.values(styles);
  const presetClasses = useColorPreset<Manifest>(brick);
  return (
    <div
      className={tx("flex-grow flex flex-col gap-[1.5rem] min-h-fit", ...classes, presetClasses.main)}
      ref={ref}
    >
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
  );
});

// export default memoizeIgnoringPaths(Hero, ["brick.props.content"]);
export default Hero;
