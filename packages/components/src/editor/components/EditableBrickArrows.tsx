import { useBrickManifest } from "~/shared/hooks/use-brick-manifest";
import { useDraftHelpers } from "../hooks/use-page-data";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { tx } from "@upstart.gg/style-system/twind";
import { IoIosArrowBack, IoIosArrowUp, IoIosArrowDown, IoIosArrowForward } from "react-icons/io";

export default function BrickArrows({ brick }: { brick: Brick }) {
  const draftHelpers = useDraftHelpers();
  const manifest = useBrickManifest(brick.type);
  const canMovePrev = draftHelpers.canMoveTo(brick.id, "previous");
  const canMoveNext = draftHelpers.canMoveTo(brick.id, "next");
  const parentContainer = draftHelpers.getParentBrick(brick.id);
  const isContainerChild = !!parentContainer;
  const parentElement = parentContainer ? document.getElementById(parentContainer.id) : null;
  const flexOrientation = parentElement ? getComputedStyle(parentElement).flexDirection || "row" : "row";
  const canMoveLeft =
    (isContainerChild && canMovePrev && flexOrientation === "row") || (!isContainerChild && canMovePrev);
  const canMoveRight =
    (isContainerChild && canMoveNext && flexOrientation === "row") || (!isContainerChild && canMoveNext);
  const canMoveUp = isContainerChild && canMovePrev && flexOrientation === "column";
  const canMoveDown = isContainerChild && canMoveNext && flexOrientation === "column";

  // {isContainerChild && flexOrientation === "column" ? "Move up" : "Move left"}

  const offset = manifest.isContainer ? 9 : 7; // 8px for container, 6px for non-container

  const baseClass =
    "absolute z-[9999] flex items-center justify-center h-5 w-5 rounded-full border border-white text-white bg-upstart-500 shadow-lg hover:(bg-upstart-700)";

  return (
    <>
      {canMoveLeft && (
        <button
          type="button"
          className={tx(baseClass, `top-1/2 -left-${offset} transform -translate-y-1/2`)}
          onClick={(e) => {
            e.stopPropagation();
            draftHelpers.moveBrick(brick.id, "previous");
          }}
        >
          <IoIosArrowBack className="w-3 h-3" />
        </button>
      )}
      {canMoveUp && (
        <button
          type="button"
          className={tx(baseClass, `-top-${offset} left-1/2 transform -translate-x-1/2`)}
          onClick={(e) => {
            e.stopPropagation();
            draftHelpers.moveBrick(brick.id, "previous");
          }}
        >
          <IoIosArrowUp className="w-3 h-3" />
        </button>
      )}
      {canMoveRight && (
        <button
          type="button"
          className={tx(baseClass, `top-1/2 -right-${offset} transform -translate-y-1/2`)}
          onClick={(e) => {
            e.stopPropagation();
            draftHelpers.moveBrick(brick.id, "next");
          }}
        >
          <IoIosArrowForward className="w-3 h-3" />
        </button>
      )}
      {canMoveDown && (
        <button
          type="button"
          className={tx(baseClass, `-bottom-${offset} left-1/2 transform -translate-x-1/2`)}
          onClick={(e) => {
            e.stopPropagation();
            draftHelpers.moveBrick(brick.id, "next");
          }}
        >
          <IoIosArrowDown className="w-3 h-3" />
        </button>
      )}
    </>
  );
}
