import { tx } from "@upstart.gg/style-system/twind";
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { forwardRef } from "react";

interface BrickRootProps<T extends ElementType> {
  as?: T;
  children?: ReactNode;
}

/**
 *  <BrickRoot> should be used as the root element for all bricks.
 *  It provides a consistent base style and allows for custom elements to be used.
 *  It renders a div by default, but can be customized to render any element using the `as` prop.
 */
const BrickRoot = forwardRef<
  HTMLElement,
  BrickRootProps<ElementType> & Omit<ComponentPropsWithoutRef<ElementType>, keyof BrickRootProps<ElementType>>
>(function BrickRoot({ as, children, className, ...props }, ref) {
  const Component = as || "div";
  return (
    <Component {...props} ref={ref} className={tx("flex-1 !min-h-fit !min-w-fit max-sm:w-full", className)}>
      {children}
    </Component>
  );
});

BrickRoot.displayName = "BrickRoot";

export default BrickRoot;
