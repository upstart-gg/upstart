import { forwardRef } from "react";
import { useBrickStyle } from "../hooks/use-brick-style";
import { type Manifest, manifest } from "@upstart.gg/sdk/shared/bricks/manifests/vbox.manifest";
import EditableBrickWrapper from "~/editor/components/EditableBrick";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useDatasource } from "../hooks/use-datasource";
import { processBrick, type Brick } from "@upstart.gg/sdk/shared/bricks";
import BrickWrapper from "../components/BrickWrapper";
import { tx } from "@upstart.gg/style-system/twind";
import { type DraggableChildrenFn, Droppable } from "@hello-pangea/dnd";
import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import { manifests } from "@upstart.gg/sdk/shared/bricks/manifests/all-manifests";
import { getDraggableStyle } from "~/editor/utils/dnd";
import { IconRender } from "~/editor/components/IconRender";
import { useDeviceInfo } from "~/editor/hooks/use-device-info";

const Vbox = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const props = brick.props;
  const styles = useBrickStyle<Manifest>(brick);
  const classes = Object.values(styles);
  const ds = useDatasource(props.datasource, manifest.datasource);

  // // If this container is Dynamic
  // if (ds.datasourceId && props.$childrenType) {
  //   console.log("override childrenBricks with data from datasource", ds.data);
  //   // Take the first child brick as a template and render it for each item in the datasource
  //   const template = props.$children?.at(0) as Brick | undefined;
  //   // Override childrenBricks with the data from the datasource
  //   props.$children =
  //     template && ds.data !== null
  //       ? ds.data
  //           .map((data, index) =>
  //             processBrick({
  //               ...template,
  //               id: `${brick.id}-${index}`,
  //               props: { ...template.props, datasourceRef: props.datasource, ...data },
  //             }),
  //           )
  //           .filter(Boolean)
  //       : [];
  // }

  if (editable) {
    return (
      <div className={tx("flex flex-1 flex-col relative", ...classes)} ref={ref}>
        <DroppableVbox brick={brick} />
      </div>
    );
  }

  return (
    <div className={tx("flex-1", Object.values(styles))} ref={ref}>
      {props.$children?.map((brick) => (
        <BrickWrapper key={brick.id} brick={brick} />
      ))}
    </div>
  );
});

export const renderClone: DraggableChildrenFn = (provided, snapshot, rubric) => {
  const brick = manifests[rubric.draggableId] as BrickManifest;
  return (
    <button
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      className={tx(
        `rounded border border-upstart-100 border-upstart-600 bg-upstart-50 bg-white dark:bg-dark-700 !cursor-grab
        active:!cursor-grabbing touch-none select-none pointer-events-auto draggable-brick group aspect-square
        z-[99999] flex flex-col items-center justify-center
        [&:is(.clone)]:(opacity-80 !bg-white)`,
      )}
    >
      <div
        className={tx(
          "flex-1 flex flex-col justify-center text-upstart-700 dark:text-upstart-400 items-center gap-1 rounded-[inherit]",
        )}
      >
        <IconRender {...brick} />
        <span className={tx("whitespace-nowrap text-xs")}>{brick.name}</span>
      </div>
    </button>
  );
};

const renderClone2: DraggableChildrenFn = (provided, snapshot, rubric) => {
  return (
    <div
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      style={{
        ...provided.draggableProps.style,
        scale: 0.2,
      }}
    />
  );
};

function DroppableVbox({ brick }: BrickProps<Manifest>) {
  const props = brick.props;
  const styles = useBrickStyle<Manifest>(brick);
  const classes = Object.values(styles);
  const { isDesktop } = useDeviceInfo();
  const ds = useDatasource(props.datasource, manifest.datasource);
  return (
    <Droppable droppableId={brick.id} type="brick" isCombineEnabled isDropDisabled={!isDesktop}>
      {(droppableProvided, droppableSnapshot) => (
        <div
          {...droppableProvided.droppableProps}
          ref={droppableProvided.innerRef}
          className={tx(
            "flex-1 flex flex-col relative",
            droppableSnapshot.isDraggingOver && "!outline !outline-2 !outline-orange-300",
            ...classes,
          )}
        >
          {props.$children?.length > 0 ? (
            props.$children.map((brick, index) => {
              return (
                <EditableBrickWrapper key={`${brick.id}`} brick={brick} isContainerChild index={index} />
              );
            })
          ) : ds.datasourceId ? (
            <div className="bg-gradient-to-tr from-gray-200/80 to-gray-100/80 text-black flex justify-center items-center flex-1 text-lg font-bold">
              This container is dynamic.
              <pre className="text-xs font-mono">{JSON.stringify(props, null, 2)}</pre>
            </div>
          ) : (
            <div
              className={tx(
                "w-full h-full text-center  border-4 border-gray-300 border-dotted p-4 rounded flex justify-center items-center text-base text-black/50 font-medium",
              )}
            >
              This is a container.
              <br />
              Drag bricks here to stack them inside.
            </div>
          )}
          {droppableProvided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default Vbox;
