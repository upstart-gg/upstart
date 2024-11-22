import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { lazy, Suspense, type ComponentProps, type ComponentType, type LazyExoticComponent } from "react";

const BrickText = lazy(() => import("../bricks/text"));
const BrickHero = lazy(() => import("../bricks/hero"));
const BrickImage = lazy(() => import("../bricks/image"));

// const bricks = import.meta.glob("../bricks/*");

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const bricksMap: Record<string, LazyExoticComponent<ComponentType<any>>> = {
  text: BrickText,
  hero: BrickHero,
  image: BrickImage,
};

const BaseBrick = ({
  brick,
  textEditable,
  ...otherProps
}: { brick: Brick; textEditable?: boolean } & ComponentProps<"div">) => {
  // const BrickModule = lazy(() => import(`../bricks/${brick.type}.js`));
  const BrickModule = bricksMap[brick.type];
  if (!BrickModule) {
    return null;
  }
  const { wrapper, ...rest } = brick.props;
  return (
    <Suspense>
      <BrickModule id={brick.id} {...rest} {...otherProps} textEditable={textEditable} />
    </Suspense>
  );
};

export default BaseBrick;
