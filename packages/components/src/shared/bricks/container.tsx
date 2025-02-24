import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { tx, apply } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/container.manifest";
import BrickWrapper from "~/editor/components/EditableBrick";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";

const Container = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };
  const className = useBrickStyle(props);

  return (
    <div className={tx(apply("flex"), className)} ref={ref}>
      {props.children.length > 0 ? (
        props.children.map((brick, index) => {
          if (props.editable) {
            return <BrickWrapper key={`${brick.id}`} brick={brick} isContainerChild index={index} />;
          }
          // todo: render the brick
          return (
            <div key={brick.id}>
              {brick.type} {brick.id}
            </div>
          );
        })
      ) : (
        <>
          <div className="border border-dotted p-2 flex-1">Drag a brick here</div>
          <div className="border border-dotted p-2 flex-1">and another there</div>
        </>
      )}
    </div>
  );
});

export default Container;
