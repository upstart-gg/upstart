import { useEffect, useMemo, useRef } from "react";
import { type Manifest, DEFAULTS } from "@upstart.gg/sdk/bricks/manifests/map.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useBrickStyle } from "../hooks/use-brick-style";
import { tx } from "@upstart.gg/style-system/twind";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export function WidgetMap({ brick, editable }: BrickProps<Manifest>) {
  const styles = useBrickStyle<Manifest>(brick);
  const props = brick.props;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const lat = useMemo(() => props.location?.lat ?? DEFAULTS.lat, [props.location?.lat]);
  const lng = useMemo(() => props.location?.lng ?? DEFAULTS.lng, [props.location?.lng]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize the map
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: false, // Disable dragging for static maps
      touchZoom: false, // Disable touch zoom for static maps
      scrollWheelZoom: false, // Disable scroll wheel zoom for static maps
      doubleClickZoom: false, // Disable double click zoom for static maps
      boxZoom: false, // Disable box zoom for static maps
      keyboard: false, // Disable keyboard controls for static maps
      trackResize: editable, // Enable resize tracking
    }).setView([lat, lng], props.location.zoom ?? DEFAULTS.zoom);

    // Add tile layer
    L.tileLayer("https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png", {
      zIndex: 40,
      // attribution:
      //   '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Add marker with tooltip
    const marker = L.marker([lat, lng]).addTo(map);

    if (props.location.tooltip) {
      marker
        .bindTooltip(props.location.tooltip, {
          permanent: true,
          direction: "bottom",
          sticky: true, // Keep the tooltip open
          offset: L.point(0, 10), // Adjust tooltip position
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
      const newLatLng = L.latLng(lat, lng);

      // Update map center
      mapInstanceRef.current.setView(newLatLng, props.location.zoom ?? DEFAULTS.zoom);

      // Update marker position
      markerRef.current.setLatLng(newLatLng);

      // Update tooltip
      if (props.location.tooltip) {
        markerRef.current
          .bindTooltip(props.location.tooltip, {
            permanent: true,
            direction: "bottom",
            sticky: true, // Keep the tooltip open
            offset: L.point(0, 10), // Adjust tooltip position
          })
          .openTooltip();
      } else {
        markerRef.current.unbindTooltip();
      }
    }
  }, [lat, lng, props.location.tooltip, props.location.zoom]);

  useEffect(() => {
    if (containerRef.current && editable) {
      const resizeObserver = new ResizeObserver(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [editable]);

  return (
    <div
      className={tx(
        "flex-grow rounded-[inherit] relative overflow-hidden !min-w-[280px] min-h-[180px] max-sm:w-full",
        props.preset,
        Object.values(styles),
      )}
      ref={containerRef}
    >
      <div ref={mapRef} className={tx("h-full w-full rounded-[inherit] absolute inset-0 z-40")} />
    </div>
  );
}

export default WidgetMap;
