import { useEffect, useRef } from "react";
import { type Manifest, DEFAULTS } from "@upstart.gg/sdk/bricks/manifests/map.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useBrickStyle } from "../hooks/use-brick-style";
import { tx } from "@upstart.gg/style-system/twind";
import type L from "leaflet";
import { Map as LMap, TileLayer, Marker, LatLng, Point } from "leaflet";
import "leaflet/dist/leaflet.css";
import BrickRoot from "../components/BrickRoot";

export default function WidgetMap({ brick, editable }: BrickProps<Manifest>) {
  const styles = useBrickStyle<Manifest>(brick);
  const classes = Object.values(styles);
  const props = brick.props;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const initRef = useRef(false);

  const lat = props.lat ?? DEFAULTS.lat;
  const lng = props.lng ?? DEFAULTS.lng;

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
        }).setView([lat, lng], props.zoom ?? DEFAULTS.zoom);

        // Add tile layer
        new TileLayer("https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png", {
          zIndex: 40,
        }).addTo(map);

        // Add marker with tooltip
        const marker = new Marker([lat, lng]).addTo(map);

        if (props.tooltip) {
          marker
            .bindTooltip(props.tooltip, {
              permanent: true,
              direction: "bottom",
              sticky: true, // Keep the tooltip open
              offset: new Point(0, 10), // Adjust tooltip position
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
      mapInstanceRef.current.setView(newLatLng, props.zoom ?? DEFAULTS.zoom);
      // Update marker position
      markerRef.current.setLatLng(newLatLng);

      // Update tooltip
      if (props.tooltip) {
        markerRef.current
          .bindTooltip(props.tooltip, {
            permanent: true,
            direction: "bottom",
            sticky: true, // Keep the tooltip open
            offset: new Point(0, 10), // Adjust tooltip position
          })
          .openTooltip();
      } else {
        markerRef.current.unbindTooltip();
      }
    }
  }, [lat, lng, props.tooltip, props.zoom]);

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
    <BrickRoot className={tx("rounded-[inherit] relative overflow-hidden", ...classes)} ref={containerRef}>
      <div ref={mapRef} className={tx("h-full w-full rounded-[inherit] absolute inset-0 z-40")} />
    </BrickRoot>
  );
}
