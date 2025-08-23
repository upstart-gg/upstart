import { CollisionPriority } from "@dnd-kit/abstract";
import { directionBiased, pointerDistance, pointerIntersection } from "@dnd-kit/collision";
import { useDroppable } from "@dnd-kit/react";
import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx } from "@upstart.gg/style-system/twind";
import type { ComponentPropsWithoutRef, ElementType } from "react";

type BrickRootProps<T extends ElementType> = ComponentPropsWithoutRef<T> & {
  as?: T;
  manifest: BrickManifest;
  editable?: boolean;
  brick: BrickProps<BrickManifest>["brick"];
};

/**
 *  <BrickRoot> should be used as the root element for all bricks. It is a direct child of the Brick Wrapper.
 *  It provides a consistent base style and allows for custom elements to be used.
 *  It renders a div by default, but can be customized to render any element using the `as` prop.
 */
export default function BrickRoot({
  as,
  children,
  manifest,
  className,
  editable,
  brick,
  ...props
}: BrickRootProps<ElementType>) {
  /**
   * If the brick is a container, it can accept other bricks.
   */
  const droppable = useDroppable({
    id: brick.id,
    data: { brick, manifest },
    disabled: !editable || !manifest.isContainer,
    type: "brick",
    collisionDetector: directionBiased,
    collisionPriority: CollisionPriority.High,
  });

  const Component = as || "div";
  return (
    <Component
      {...props}
      ref={droppable.ref}
      className={tx(
        !manifest.isContainer && "min-h-fit min-w-fit",
        "flex flex-1 rounded-[inherit] w-fill h-fill flex-wrap",
        className,
      )}
    >
      {children}
    </Component>
  );
}
