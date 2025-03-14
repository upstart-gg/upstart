import { Value } from "@sinclair/typebox/value";
import { forwardRef } from "react";
import { tx, apply } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/container.manifest";
import EditaleBrickWrapper from "~/editor/components/EditableBrick";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useDatasource } from "../hooks/use-datasource";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import BaseBrick from "../components/BaseBrick";

const Container = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick }, ref) => {
  const props = brick.props;

  const className = useBrickStyle(brick);
  const ds = useDatasource(props.datasource.ds);

  // If this container is Dynamic
  if (ds.datasourceId && props.layout.childrenType) {
    // Take the first child brick as a template and render it for each item in the datasource
    const template = props.layout.childrenBricks?.at(0) as Brick | undefined;
    // Override childrenBricks with the data from the datasource
    props.layout.childrenBricks =
      template && ds.data !== null
        ? ds.data.map((data, index) => {
            return {
              ...template,
              id: `${brick.id}-${index}`,
              parentId: brick.id,
              props: { ...template.props, datasourceRef: props.datasource, ...data },
            };
          })
        : [];
  }

  return (
    <div className={tx(apply("flex relative"), className)} ref={ref}>
      {props.layout.childrenBricks?.length > 0 ? (
        props.layout.childrenBricks.map((brick, index) => {
          return props.editable ? (
            <EditaleBrickWrapper key={`${brick.id}`} brick={brick} isContainerChild index={index} />
          ) : (
            <BaseBrick key={brick.id} brick={brick} />
          );
        })
      ) : ds.datasourceId ? (
        <>
          <div className="bg-gradient-to-tr from-gray-300/80 to-gray-200/80 text-black flex justify-center items-center flex-1 text-lg font-bold">
            This container is dynamic.
            <pre className="text-xs font-mono">{JSON.stringify(props, null, 2)}</pre>
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-2 rounded-lg bg-black/30 text-white flex justify-center items-center font-bold">
            This a a container
            <br />
            Drag bricks here
          </div>
        </>
      )}
    </div>
  );
});

export default Container;
