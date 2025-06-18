import { type ObjectOptions, Type, type Static } from "@sinclair/typebox";
import { optional, prop } from "./helpers";
import { number } from "./number";
import { string } from "./string";

export function geolocation(opts: ObjectOptions & { defaultZoom?: number } = {}) {
  const { title = "Location", defaultZoom } = opts;
  return prop({
    title,
    schema: Type.Object(
      {
        lat: number("Latitude", { "ui:field": "hidden" }),
        lng: number("Longitude", { "ui:field": "hidden" }),
        address: string("Address", { "ui:field": "geoaddress" }),
        tooltip: optional(string("Tooltip")),
        zoom: optional(
          number("Zoom", {
            description: "Zoom level for the map",
            "ui:instructions": "The zoom level should be between 0 (world view) and 21 (street view).",
            "ui:field": "slider",
            minimum: 12,
            maximum: 18,
            default: defaultZoom,
          }),
        ),
      },
      {
        // "ui:field": "geolocation",
        ...opts,
      },
    ),
  });
}

export type GeolocationSettings = Static<ReturnType<typeof geolocation>>;
