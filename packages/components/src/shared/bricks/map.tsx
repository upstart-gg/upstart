import { useEffect, useMemo, useRef } from "react";
import { type Manifest, DEFAULTS } from "@upstart.gg/sdk/bricks/manifests/map.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useBrickStyle } from "../hooks/use-brick-style";
import { tx } from "@upstart.gg/style-system/twind";
import L, { Map as LMap, TileLayer, Marker, LatLng } from "leaflet";
import "leaflet/dist/leaflet.css";

export function WidgetMap({ brick, editable }: BrickProps<Manifest>) {
  const styles = useBrickStyle<Manifest>(brick);
  const classes = Object.values(styles);
  const props = brick.props;

  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const initRef = useRef(false);

  const lat = useMemo(() => props.location?.lat ?? DEFAULTS.lat, [props.location?.lat]);
  const lng = useMemo(() => props.location?.lng ?? DEFAULTS.lng, [props.location?.lng]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    async function init() {
      if (!mapRef.current) return;
      try {
        // Initialize the map
        const map = new LMap(mapRef.current, {
          zoomControl: false,
          attributionControl: false,
          dragging: false, // Disable dragging for static maps
          // @ts-ignore @types/leaflet are not in sync with latest leadflet beta, pingchZoom does exist!
          pinchZoom: false, // Disable touch zoom for static maps
          scrollWheelZoom: false, // Disable scroll wheel zoom for static maps
          doubleClickZoom: false, // Disable double click zoom for static maps
          boxZoom: false, // Disable box zoom for static maps
          keyboard: false, // Disable keyboard controls for static maps
          trackResize: editable, // Enable resize tracking
        }).setView([lat, lng], props.location.zoom ?? DEFAULTS.zoom);

        // Add tile layer
        new TileLayer("https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png", {
          zIndex: 40,
        }).addTo(map);

        // Add marker with tooltip
        const marker = new Marker([lat, lng]).addTo(map);

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
        initRef.current = true;
        mapInstanceRef.current = map;
        markerRef.current = marker;
      } catch (error) {}
    }

    init();

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
      const newLatLng = new LatLng(lat, lng);
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
            offset: window.L.point(0, 10), // Adjust tooltip position
          })
          .openTooltip();
      } else {
        markerRef.current.unbindTooltip();
      }
    }
  }, [lat, lng, props.location.tooltip, props.location.zoom]);

  const resizingDelayTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // This effect handles resizing the map when the container size changes
  // It uses various timeouts to prevent some quick resize events from causing issues
  // and to ensure the map is resized only after the container has settled.
  // This is particularly useful when the map is inside a resizable container or when the page layout changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (containerRef.current && editable) {
      const resizeObserver = new ResizeObserver(() => {
        clearTimeout(resizingDelayTimer.current ?? undefined);
        resizingDelayTimer.current = setTimeout(() => {
          // check if the observed div is still mounted
          // else this will cause memory leak
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 100);
      });
      resizeObserver.observe(containerRef.current);
      return () => {
        setTimeout(() => {
          resizeObserver.disconnect();
        }, 200);
      };
    }
  }, []);

  return (
    <div
      className={tx("flex-grow rounded-[inherit] relative overflow-hidden max-sm:w-full", ...classes)}
      ref={containerRef}
    >
      <div ref={mapRef} className={tx("h-full w-full rounded-[inherit] absolute inset-0 z-40")} />
    </div>
  );
}

export default WidgetMap;
