import { Type, type Static } from "@sinclair/typebox";
import { prop } from "./helpers";

type GeolocationOptions = {
  title?: string;
  defaultValue?: {
    lat: number;
    lng: number;
  };
};

export function geolocation(opts: GeolocationOptions = {}) {
  const { title = "Geolocation", defaultValue = { lat: 48.864716, lng: 2.349014 } } = opts;
  return prop({
    title,
    schema: Type.Object(
      {
        lat: Type.Number({ minimum: -90, maximum: 90 }),
        lng: Type.Number({ minimum: -180, maximum: 180 }),
        label: Type.Optional(Type.String({ title: "Tooltip" })),
      },
      {
        "ui:field": "geo-point",
        default: defaultValue,
      },
    ),
  });
}

export type GeolocationSettings = Static<ReturnType<typeof geolocation>>;
