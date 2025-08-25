import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { forwardRef, type PropsWithChildren, type ComponentProps } from "react";
import { useContextMenuVisible, useSelectedBrickId } from "../hooks/use-editor";
import { useBrickManifest } from "~/shared/hooks/use-brick-manifest";
import { tx } from "@upstart.gg/style-system/twind";

import EditableBrickTextNavBar from "./EditableBrickTextNavBar";

type EditableBrickNavBarProps = ComponentProps<"div"> &
  PropsWithChildren<{
    brick: Brick;
    isContainerChild?: boolean;
    show: boolean;
  }>;

/**
 * The An horizontal container holding Menu bars that appears at the bottom/top of the brick when it's selected.
 */
const EditableBrickNavBar = forwardRef<HTMLDivElement, EditableBrickNavBarProps>(
  ({ brick, style, isContainerChild, show, ...rest }, ref) => {
    const selectedBrickId = useSelectedBrickId();
    const manifest = useBrickManifest(brick.type);
    const contextMenuVisible = useContextMenuVisible();
    const visible =
      (show && manifest.isContainer && !selectedBrickId) ||
      (show && !manifest.isContainer && !isContainerChild) ||
      selectedBrickId === brick.id;
    // const visible = (show && brick.isContainer && !selectedBrickId) || selectedBrickId === brick.id;
    if (!visible || contextMenuVisible) {
      return null;
    }
    return (
      <div
        ref={ref}
        data-ui
        data-ui-menu-bars-container
        role="navigation"
        className={tx(
          "z-[99999] isolate text-base items-center gap-1",
          "transition-opacity duration-150 border rounded-lg",
          visible ? "opacity-100 flex" : "opacity-0 hidden",
          manifest.isContainer ? "border-orange-300" : "border-transparent",
        )}
        style={style}
        {...rest}
      >
        {/* container for text editor buttons */}
        <EditableBrickTextNavBar brick={brick} />
      </div>
    );
  },
);

export default EditableBrickNavBar;
