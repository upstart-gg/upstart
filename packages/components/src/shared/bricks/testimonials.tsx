import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/testimonials.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx } from "@upstart.gg/style-system/twind";
import { forwardRef } from "react";
import { useBrickStyle } from "../hooks/use-brick-style";
import { useColorPreset } from "../hooks/use-color-preset";
import { renderIcon } from "../utils/icon-resolver";

const Testimonials = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const { props } = brick;
  const styles = useBrickStyle<Manifest>(brick);
  const presetClasses = useColorPreset<Manifest>(brick);
  const classes = Object.values(styles);

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
    <div
      ref={ref}
      className={tx(
        "flex flex-1 gap-6",
        props.orientation === "vertical" ? "flex-col" : "flex-row flex-wrap",
        presetClasses.container,
        ...classes,
      )}
    >
      {testimonials.map((testimonial, index) => (
        <div
          key={index}
          className={tx(
            "testimonial-item flex flex-col gap-4 p-6 rounded-lg border border-gray-200 bg-white shadow-sm",
            props.orientation === "horizontal" ? "flex-1" : "w-full",
          )}
        >
          <div className="testimonial-text flex-1">
            <div className="whitespace-pre-wrap text-pretty">{testimonial.text}</div>
          </div>

          <div className="testimonial-author flex items-center gap-3">
            {testimonial.avatar && (
              <img
                src={testimonial.avatar.src}
                alt={testimonial.avatar.alt || testimonial.author}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}

            <div className="flex-1">
              <div className="font-semibold">{testimonial.author}</div>
              {testimonial.company && <div className="text-sm">{testimonial.company}</div>}
            </div>

            {testimonial.socialIcon && (
              <div className="w-5 h-5">{renderIcon(testimonial.socialIcon, "w-5 h-5")}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});

Testimonials.displayName = "Testimonials";

export default Testimonials;
