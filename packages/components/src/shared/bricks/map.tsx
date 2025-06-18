import { forwardRef, lazy, Suspense } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/map.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useBrickStyle } from "../hooks/use-brick-style";
import { tx } from "@upstart.gg/style-system/twind";

const MapContainer = lazy(() => import("../components/Leaflet.MapContainer.client"));
const Marker = lazy(() => import("../components/Leaflet.Marker.client"));
const Tooltip = lazy(() => import("../components/Leaflet.Tooltip.client"));

const WidgetMap = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick }, ref) => {
  const styles = useBrickStyle<Manifest>(brick);
  const props = brick.props;
  return (
    <div className={tx("flex-1 flex", props.preset, Object.values(styles))} ref={ref}>
      <Suspense>
        <MapContainer center={props.location} className={tx("w-full h-full")}>
          {/* Additional map layers or components can be added here */}
          <Marker position={props.location}>
            <Tooltip permanent>{props.location.tooltip}</Tooltip>
          </Marker>
        </MapContainer>
      </Suspense>
    </div>
  );
});

export default WidgetMap;
