import { Value } from "@sinclair/typebox/value";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { lazy, Suspense, type ComponentProps, type ComponentType, type LazyExoticComponent } from "react";
import { manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";

// Load all bricks in the bricks directory
const bricks = import.meta.glob<false, string, { default: ComponentType<unknown> }>(["../bricks/*.tsx"]);

const bricksMap = Object.entries(bricks).reduce(
  (acc, [path, importFn]) => {
    // Extract component name from path (e.g., ./components/Button.jsx -> Button)
    const componentName = path.match(/\.\/bricks\/(.*)\.tsx$/)![1];
    // Create lazy component using React.lazy
    acc[componentName] = lazy(importFn);
    return acc;
  },
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  {} as Record<string, LazyExoticComponent<ComponentType<any>>>,
);

const BaseBrick = ({ brick, editable }: { brick: Brick; editable?: boolean } & ComponentProps<"div">) => {
  const BrickModule = bricksMap[brick.type];
  if (!BrickModule) {
    console.warn("Brick not found", brick.type);
    return null;
  }

  const brickProps = { ...Value.Create(manifests[brick.type]).props, ...brick.props };

  return (
    <Suspense>
      <BrickModule {...brickProps} mobileOverride={brick.mobileOverride} editable={editable} />
    </Suspense>
  );
};

export default BaseBrick;
