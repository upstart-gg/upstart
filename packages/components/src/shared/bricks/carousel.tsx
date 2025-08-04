import { manifest, type Manifest } from "@upstart.gg/sdk/shared/bricks/manifests/carousel.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx } from "@upstart.gg/style-system/twind";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useBrickStyle } from "../hooks/use-brick-style";
import BrickRoot from "../components/BrickRoot";

export default function Carousel({ brick, editable }: BrickProps<Manifest>) {
  const { props } = brick;
  const styles = useBrickStyle<Manifest>(brick);
  const images = (props.images || []).filter(
    (image) => typeof image.src.src === "string" && image.src.src !== "",
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle navigation
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => Math.min(images.length - 1, prevIndex + 1));
  };

  if (images.length === 0) {
    return (
      <BrickRoot
        editable={editable}
        manifest={manifest}
        className={tx("flex flex-col items-center justify-center text-center", Object.values(styles))}
      >
        <div className="p-8">
          {editable ? "Add images to this carousel in the panel" : "No images to display"}
        </div>
      </BrickRoot>
    );
  }

  return (
    <BrickRoot editable={editable} manifest={manifest} className={tx("flex flex-col", Object.values(styles))}>
      <div className={tx("relative overflow-hidden group flex-1")}>
        <div
          className="flex transition-transform duration-300 ease-in-out absolute inset-0"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0 relative flex items-center justify-center">
              <img
                src={image.src.src}
                alt={image.src.alt}
                className={tx("w-full h-full object-cover")}
                style={{ display: "block" }}
              />
              {image.legend && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-3">
                  {image.legend}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation arrows - show only when navigation is possible in that direction */}
        {images.length > 1 && (
          <>
            {/* Previous button - only show if not on first slide */}
            {currentIndex > 0 && (
              <button
                type="button"
                onClick={goToPrevious}
                className={tx(
                  "absolute left-2 top-1/2 -translate-y-1/2",
                  // "bg-primary-light hover:bg-primary text-primary-content-light",
                  // presetClasses.arrows,
                  "rounded-full p-2 transition-all duration-200",
                  "opacity-0 group-hover:opacity-100",
                )}
                aria-label="Previous image"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Next button - only show if not on last slide */}
            {currentIndex < images.length - 1 && (
              <button
                type="button"
                onClick={goToNext}
                className={tx(
                  "absolute right-2 top-1/2 -translate-y-1/2",
                  // "bg-primary-light hover:bg-primary text-primary-content-light",
                  // presetClasses.arrows,
                  "rounded-full p-2 transition-all duration-200",
                  "opacity-0 group-hover:opacity-100",
                )}
                aria-label="Next image"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            )}
          </>
        )}
      </div>
    </BrickRoot>
  );
}
