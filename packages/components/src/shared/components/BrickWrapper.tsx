import { forwardRef } from "react";
import BrickComponent from "./BrickComponent";
import { useBrickWrapperStyle } from "../hooks/use-brick-style";
import type { Brick } from "@upstart.gg/sdk/bricks";

type BrickWrapperProps = {
  brick: Brick;
};

const BrickWrapper = forwardRef<HTMLDivElement, BrickWrapperProps>(({ brick }, ref) => {
  const wrapperClass = useBrickWrapperStyle({
    brick,
  });
  return (
    <div id={brick.id} className={wrapperClass} ref={ref}>
      <BrickComponent brick={brick} />
    </div>
  );
});

// const BrickWrapperMemo = memo(BrickWrapper);
export default BrickWrapper;
