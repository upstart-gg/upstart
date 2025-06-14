import { forwardRef } from "react";
import { useBrickStyle } from "../hooks/use-brick-style";
import { type Manifest, manifest } from "@upstart.gg/sdk/bricks/manifests/container.manifest";
import EditableBrickWrapper from "~/editor/components/EditableBrick";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useDatasource } from "../hooks/use-datasource";
import { processBrick, type Brick } from "@upstart.gg/sdk/shared/bricks";
import BrickWrapper from "../components/BrickWrapper";
import { tx, css } from "@upstart.gg/style-system/twind";

const Container = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const props = brick.props;

  const styles = useBrickStyle<Manifest>(brick);
  const ds = useDatasource(props.datasource, manifest.datasource);

  // If this container is Dynamic
  if (ds.datasourceId && props.$childrenType) {
    console.log("override childrenBricks with data from datasource", ds.data);
    // Take the first child brick as a template and render it for each item in the datasource
    const template = props.$children?.at(0) as Brick | undefined;
    // Override childrenBricks with the data from the datasource
    props.$children =
      template && ds.data !== null
        ? ds.data.map(
            (data, index) =>
              processBrick({
                ...template,
                id: `${brick.id}-${index}`,
                props: { ...template.props, datasourceRef: props.datasource, ...data },
              }) satisfies Brick,
          )
        : [];
  }

  return (
    // Always apply the "brick" class
    <div className={tx("brick flex-1", Object.values(styles))} ref={ref}>
      {props.$children?.length > 0 ? (
        props.$children.map((brick, index) => {
          return editable ? (
            <EditableBrickWrapper key={`${brick.id}`} brick={brick} isContainerChild index={index} />
          ) : (
            <BrickWrapper key={brick.id} brick={brick} />
          );
        })
      ) : ds.datasourceId ? (
        <div className="bg-gradient-to-tr from-gray-300/80 to-gray-200/80 text-black flex justify-center items-center flex-1 text-lg font-bold">
          This container is dynamic.
          <pre className="text-xs font-mono">{JSON.stringify(props, null, 2)}</pre>
        </div>
      ) : (
        <>
          <div className="absolute text-center inset-2 rounded-inherit bg-black/30 flex justify-center items-center text-xl text-white font-semibold">
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
