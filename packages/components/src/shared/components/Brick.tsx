import { forwardRef, memo } from "react";
import BaseBrick from "./BaseBrick";
import { useBrickWrapperStyle } from "../hooks/use-brick-style";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";

const MemoBrickComponent = memo(BaseBrick);

type BrickWrapperProps = {
  brick: Brick;
};

const BrickWrapper = forwardRef<HTMLDivElement, BrickWrapperProps>(({ brick }, ref) => {
  const wrapperClass = useBrickWrapperStyle({
    brick,
  });
  return (
    <div id={brick.id} className={wrapperClass} ref={ref}>
      <MemoBrickComponent brick={brick} />
    </div>
  );
});

// const BrickWrapperMemo = memo(BrickWrapper);
export default BrickWrapper;
