import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { tx, apply } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";
import { manifest, type Manifest, datasource } from "@upstart.gg/sdk/bricks/manifests/container.manifest";
import BrickWrapper from "~/editor/components/EditableBrick";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useDatasource } from "../hooks/use-datasource";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import BaseBrick from "../components/BaseBrick";

const Container = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  props = { ...Value.Create(manifest).props, ...props };

  const className = useBrickStyle(props);

  const ds = useDatasource<Manifest["props"]["datasourceRef"], typeof datasource>(
    props.datasourceRef,
    datasource,
  );

  // If this container is Dynamic
  if (ds.datasourceId) {
    // Take the first child brick as a template and render it for each item in the datasource
    const template = props.childrenBricks?.at(0) as Brick | undefined;
    // Override childrenBricks with the data from the datasource
    props.childrenBricks = template
      ? ds.data.map((data, index) => {
          return {
            ...template,
            id: `${props.id}-${index}`,
            parentId: props.id,
            props: { ...template.props, datasourceRef: props.datasourceRef, ...data },
          };
        })
      : [];
  }

  return (
    <div className={tx(apply("flex"), className)} ref={ref}>
      {props.childrenBricks?.length > 0 ? (
        props.childrenBricks.map((brick, index) => {
          return props.editable ? (
            <BrickWrapper key={`${brick.id}`} brick={brick} isContainerChild index={index} />
          ) : (
            <BaseBrick key={brick.id} brick={brick} />
          );
        })
      ) : ds.datasourceId ? (
        <>
          <div className="bg-gray-300 flex-1 text-lg">This container is dynamic.</div>
        </>
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
