import { type Manifest, manifest } from "@upstart.gg/sdk/shared/bricks/manifests/images-gallery.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx } from "@upstart.gg/style-system/twind";
import { forwardRef, useState } from "react";
import { useBrickStyle } from "../hooks/use-brick-style";
import { useDatasource } from "../hooks/use-datasource";

/**
 * Containers can operate in two modes: Static and Dynamic.
 * `props.childrenBricks` are present only when the container is in Static mode. Its children are the bricks that are inside the container.
 * Otherwise, the children data are fetched from the datasource and rendered accordingly.
 */
const ImagesWall = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick }, ref) => {
  const { props } = brick;
  const styles = useBrickStyle<Manifest>(brick);
  const { datasourceId, data, isSample } = useDatasource(props.datasource, manifest.datasource);
  const staticImages = props.staticImages || [];
  const title = props.title;

  // State for managing the selected image in the popover
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const columns = Number(props.columns) || 3;
  const borderRadius = props.borderRadius || "rounded-md";

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

  return (
    <div>
      <div ref={ref} className={tx("flex flex-1")}>
        <div className={"flex flex-col flex-1"}>
          {title && (
            <div className={tx("text-lg w-full text-center font-semibold", styles.title)}>{title}</div>
          )}
          <div
            className={tx("h-full", "overflow-visible", `grid ${getGridClasses()}`, Object.values(styles))}
          >
            {props.editable && isSample && (
              <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/30 rounded-lg flex items-center justify-center">
                <div className="text-white text-center rounded-md bg-black/30 p-4">
                  <div className="text-2xl font-bold">Images Wall</div>
                  <div className="text-base">Drag and drop images here or edit content in the panel</div>
                </div>
              </div>
            )}
            {staticImages.map((image, index) => {
              return (
                <div key={index} className={tx("grid relative justify-center items-center  hover:scale-105")}>
                  <img
                    src={image.src.src}
                    alt={image.src.alt}
                    className={tx("w-full transition-all object-contain cursor-pointer", borderRadius)}
                    onClick={(e) => handleImageClick(e, index)}
                  />
                  {image.legend && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-sm p-2">
                      {image.legend}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {selectedImageIndex !== null && staticImages[selectedImageIndex] && (
        <div
          className={tx(
            "fixed top-0 left-0 w-screen h-screen",
            "bg-black/80",
            "flex items-center justify-center",
            "z-[9999]",
          )}
          onClick={(e) => {
            // close the popover if clicked outside the image
            if (e.target === e.currentTarget) {
              handleClosePopover(e);
            }
          }}
        >
          <div
            className={tx("relative max-w-[50vw] max-h-[50vh]", "flex items-center justify-center")}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={staticImages[selectedImageIndex].src.src}
              alt={staticImages[selectedImageIndex].src.alt}
              className={"max-w-full max-h-full object-contain"}
            />
          </div>
        </div>
      )}
    </div>
  );
});

export default ImagesWall;
