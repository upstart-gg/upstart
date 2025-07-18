import { Popover, Select } from "@upstart.gg/style-system/system";
import { Icon } from "@iconify/react";
import type { FC } from "react";
import { useEffect, useState, useMemo, startTransition } from "react";
import { MdGridView } from "react-icons/md";
import { FieldTitle } from "../field-factory";
import type { FieldProps } from "./types";
// @ts-ignore There is no type definition for this package
import { collections } from "@iconify/collections";
import type { IconifyCategories, IconifyJSON } from "@iconify/types";
import { css, tx } from "@upstart.gg/style-system/twind";
// To show a big list of icons with virtualization
import { useVirtualizer } from "@tanstack/react-virtual";

// Get collections with their metadata for selection
const getCollectionsWithInfo = () => {
  return (
    Object.entries(collections as Record<string, import("@iconify/types").IconifyInfo>)
      .map(([code, col]) => ({
        code,
        ...col,
      }))
      .filter(
        (collection) =>
          typeof collection.total === "number" && collection.total > 0 && collection.total < 540,
      ) // Only include collections with icons
      // sort by name
      .sort((a, b) => a.name.localeCompare(b.name))
  );
};

const IconifyField: FC<
  FieldProps<string> & {
    defaultCategory?: string; // Default category to show
  }
> = ({ currentValue, onChange, title, description, placeholder }) => {
  // Get available collections with their info
  const availableCollections = getCollectionsWithInfo();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(availableCollections[0]!.code);
  const [categories, setCategories] = useState<IconifyCategories>({});
  // const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get icons for the selected collection
  useEffect(() => {
    async function proceed() {
      if (!selectedCollection) return {} as IconifyCategories;
      const response = await fetch(`https://api.iconify.design/collection?prefix=${selectedCollection}`);
      if (!response.ok) {
        console.error("Failed to fetch icons for collection:", selectedCollection);
        return {} as IconifyCategories;
      }
      const data = (await response.json()) as IconifyJSON;
      console.log("data from API:", data);
      console.log("Available icons for collection:", selectedCollection, data.categories);
      if ("uncategorized" in data) {
        data.categories ||= {} as IconifyCategories;
        // If uncategorized exists, we can assume it's a valid collection
        data.categories.uncategorized = data.uncategorized as IconifyCategories["uncategorized"];
      }

      // Add collection prefix to icon names and limit results
      setCategories(data.categories as IconifyCategories);
      setLoading(false);
    }

    proceed();
  }, [selectedCollection]);

  // Concat categories icons into a single string array
  const collectionIcons = useMemo(
    () =>
      Object.values(categories)
        .flat()
        .map((icon) => `${selectedCollection}:${icon}`),
    [categories, selectedCollection],
  );

  const handleIconSelect = (iconName: string) => {
    onChange(iconName);
    setIsOpen(false);
  };

  // Helper function to format icon name for display
  const formatIconTitle = (iconName: string) => {
    const name = iconName.split(":")[1] || iconName;
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get collection info for display
  const getSelectedCollectionInfo = () => {
    return availableCollections.find((col) => col.code === selectedCollection);
  };

  return (
    <div className="flex justify-between flex-1 pr-1 gap-1">
      <FieldTitle title={title} description={description} />

      <div className="flex items-center gap-1">
        {/* Current icon preview */}
        {currentValue && (
          <div className="w-6 h-6 flex items-center justify-center">
            <Icon icon={currentValue} className="w-4 h-4" />
          </div>
        )}

        {/* Button to open selector */}
        <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
          <Popover.Trigger>
            <button type="button" className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border">
              <MdGridView className="w-4 h-4" />
            </button>
          </Popover.Trigger>

          <Popover.Content className="w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="space-y-3">
              {/* Collection selector */}
              {availableCollections.length > 1 && (
                <Select.Root
                  name="collection"
                  defaultValue={selectedCollection}
                  onValueChange={(value) => {
                    setLoading(true);
                    startTransition(() => {
                      setSelectedCollection(value);
                    });
                  }}
                >
                  <Select.Trigger radius="medium" variant="surface" className="!w-full" />
                  <Select.Content position="popper">
                    {availableCollections.map((collection) => (
                      <Select.Item key={collection.code} value={collection.code}>
                        {collection.name} ({collection.total} icons)
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              )}

              {/* Show collection title if only one collection */}
              {availableCollections.length === 1 && (
                <div className="text-sm font-medium text-gray-700 text-center">
                  {getSelectedCollectionInfo()?.name || selectedCollection}
                </div>
              )}

              {/* Collection info */}
              {getSelectedCollectionInfo() && (
                <div className="text-xs text-gray-500">
                  {getSelectedCollectionInfo()?.author && (
                    <span>by {getSelectedCollectionInfo()!.author!.name} • </span>
                  )}
                  {Object.keys(collectionIcons).length} of {getSelectedCollectionInfo()?.total} icons
                </div>
              )}

              {loading && (
                <div className="flex items-center justify-center py-4">
                  <span className="text-sm text-gray-500">Loading icons...</span>
                </div>
              )}

              {/* Icon grid */}
              {!loading && (
                <div
                  className={tx(
                    "max-h-80 overflow-y-auto scrollbar-thin",
                    css({
                      scrollbarColor: "var(--violet-4) var(--violet-1)",
                    }),
                  )}
                >
                  <div className="grid grid-cols-6 gap-2">
                    {collectionIcons.map((iconName) => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => handleIconSelect(iconName)}
                        className={`p-2 rounded hover:bg-gray-100 flex items-center justify-center ${
                          currentValue === iconName ? "border " : "border border-transparent"
                        }`}
                        title={formatIconTitle(iconName)}
                      >
                        <Icon icon={iconName} className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
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
