import { type ObjectOptions, Type, type Static } from "@sinclair/typebox";
import { number } from "./number";

export function geolocation(opts: ObjectOptions & { defaultZoom?: number } = {}) {
  const { title = "Location", defaultZoom } = opts;
  return Type.Object(
    {
      lat: number("Latitude", { "ui:field": "hidden" }),
      lng: number("Longitude", { "ui:field": "hidden" }),
      address: Type.String({
        title: "Address",
        "ui:field": "geoaddress",
      }),
      tooltip: Type.Optional(Type.String({ title: "Tooltip" })),
      zoom: Type.Optional(
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
      title,
      metadata: {
        category: "content",
      },
      ...opts,
    },
  );
}

export type GeolocationSettings = Static<ReturnType<typeof geolocation>>;
