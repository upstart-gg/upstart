import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/testimonials.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { css, tx } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";
import { InlineIcon } from "@iconify/react";
import BrickRoot from "../components/BrickRoot";
import { useBrickProps } from "../hooks/use-brick-props";
import { useState } from "react";

export default function Testimonials(props: BrickProps<Manifest>) {
  const { brick, editable } = props;

  const brickProps = useBrickProps(props);
  const { colorPreset, border, shadow, ...styles } = useBrickStyle<Manifest>(brick);
  const containerClasses = Object.values(styles);
  const [showImage, setShowImage] = useState(true);

  const testimonials = brickProps.testimonials ?? [];

  const onImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    setShowImage(false);
  };

  return (
    <BrickRoot
      editable={editable}
      manifest={manifest}
      className={tx("flex gap-6 @mobile:flex-col @desktop:flex-row", containerClasses)}
    >
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className={tx(
            "flex flex-1 flex-col gap-6 p-6 rounded-lg @desktop:(min-w-[250px])",
            colorPreset,
            border,
            shadow,
          )}
        >
          <blockquote
            className={tx(
              "flex-1 whitespace-pre-wrap text-pretty font-normal italic relative leading-relaxed",
            )}
          >
            {testimonial.text}
          </blockquote>

          <div className="flex items-center gap-3 flex-nowrap">
            {showImage && testimonial.avatar?.src && (
              <img
                src={testimonial.avatar.src}
                alt={testimonial.avatar.alt || testimonial.author}
                className="w-12 h-12 rounded-full object-cover"
                onError={onImageError}
              />
            )}

            <div className="flex-1 flex-nowrap leading-tight">
              <cite className={tx("font-semibold text-[90%] text-nowrap")}>{testimonial.author}</cite>
              {testimonial.company && <div className={tx("text-[85%]")}>{testimonial.company}</div>}
            </div>

            {testimonial.socialIcon && <InlineIcon icon={testimonial.socialIcon} className="h-5 w-5" />}
          </div>
        </div>
      ))}
    </BrickRoot>
  );
}
