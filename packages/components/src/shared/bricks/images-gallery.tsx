import { manifest, type Manifest } from "@upstart.gg/sdk/shared/bricks/manifests/images-gallery.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx } from "@upstart.gg/style-system/twind";
import { useCallback, useEffect, useState } from "react";
import { useBrickStyle } from "../hooks/use-brick-style";
import { MdClose, MdChevronLeft, MdChevronRight } from "react-icons/md";
import BrickRoot from "../components/BrickRoot";

export default function ImagesGallery({ brick, editable }: BrickProps<Manifest>) {
  const { props } = brick;
  const styles = useBrickStyle<Manifest>(brick);

  const images = (props.images || []).filter(
    (image) => typeof image.src.src === "string" && image.src.src !== "",
  );

  // State for managing the selected image in the popover
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const columns = Number(props.columns) || 3;

  const getGridClasses = () => {
    const colsMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
    };
    const safeColumns = Math.max(1, Math.min(6, columns));
    return colsMap[safeColumns] || "grid-cols-3";
  };

  // Handle click on the image to open the popover
  const handleImageClick = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedImageIndex(index);
  };

  // Handle closing the popover
  const handleClosePopover = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedImageIndex(null);
  };

  const goToNext = useCallback(() => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prevIndex) => Math.min(images.length - 1, prevIndex! + 1));
  }, [selectedImageIndex, images.length]);

  const goToPrevious = useCallback(() => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prevIndex) => Math.max(0, prevIndex! - 1));
  }, [selectedImageIndex]);

  useEffect(() => {
    if (selectedImageIndex === null) return;
    // use a signal to close the popover when the user clicks outside of the image
    const ctrl = new AbortController();
    const signal = ctrl.signal;
    // When Esc is pressed GLOBALLY, close the popover
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedImageIndex(null);
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "ArrowLeft") {
        goToPrevious();
      }
      e.stopPropagation();
    };
    window.addEventListener("keydown", handleKeyDown, { signal });
    return () => {
      ctrl.abort();
    };
  }, [selectedImageIndex, goToNext, goToPrevious]);

  if (images.length === 0) {
    return (
      <BrickRoot
        editable={editable}
        manifest={manifest}
        className={tx("flex flex-col grow items-center justify-center text-center", Object.values(styles))}
      >
        <div className="p-8">
          {editable ? "Add images to this gallery in the panel" : "No images to display"}
        </div>
      </BrickRoot>
    );
  }

  return (
    <BrickRoot
      editable={editable}
      manifest={manifest}
      className={tx(
        `grid auto-rows-fr @mobile:grid-cols-2 @desktop:${getGridClasses()}`,
        Object.values(styles),
      )}
    >
      {images.map((image, index) => {
        return (
          <div
            key={index}
            className={tx(
              "group relative transition-all justify-center items-center overflow-hidden rounded-lg shadow-md hover:scale-105 min-h-fit col-span-1",
            )}
          >
            <img
              src={image.src.src}
              alt={image.src.alt}
              className={tx(`w-full h-full object-cover cursor-pointer`)}
              onClick={(e) => handleImageClick(e, index)}
            />
          </div>
        );
      })}
      {selectedImageIndex !== null && images[selectedImageIndex] && (
        <div
          className={tx(
            "fixed top-0 left-0 w-screen h-screen",
            "bg-black/80",
            "flex items-center justify-center",
            "z-[99999]",
          )}
          onClick={(e) => {
            // close the popover if clicked outside the image
            if (e.target === e.currentTarget) {
              handleClosePopover(e);
            }
            e.stopPropagation();
          }}
        >
          <div
            className={tx(
              "relative group @mobile:w-[80dvw] @desktop:w-[60dvw] h-[60vh] overflow-y-hidden overflow-x-visible bg-black rounded-xl",
            )}
          >
            <img
              src={images[selectedImageIndex].src.src}
              alt={images[selectedImageIndex].src.alt}
              className={"w-full h-full  object-contain"}
            />
            {images[selectedImageIndex].legend && (
              <div className="absolute left-0 right-0 bottom-0 bg-black/60 text-white text-sm p-2 translate-y-full group-hover:translate-y-0 transition-transform">
                {images[selectedImageIndex].legend}
              </div>
            )}
            <div className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center bg-black/60 text-white cursor-pointer rounded-full">
              <MdClose className="h-6 w-6" onClick={handleClosePopover} aria-label="Close image" />
            </div>
            {/* Previous button - only show if not on first slide */}
            {selectedImageIndex > 0 && (
              <button
                type="button"
                onClick={goToPrevious}
                className={tx(
                  "absolute aspect-square h-14 left-2 top-1/2 -translate-y-1/2 bg-black/60 text-white/80",
                  // "bg-primary-light hover:bg-primary text-primary-content-light",
                  "rounded-full p-2 duration-200  opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center",
                )}
                aria-label="Previous image"
              >
                <MdChevronLeft className="w-7 h-7" />
              </button>
            )}

            {/* Next button - only show if not on last slide */}
            {selectedImageIndex < images.length - 1 && (
              <button
                type="button"
                onClick={goToNext}
                className={tx(
                  "absolute aspect-square h-14 right-2 top-1/2 -translate-y-1/2 bg-black/60 text-white/80",
                  // "bg-primary-light hover:bg-primary text-primary-content-light",
                  "rounded-full p-2 duration-200  opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center",
                )}
                aria-label="Next image"
              >
                <MdChevronRight className="w-7 h-7" />
              </button>
            )}
          </div>
        </div>
      )}
    </BrickRoot>
  );
}
