import type { Manifest } from "@upstart.gg/sdk/shared/bricks/manifests/carousel.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx } from "@upstart.gg/style-system/twind";
import { forwardRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useBrickStyle } from "../hooks/use-brick-style";

const Carousel = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const { props } = brick;
  const styles = useBrickStyle<Manifest>(brick);
  const images = props.images || [];
  const title = props.title;
  const navigation = props.navigation || "pager-dots";

  const classes = Object.values(styles);

  // State for managing the current image index
  const [currentIndex, setCurrentIndex] = useState(0);

  const borderRadius = props.borderRadius || "rounded-md";

  // Check which navigation is enabled
  const showArrows = navigation === "pager-arrows";
  const showDots = navigation === "pager-dots";
  const showNumbers = navigation === "pager-numbers";

  // Handle navigation
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => Math.min(images.length - 1, prevIndex + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (images.length === 0) {
    return (
      <div
        ref={ref}
        className={tx("flex flex-col flex-1 items-center justify-center p-8 bg-gray-100", borderRadius)}
      >
        {title && <div className={tx("text-lg font-semibold mb-4", styles.title)}>{title}</div>}
        <div className="text-gray-500">No images to display</div>
      </div>
    );
  }

  return (
    <div ref={ref} className={tx("flex flex-col flex-1", styles.container)}>
      {title && (
        <div className={tx("text-[110%] w-full text-center font-semibold", styles.title)}>{title}</div>
      )}

      <div className="relative group flex-1 flex flex-col min-h-0 gap-2">
        {editable && images.length === 0 && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/30 rounded-lg flex items-center justify-center z-10">
            <div className="text-white text-center rounded-md bg-black/30 p-4">
              <div className="text-2xl font-bold">Carousel</div>
              <div className="text-base">Add images or edit content in the panel</div>
            </div>
          </div>
        )}

        {/* Main image display */}
        <div className={tx("relative overflow-hidden flex-1 min-h-0", borderRadius)}>
          <div
            className="flex transition-transform duration-300 ease-in-out absolute inset-0"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images
              .filter((image) => typeof image.src.src === "string" && image.src.src !== "")
              .map((image, index) => (
                <div key={index} className="w-full flex-shrink-0 relative flex items-center justify-center">
                  <img
                    src={image.src.src}
                    alt={image.src.alt}
                    className={tx("w-full h-full object-cover", borderRadius)}
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
                    "bg-primary-light hover:bg-primary text-primary-content-light",
                    "rounded-full p-2 transition-all duration-200",
                    showArrows ? "opacity-100" : "opacity-0 group-hover:opacity-100",
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
                    "bg-primary-light hover:bg-primary text-primary-content-light",
                    "rounded-full p-2 transition-all duration-200",
                    showArrows ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                  )}
                  aria-label="Next image"
                >
                  <FiChevronRight className="w-5 h-5" />
                </button>
              )}
            </>
          )}
        </div>

        {/* Pagination indicators - show based on selected variant */}
        {images.length > 1 && (showDots || showNumbers) && (
          <div className="flex justify-center gap-1 pb-2">
            {showNumbers
              ? // Numbered pagination
                images.map((_, index: number) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goToSlide(index)}
                    className={tx(
                      "w-6 h-6 rounded-full transition-all duration-200 text-xs font-medium",
                      currentIndex === index
                        ? "bg-primary text-primary-content"
                        : "bg-primary-300 text-primary-content-light hover:bg-primary hover:text-primary-content",
                    )}
                    aria-label={`Go to image ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                ))
              : // Dots pagination
                images.map((_, index: number) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goToSlide(index)}
                    className={tx(
                      "w-2.5 h-2.5 rounded-full transition-all duration-200",
                      currentIndex === index ? "bg-primary scale-110" : "bg-primary-300 hover:bg-primary",
                    )}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default Carousel;
