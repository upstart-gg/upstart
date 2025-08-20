import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import { tx } from "@upstart.gg/style-system/twind";
import type { ComponentPropsWithoutRef, ElementType } from "react";
import { forwardRef } from "react";

type BrickRootProps<T extends ElementType> = ComponentPropsWithoutRef<T> & {
  as?: T;
  manifest: BrickManifest;
  editable: boolean;
};

/**
 *  <BrickRoot> should be used as the root element for all bricks. It is a direct child of the Brick Wrapper.
 *  It provides a consistent base style and allows for custom elements to be used.
 *  It renders a div by default, but can be customized to render any element using the `as` prop.
 */
const BrickRoot = forwardRef<HTMLElement, BrickRootProps<ElementType>>(function BrickRoot(
  { as, children, manifest, className, editable, ...props },
  ref,
) {
  const Component = as || "div";
  return (
    <Component
      {...props}
      ref={ref}
      className={tx(
        !manifest.isContainer && "min-h-fit min-w-fit",
        "flex flex-1 rounded-[inherit] w-fill h-fill flex-wrap",
        className,
      )}
    >
      {children}
    </Component>
  );
});

BrickRoot.displayName = "BrickRoot";

export default BrickRoot;
