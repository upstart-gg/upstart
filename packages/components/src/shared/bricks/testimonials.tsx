import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/testimonials.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";
import { useColorPreset } from "../hooks/use-color-preset";
import { InlineIcon } from "@iconify/react";
import BrickRoot from "../components/BrickRoot";

export default function Testimonials({ brick, editable }: BrickProps<Manifest>) {
  const { props } = brick;
  const { gradientDirection, ...styles } = useBrickStyle<Manifest>(brick);
  const presetClasses = useColorPreset<Manifest>(brick);
  const containerClasses = Object.values(styles);

  // If no testimonials, show sample content
  const testimonials =
    props.testimonials.length > 0
      ? props.testimonials
      : [
          {
            author: "John Doe",
            text: "Amazing product!",
            avatar: null,
            company: "Example Corp",
            socialIcon: null,
          },
        ];

  return (
    <BrickRoot className={tx("flex gap-6 @mobile:flex-col @desktop:flex-row", containerClasses)}>
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className={tx(
            "testimonial-item flex flex-1 flex-col gap-4 p-6 rounded-lg border shadow-sm @desktop:(min-w-[250px])",
            presetClasses.card,
            gradientDirection,
          )}
        >
          <div className="testimonial-text flex-1">
            <div className="whitespace-pre-wrap text-pretty font-medium italic text-[110%]">
              {testimonial.text}
            </div>
          </div>

          <div className="testimonial-author flex items-center gap-3">
            {testimonial.avatar && (
              <img
                src={testimonial.avatar.src}
                alt={testimonial.avatar.alt || testimonial.author}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}

            <div className="flex-1 flex-nowrap">
              <div className="font-semibold text-[90%] text-nowrap">{testimonial.author}</div>
              {testimonial.company && <div className="text-[85%]">{testimonial.company}</div>}
            </div>

            {testimonial.socialIcon && <InlineIcon icon={testimonial.socialIcon} className="w-5 h-5" />}
          </div>
        </div>
      ))}
    </BrickRoot>
  );
}
