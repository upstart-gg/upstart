import { forwardRef, memo } from "react";
import BaseComponent from "./BrickComponent";
import { useBrickWrapperStyle } from "../hooks/use-brick-style";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";

const MemoBrickComponent = memo(BaseComponent);

type BrickWrapperProps = {
  brick: Brick;
};

const BrickWrapper = forwardRef<HTMLDivElement, BrickWrapperProps>(({ brick }, ref) => {
  const wrapperClass = useBrickWrapperStyle({
    brick,
  });
  return (
    <div id={brick.id} className={wrapperClass} ref={ref} data-wrapper-type={brick.type}>
      <MemoBrickComponent brick={brick} />
    </div>
  );
});

// const BrickWrapperMemo = memo(BrickWrapper);
export default BrickWrapper;
