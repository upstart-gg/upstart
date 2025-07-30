import type { FieldProps } from "./types";
import {
  TextField,
  TextArea,
  SegmentedControl,
  Select,
  IconButton,
  Tooltip,
} from "@upstart.gg/style-system/system";
import { TbSlash } from "react-icons/tb";
import { useDebounceCallback } from "usehooks-ts";
import { FieldTitle } from "../field-factory";
import { tx } from "@upstart.gg/style-system/twind";
import type { UrlOrPageIdSettings } from "@upstart.gg/sdk/shared/bricks/props/string";
import { type ChangeEvent, type FC, useRef, useState } from "react";
import { useDraftHelpers, useDynamicParent, useSitemap } from "~/editor/hooks/use-page-data";
import TextEditor from "~/shared/components/TextEditor";
import { RiBracesLine } from "react-icons/ri";

export const StringField: FC<FieldProps<string>> = (props) => {
  const { currentValue, onChange, title, description, placeholder, schema, brickId } = props;
  const dynamicParent = useDynamicParent(brickId);
  const onChangeDebounced = useDebounceCallback(onChange, 300);

  if (dynamicParent) {
    return (
      <div className="field field-string basis-full flex flex-col gap-1">
        <FieldTitle title={title} description={description} />
        <div className="field field-string flex items-center gap-2">
          <div className="rounded-md border border-gray-300 focus:border-upstart-600 focus:ring-1 focus:ring-upstart-600 px-2 py-1.5 text-sm w-full bg-white">
            <TextEditor
              content={currentValue}
              brickId={brickId}
              propPath="content"
              inline={!schema["ui:multiline"]}
              placeholder=""
              // TODO: implement onChange
              // onChange={(e) => onChangeDebounced(e.target.value)}
              spellCheck={!!schema["ui:spellcheck"]}
              disableMenuBar
            />
          </div>
          <Tooltip
            content={<span className="block text-xs p-0.5">Available variables from your database</span>}
            className="!z-[10000]"
            delayDuration={300}
          >
            <IconButton variant="outline">
              <RiBracesLine />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    );
  }
  return (
    <div className="field field-string basis-full">
      <FieldTitle title={title} description={description} />
      {schema["ui:multiline"] ? (
        <TextArea
          defaultValue={currentValue}
          onChange={(e) => onChangeDebounced(e.target.value)}
          className={tx("!mt-1.5 scrollbar-thin", schema["ui:textarea-class"] ?? "h-24")}
          placeholder={placeholder}
          resize="vertical"
          size={"2"}
          spellCheck={!!schema["ui:spellcheck"]}
        />
      ) : (
        <TextField.Root
          defaultValue={currentValue}
          onChange={(e) => onChangeDebounced(e.target.value)}
          className="!mt-1"
          size={"2"}
          placeholder={placeholder}
          spellCheck={!!schema["ui:spellcheck"]}
        />
      )}
    </div>
  );
};

export const PathField: FC<FieldProps<string>> = (props) => {
  const { currentValue, onChange, title, description, placeholder } = props;
  const onChangeDebounced = useDebounceCallback(onChange, 300);
  // remove leading slash
  const path = (currentValue || "").toString().replace(/^\//, "");

  return (
    <div className="field field-path basis-full">
      <FieldTitle title={title} description={description} />
      <TextField.Root
        defaultValue={path}
        onChange={(e) => onChangeDebounced(e.target.value)}
        className="!mt-1.5"
        placeholder={placeholder}
      >
        <TextField.Slot>
          <TbSlash className="bg-transparent h-5 w-5 rounded-md stroke-1 !-ml-1 !-mr-2 -rotate-[20deg]" />
        </TextField.Slot>
      </TextField.Root>
    </div>
  );
};

export const UrlOrPageIdField: FC<FieldProps<UrlOrPageIdSettings | null>> = (props) => {
  const { currentValue, onChange, title, description, placeholder, schema, brickId } = props;
  const sitemap = useSitemap();
  const [type, setType] = useState<"url" | "pageId">(
    currentValue?.startsWith("http") || sitemap.length === 1 ? "url" : "pageId",
  );
  const dynamicParent = useDynamicParent(brickId);
  const externalLabel = dynamicParent ? "External / Dynamic" : "External link";

  return (
    <div className="flex-1 max-w-full">
      <div className="flex justify-between flex-1 gap-1">
        <FieldTitle title={title} description={description} />
        <SegmentedControl.Root
          onValueChange={(value) => setType(value as "url" | "pageId")}
          defaultValue={type}
          size="1"
          className="mt-0.5"
          radius="medium"
        >
          <SegmentedControl.Item value="url" className="[&_.rt-SegmentedControlItemLabel]:!px-1.5">
            {externalLabel}
          </SegmentedControl.Item>
          <SegmentedControl.Item value="pageId" className="[&_.rt-SegmentedControlItemLabel]:!px-1.5">
            Internal page
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      </div>
      {type === "url" ? (
        dynamicParent ? (
          <div className="field field-string basis-full flex items-start gap-2 mt-2">
            <div className="rounded-md border border-gray-300 focus:border-upstart-600 focus:ring-1 focus:ring-upstart-600 px-2 py-1.5 text-sm w-full bg-white">
              <TextEditor
                content={currentValue?.startsWith("http") ? currentValue : ""}
                brickId={brickId}
                propPath="content"
                inline={!schema["ui:multiline"]}
                placeholder="https://example.com"
                disableMenuBar
                // TODO: implement onChange
                // onChange={(e) => onChangeDebounced(e.target.value)}
                spellCheck={!!schema["ui:spellcheck"]}
              />
            </div>
            <Tooltip
              content={<span className="block text-xs p-0.5">Available variables from your database</span>}
              className="!z-[10000]"
              delayDuration={300}
            >
              <IconButton variant="outline">
                <RiBracesLine />
              </IconButton>
            </Tooltip>
          </div>
        ) : (
          <TextField.Root
            defaultValue={currentValue?.startsWith("http") ? currentValue : ""}
            onChange={(e) => onChange(e.target.value)}
            className="!mt-2 max-w-full"
            placeholder="https://example.com"
            spellCheck={!!schema["ui:spellcheck"]}
          />
        )
      ) : (
        <Select.Root
          defaultValue={currentValue ?? undefined}
          size="2"
          onValueChange={(value) => onChange(value)}
        >
          <Select.Trigger
            radius="large"
            variant="surface"
            className="!mt-2 !w-full !flex-1 !max-w-full truncate"
            placeholder="Select a page"
          />
          <Select.Content position="popper">
            <Select.Group>
              {Object.entries(sitemap).map(([, page]) => (
                <Select.Item key={page.id} value={page.label}>
                  {page.label}
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      )}
    </div>
  );
};

export const GeoAddressField: FC<FieldProps<string>> = (props) => {
  const { currentValue, onChange, title, description, placeholder, formData, brickId } = props;
  const { updateBrickProps } = useDraftHelpers();
  const [searchResults, setSearchResults] = useState<SearchResults[]>([]);

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Check if the value matches one of our search results
    const matchedResult = searchResults.find((result) => result.label === value);
    if (matchedResult) {
      console.log("Matched result:", matchedResult);
      // Update your state with the coordinates
      onChange(matchedResult.label);

      console.log("address changed for brick %s", brickId);

      if (brickId) {
        // Todo: fix hardcoded location props
        updateBrickProps(brickId, {
          address: matchedResult.label,
          lat: matchedResult.lat,
          lng: matchedResult.lng,
          tooltip: "",
        });
      }

      // Create a custom event containing the result with address and coordinates
      const customEvent = new CustomEvent("geoAddressSelected", {
        detail: {
          address: matchedResult.label,
          placeId: matchedResult.placeId,
          lat: matchedResult.lat,
          lng: matchedResult.lng,
        },
      });
      // Dispatch the custom event
      window.dispatchEvent(customEvent);

      // Clear search results since user made a selection
      setSearchResults([]);
      return;
    }

    console.log("No match found for %s, continuing search...", value);

    // Otherwise, trigger search
    onAddressChangeDebounced(event);
  };

  const onAddressChangeDebounced = useDebounceCallback((event: ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="field field-address basis-full">
      <FieldTitle title={title} description={description} />
      <datalist id="search-results">
        {searchResults.map((result) => (
          <option key={result.placeId} value={result.label} />
        ))}
      </datalist>
      <TextField.Root
        defaultValue={currentValue}
        onChange={handleAddressChange}
        className="!mt-1"
        placeholder={placeholder}
        list="search-results"
      />
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
