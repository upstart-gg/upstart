import { type Manifest, manifest } from "@upstart.gg/sdk/shared/bricks/manifests/dynamic.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import BrickWrapper from "../components/BrickWrapper";
import { tx } from "@upstart.gg/style-system/twind";
import BrickRoot from "../components/BrickRoot";
import { lazy, Suspense } from "react";
import EditableBrickWrapper from "~/editor/components/EditableBrick";
import { useBrickStyle } from "../hooks/use-brick-style";
import { useDatasource, useDatasourceSamples } from "~/editor/hooks/use-datasource";
import { useData } from "~/editor/hooks/use-page-data";

const LazyDroppableBox = lazy(() => import("../../editor/components/DroppableBox"));

export default function Dynamic({ brick, editable, level }: BrickProps<Manifest>) {
  const { props } = brick;

  // Datasource handling
  const { datasource: dsField } = props;
  const datasource = useDatasource(dsField?.id);
  const samples = useDatasourceSamples(dsField?.id);
  const dataset = useData(brick.id, samples);

  // Styling
  const styles = useBrickStyle<Manifest>(brick);
  const { repeatDirection, repeatGap, ...innerStyles } = styles;
  const repeatProps = { repeatDirection, repeatGap };

  // console.log({ samples, realdata });

  if (dsField && editable) {
    return (
      <BrickRoot
        editable={editable}
        manifest={manifest}
        className={tx("@mobile:flex-wrap relative", Object.values(repeatProps))}
      >
        {dataset.slice(0, dsField.limit ?? 1).map((data, index) =>
          index === 0 ? (
            <LazyDroppableBox
              key={index}
              brick={brick}
              className={Object.values(innerStyles)}
              dynamic
              datasource={dsField}
              level={level}
            />
          ) : props.$children?.length && props.showDynamicPreview ? (
            <div key={index} className={tx("relative flex flex-1", Object.values(innerStyles))}>
              {props.$children?.map((brick) => (
                <EditableBrickWrapper
                  level={(level ?? 0) + 1}
                  key={`${brick.id}-${brick.props.lastTouched}`}
                  brick={brick}
                  isContainerChild
                  dynamicPreview
                  index={index}
                />
              ))}
              <DynamicPreviewLabel />
            </div>
          ) : null,
        )}
      </BrickRoot>
    );
  }

  return (
    <BrickRoot editable={editable} manifest={manifest} className={tx("flex @mobile:flex-wrap")}>
      {editable ? (
        <Suspense>
          <LazyDroppableBox brick={brick} className={Object.values(innerStyles)} dynamic level={level} />
        </Suspense>
      ) : (
        props.$children?.map((brick) => <BrickWrapper key={brick.id} brick={brick} />)
      )}
    </BrickRoot>
  );
}

function DynamicPreviewLabel() {
  return (
    <div className="absolute overflow-hidden inset-0 z-[9999] text-sm flex justify-center items-center ">
      <span className="-rotate-12 font-bold px-3 py-1 bg-black/30 text-white w-[50%] min-w-[120px] max-w-[150px] text-center rounded-lg">
        Dynamic Preview
      </span>
    </div>
  );
}
