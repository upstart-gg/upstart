import { forwardRef, lazy, Suspense, useEffect, useRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/map.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useBrickStyle } from "../hooks/use-brick-style";
import { tx } from "@upstart.gg/style-system/twind";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const WidgetMap = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick }, ref) => {
  const styles = useBrickStyle<Manifest>(brick);
  const props = brick.props;
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize the map
    const map = L.map(mapRef.current).setView([props.location.lat, props.location.lng], 13);

    // Add tile layer
    L.tileLayer("https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add marker with tooltip
    const marker = L.marker([props.location.lat, props.location.lng]).addTo(map);

    if (props.location.tooltip) {
      marker
        .bindTooltip(props.location.tooltip, {
          permanent: true,
          direction: "top",
        })
        .openTooltip();
    }

    // Store references
    mapInstanceRef.current = map;
    markerRef.current = marker;

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current = null;
      }
    };
  }, []); // Empty dependency array for initial setup

  // Update map when location changes
  useEffect(() => {
    if (mapInstanceRef.current && markerRef.current) {
      const newLatLng = L.latLng(props.location.lat, props.location.lng);

      // Update map center
      mapInstanceRef.current.setView(newLatLng, mapInstanceRef.current.getZoom());

      // Update marker position
      markerRef.current.setLatLng(newLatLng);

      // Update tooltip
      if (props.location.tooltip) {
        markerRef.current
          .bindTooltip(props.location.tooltip, {
            permanent: true,
            direction: "top",
          })
          .openTooltip();
      } else {
        markerRef.current.unbindTooltip();
      }
    }
  }, [props.location]);

  return (
    <div className={tx("flex-1 flex", props.preset, Object.values(styles))} ref={ref}>
      <div
        ref={mapRef}
        className={tx("w-full h-full")}
        style={{ minHeight: "200px" }} // Ensure minimum height for map
      />
    </div>
  );
});

export default WidgetMap;
