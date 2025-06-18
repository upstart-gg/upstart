import type { FieldProps } from "./types";
import { TextField } from "@upstart.gg/style-system/system";
import { type ChangeEvent, type FC, useRef, useState } from "react";
import { FieldTitle } from "../field-factory";
import type { GeolocationSettings } from "@upstart.gg/sdk/shared/bricks/props/geolocation";
import { useDebounceCallback } from "usehooks-ts";

const GeoLocationField: FC<FieldProps<GeolocationSettings>> = (props) => {
  const { currentValue, onChange, title, description, placeholder = "Type an address", schema } = props;
  const onSettingsChange = (newVal: Partial<GeolocationSettings>) => onChange({ ...currentValue, ...newVal });
  const [searchResults, setSearchResults] = useState<SearchResults[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Check if the value matches one of our search results
    const matchedResult = searchResults.find((result) => result.label === value);
    if (matchedResult) {
      // Update your state with the coordinates
      onSettingsChange({
        address: matchedResult.label,
        lat: parseFloat(matchedResult.lat),
        lng: parseFloat(matchedResult.lng),
      });

      // Clear search results since user made a selection
      setSearchResults([]);
      return;
    }

    // Otherwise, trigger search
    onAddressChangeDebounced(event);
  };

  const onAddressChangeDebounced = useDebounceCallback((event: ChangeEvent<HTMLInputElement>) => {
    console.log("onChangeDebounced", event);

    if (event.nativeEvent.type !== "input") {
      console.log("Selected!", event);
      // If the event is not an input event, we don't want to trigger a search
      return;
    }

    const query = event.target.value.trim();
    if (!query) {
      setSearchResults([]);
      return;
    }

    // Abort the previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort("New search initiated");
    }

    // Create a new AbortController for this request
    const newAbortController = new AbortController();
    abortControllerRef.current = newAbortController;

    searchGeolocation(event.target.value, abortControllerRef.current.signal)
      .then((results) => {
        setSearchResults(results);
      })
      .catch((error) => {
        console.error("Error fetching geolocation data:", error);
        setSearchResults([]);
      });
  }, 300);

  const onTooltipChange = useDebounceCallback((event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    onSettingsChange({ tooltip: value });
  });

  return (
    <div className="field field-geolocation basis-full flex flex-col gap-2">
      <div>
        <FieldTitle title="Address" />
        <div className="flex flex-col gap-1 flex-1">
          <datalist id="search-results">
            {searchResults.map((result) => (
              <option key={result.placeId} value={result.label} />
            ))}
          </datalist>
          <TextField.Root
            defaultValue={currentValue.address}
            onChange={handleAddressChange}
            className="!mt-1"
            placeholder={placeholder}
            spellCheck={!!schema["ui:spellcheck"]}
            list="search-results"
          />
        </div>
      </div>
      <div>
        <FieldTitle title="Tooltip" />
        <div className="flex flex-col gap-1 flex-1">
          <TextField.Root
            defaultValue={currentValue.tooltip}
            className="!mt-1"
            spellCheck={!!schema["ui:spellcheck"]}
            onInput={onTooltipChange}
          />
        </div>
      </div>
    </div>
  );
};

type SearchResults = {
  label: string;
  placeId: string;
  lat: string;
  lng: string;
};

function searchGeolocation(query: string, abortSignal: AbortSignal | null = null): Promise<SearchResults[]> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&layer=address&limit=8`;
  return fetch(url, {
    signal: abortSignal,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      return data.map((item: any) => ({
        label: item.display_name,
        placeId: item.place_id,
        lat: item.lat,
        lng: item.lon,
      }));
    });
}

export default GeoLocationField;
