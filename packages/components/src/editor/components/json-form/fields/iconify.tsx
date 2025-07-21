import { Button, IconButton, Popover, Select, Text, TextField } from "@upstart.gg/style-system/system";
import { Icon } from "@iconify/react";
import type { FC } from "react";
import { useEffect, useState, useMemo, startTransition, useRef, useLayoutEffect } from "react";
import { MdGridView } from "react-icons/md";
import { FieldTitle } from "../field-factory";
import type { FieldProps } from "./types";
// @ts-ignore There is no type definition for this package
import { collections } from "@iconify/collections";
import type { IconifyCategories, IconifyJSON } from "@iconify/types";
import { css, tx } from "@upstart.gg/style-system/twind";
// To show a big list of icons with virtualization
import { useVirtualizer } from "@tanstack/react-virtual";
import { RxMagnifyingGlass } from "react-icons/rx";

const blaclistedCollections = [
  "logos", // Color logos, not suitable for icon selection
  "bitcoin-icons", // Contains only Bitcoin-related icons, not suitable for general use
  "brandico", // Contains too few icons, not suitable for general use
  "bpmn", // Contains only BPMN icons, not suitable for general use
  "bytesize", // Contains only a few icons, not suitable for general use
  "catppuccin", // Contains colored icons
  "charm", // Contains only a few icons, not suitable for general use
  "codex", // Contains only a few icons, not suitable for general use
  "emojione", // Colored emojis, not suitable for general use
  "covid", // Colored emojis, not suitable for general use
];

const staticCollections = {};

// Get collections with their metadata for selection
const availableCollections = Object.entries(
  collections as Record<string, import("@iconify/types").IconifyInfo>,
)
  .map(([code, col]) => ({
    code,
    ...col,
  }))
  .filter(
    (collection) =>
      blaclistedCollections.includes(collection.code) === false &&
      typeof collection.total === "number" &&
      collection.total > 0,
  ) // Only include collections with icons
  // sort by name
  .sort((a, b) => a.name.localeCompare(b.name));

// Generator function to process icons lazily for better performance
function* generateIconsFromCategories(
  categories: IconifyCategories,
  collectionPrefix: string,
): Generator<string, void, unknown> {
  for (const categoryIcons of Object.values(categories)) {
    if (Array.isArray(categoryIcons)) {
      for (const iconName of categoryIcons) {
        yield `${collectionPrefix}:${iconName}`;
      }
    }
  }
}

const IconifyField: FC<
  FieldProps<string> & {
    defaultCollection?: string;
  }
> = ({ currentValue, onChange, title, description, schema, defaultCollection }) => {
  console.log("IconifyField props:", {
    defaultCollection,
    schema,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>(
    defaultCollection ?? availableCollections[0].code,
  );
  const [categories, setCategories] = useState<IconifyCategories>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  // Ref for the virtual scroller parent
  const parentRef = useRef<HTMLDivElement>(null);

  // Get icons for the selected collection using generator for better performance
  useEffect(() => {
    async function proceed() {
      if (!selectedCollection) {
        return {} as IconifyCategories;
      }
      setLoading(true);

      try {
        const response = await fetch(`https://api.iconify.design/collection?prefix=${selectedCollection}`);
        if (!response.ok) {
          console.error("Failed to fetch icons for collection:", selectedCollection);
          return {} as IconifyCategories;
        }
        const data = (await response.json()) as IconifyJSON & { uncategorized?: string[]; icons?: string[] };
        console.log("data from API:", data);
        console.log("Available icons for collection:", selectedCollection, data);

        // Process the API response properly
        const processedCategories: IconifyCategories = {};

        // Add categorized icons
        if (data.categories) {
          Object.entries(data.categories).forEach(([categoryName, icons]) => {
            if (Array.isArray(icons)) {
              processedCategories[categoryName] = icons;
            }
          });
        }

        // Add uncategorized icons if they exist
        if (data.uncategorized && Array.isArray(data.uncategorized)) {
          processedCategories.uncategorized = data.uncategorized;
        }

        // If no categories exist but we have icons in the root, add them as uncategorized
        if (Object.keys(processedCategories).length === 0 && data.icons && Array.isArray(data.icons)) {
          processedCategories.uncategorized = data.icons;
        }

        console.log("Processed categories:", processedCategories);
        // Set categories which will trigger icon list generation
        setCategories(processedCategories);
      } catch (error) {
        console.error("Error fetching icons:", error);
        setCategories({});
      } finally {
        setLoading(false);
      }
    }

    proceed();
  }, [selectedCollection]);

  // Search icons across all collections using Iconify search API
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const searchIcons = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://api.iconify.design/search?query=${encodeURIComponent(searchQuery)}&limit=150`,
        );
        if (!response.ok) {
          console.error("Failed to search icons:", response.statusText);
          setSearchResults([]);
          return;
        }
        const data = await response.json();
        const results: string[] = data.icons ?? [];

        setSearchResults(results);
      } catch (error) {
        console.error("Error searching icons:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(searchIcons, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Use generator to create icon list efficiently
  const collectionIcons = useMemo(() => {
    // If searching, use search results instead of collection icons
    if (searchQuery.trim()) {
      console.log("Using icons earch results:", searchResults.length);
      return searchResults;
    }

    // Otherwise, use the selected collection's icons
    if (!categories || Object.keys(categories).length === 0 || !selectedCollection) {
      return [];
    }

    // Convert generator to array for virtual scroller
    // We still need the full array for virtualization, but generator helps with memory during processing
    const iconGenerator = generateIconsFromCategories(categories, selectedCollection);
    const icons = Array.from(iconGenerator);
    console.log("Icons from categories:", icons);
    return icons;
  }, [categories, selectedCollection, searchQuery, searchResults]);

  // Virtual scroller configuration
  const ITEMS_PER_ROW = 6;
  const ITEM_HEIGHT = 48; // Height of each row in pixels

  // Calculate number of rows needed
  const rowCount = Math.ceil(collectionIcons.length / ITEMS_PER_ROW);

  // Create row data for virtual scroller
  const rowData = useMemo(() => {
    const rows: string[][] = [];
    for (let i = 0; i < rowCount; i++) {
      const startIndex = i * ITEMS_PER_ROW;
      const endIndex = Math.min(startIndex + ITEMS_PER_ROW, collectionIcons.length);
      rows.push(collectionIcons.slice(startIndex, endIndex));
    }
    return rows;
  }, [collectionIcons, rowCount]);

  const virtualizer = useVirtualizer({
    count: rowCount,
    enabled: isOpen && selectedCollection !== null,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5, // Render 5 extra rows for smooth scrolling
    useAnimationFrameWithResizeObserver: true, // Use animation frame for smoother scrolling
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    startTransition(() => {
      // Force measurement when the popover opens otherwise it might not render correctly
      virtualizer.measure();
    });
  }, [isOpen, virtualizer]);

  const handleIconSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
  };

  // Get collection info for display
  const getSelectedCollectionInfo = () => {
    return availableCollections.find((col) => col.code === selectedCollection);
  };

  return (
    <div className="flex justify-between flex-1 gap-1">
      <FieldTitle title={title} description={description} />

      <div className="flex items-center gap-2 justify-between">
        {/* Current icon preview */}
        {currentValue && (
          <div className="flex items-center">
            <Icon icon={currentValue} className="w-6 h-6" />
          </div>
        )}

        {/* Button to open selector */}
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
          <Popover.Trigger>
            <Button type="button" variant="soft" size="1" radius="full">
              Choose icon
            </Button>
          </Popover.Trigger>

          <Popover.Content className="w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="space-y-2">
              {/* Collection selector */}
              <div>
                <Select.Root
                  name="collection"
                  defaultValue={selectedCollection ?? undefined}
                  onValueChange={(value) => {
                    setLoading(true);
                    startTransition(() => {
                      setSelectedCollection(value);
                    });
                  }}
                >
                  <Select.Trigger radius="medium" variant="surface" className="!w-full capitalize" />
                  <Select.Content position="popper">
                    {availableCollections.map((collection) => (
                      <Select.Item key={collection.code} value={collection.code} className="capitalize">
                        {collection.name} ({collection.total} icons)
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                {getSelectedCollectionInfo() && (
                  <div className="text-xs text-gray-500 mt-1">
                    {getSelectedCollectionInfo()?.author && (
                      <span>Icons by {getSelectedCollectionInfo()!.author!.name}</span>
                    )}
                  </div>
                )}
              </div>
              {/* Search input */}
              <div className={tx("mt-6")}>
                <TextField.Root
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search icons across all collections..."
                  size="2"
                  variant="surface"
                >
                  <TextField.Slot>
                    <RxMagnifyingGlass height="16" width="16" />
                  </TextField.Slot>
                </TextField.Root>
              </div>

              {/* Collection info or search results info */}
              {searchQuery.trim() && (
                <div className="text-xs text-gray-500">
                  {isSearching ? (
                    <span>Searching...</span>
                  ) : (
                    <span>
                      {collectionIcons.length} icons found{searchQuery && ` for "${searchQuery}"`}
                    </span>
                  )}
                </div>
              )}

              {(loading || isSearching) && (
                <div className="flex items-center justify-center py-4">
                  <span className="text-sm text-gray-500">
                    {isSearching ? "Searching icons..." : "Loading icons..."}
                  </span>
                </div>
              )}

              {/* Virtualized Icon grid */}
              {!loading && !isSearching && collectionIcons.length > 0 && (
                <div
                  ref={parentRef}
                  className={tx(
                    "h-[320px] overflow-auto scrollbar-thin",
                    css({
                      scrollbarColor: "var(--violet-4) var(--violet-1)",
                    }),
                  )}
                >
                  <div
                    style={{
                      height: `${virtualizer.getTotalSize()}px`,
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    {virtualizer.getVirtualItems().map((virtualRow) => {
                      const rowIcons = rowData[virtualRow.index];
                      if (!rowIcons) {
                        return null;
                      }

                      return (
                        <div
                          key={virtualRow.index}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)`,
                          }}
                        >
                          <div className="grid grid-cols-6 gap-2 px-1 py-2">
                            {rowIcons.map((iconName) => (
                              <button
                                key={iconName}
                                type="button"
                                onClick={() => handleIconSelect(iconName)}
                                className={`p-2 rounded hover:bg-upstart-100 flex items-center justify-center transition-colors ${
                                  currentValue === iconName
                                    ? "bg-upstart-100 border border-upstart-500"
                                    : "border border-transparent"
                                }`}
                              >
                                <Icon icon={iconName} className="w-5 h-5" />
                              </button>
                            ))}
                            {/* Fill empty slots in the last row */}
                            {rowIcons.length < ITEMS_PER_ROW &&
                              Array.from({ length: ITEMS_PER_ROW - rowIcons.length }).map((_, index) => (
                                <div key={`empty-${index}`} className="p-2" />
                              ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Show message if no icons found */}
              {!loading && !isSearching && collectionIcons.length === 0 && (
                <div className="text-center text-gray-500 text-sm py-4">
                  {searchQuery.trim()
                    ? `No icons found for "${searchQuery}"`
                    : "No icons found in this collection"}
                </div>
              )}
            </div>
          </Popover.Content>
        </Popover.Root>
      </div>
    </div>
  );
};

export default IconifyField;
