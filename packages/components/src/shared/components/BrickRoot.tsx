import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import { tx } from "@upstart.gg/style-system/twind";
import type { ComponentPropsWithoutRef, ElementType } from "react";
import { forwardRef } from "react";

type BrickRootProps<T extends ElementType> = ComponentPropsWithoutRef<T> & {
  as?: T;
  manifest: BrickManifest;
};

/**
 *  <BrickRoot> should be used as the root element for all bricks.
 *  It provides a consistent base style and allows for custom elements to be used.
 *  It renders a div by default, but can be customized to render any element using the `as` prop.
 */
const BrickRoot = forwardRef<HTMLElement, BrickRootProps<ElementType>>(function BrickRoot(
  { as, children, manifest, className, ...props },
  ref,
) {
  const Component = as || "div";
  return (
    <Component
      {...props}
      ref={ref}
      className={tx(
        manifest.isContainer ? "grow self-stretch" : "flex-1 min-h-fit min-w-fit",
        "flex rounded-[inherit]",
        className,
      )}
    >
      {children}
    </Component>
  );
});

BrickRoot.displayName = "BrickRoot";

export default BrickRoot;
