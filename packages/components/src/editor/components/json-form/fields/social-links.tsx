import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import type { TObject, TProperties } from "@sinclair/typebox";
import { Popover } from "@upstart.gg/style-system/system";
import type { FC } from "react";
import { useEffect, useState } from "react";
import {
  FaBehance,
  FaDiscord,
  FaDribbble,
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaPinterest,
  FaReddit,
  FaSnapchat,
  FaSpotify,
  FaTelegram,
  FaTiktok,
  FaTwitch,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
} from "react-icons/fa";
import {
  MdAdd,
  MdDelete,
  MdDragIndicator,
  MdExpandLess,
  MdExpandMore,
  MdOutlineCancel,
} from "react-icons/md";
import { processObjectSchemaToFields } from "../field-factory";

// Social media platforms with default URLs and icon mappings
const SOCIAL_PLATFORMS = [
  { name: "Facebook", icon: "mdi:facebook", defaultUrl: "https://facebook.com/", component: FaFacebook },
  { name: "Instagram", icon: "mdi:instagram", defaultUrl: "https://instagram.com/", component: FaInstagram },
  { name: "Twitter", icon: "mdi:twitter", defaultUrl: "https://twitter.com/", component: FaTwitter },
  { name: "LinkedIn", icon: "mdi:linkedin", defaultUrl: "https://linkedin.com/", component: FaLinkedin },
  { name: "YouTube", icon: "mdi:youtube", defaultUrl: "https://youtube.com/", component: FaYoutube },
  { name: "GitHub", icon: "mdi:github", defaultUrl: "https://github.com/", component: FaGithub },
  { name: "TikTok", icon: "mdi:tiktok", defaultUrl: "https://tiktok.com/", component: FaTiktok },
  { name: "Pinterest", icon: "mdi:pinterest", defaultUrl: "https://pinterest.com/", component: FaPinterest },
  { name: "Discord", icon: "mdi:discord", defaultUrl: "https://discord.gg/", component: FaDiscord },
  { name: "WhatsApp", icon: "mdi:whatsapp", defaultUrl: "https://wa.me/", component: FaWhatsapp },
  { name: "Telegram", icon: "mdi:telegram", defaultUrl: "https://t.me/", component: FaTelegram },
  { name: "Snapchat", icon: "mdi:snapchat", defaultUrl: "https://snapchat.com/", component: FaSnapchat },
  { name: "Reddit", icon: "mdi:reddit", defaultUrl: "https://reddit.com/", component: FaReddit },
  { name: "Twitch", icon: "mdi:twitch", defaultUrl: "https://twitch.tv/", component: FaTwitch },
  { name: "Spotify", icon: "mdi:spotify", defaultUrl: "https://spotify.com/", component: FaSpotify },
  { name: "Dribbble", icon: "mdi:dribbble", defaultUrl: "https://dribbble.com/", component: FaDribbble },
  { name: "Behance", icon: "mdi:behance", defaultUrl: "https://behance.net/", component: FaBehance },
];

interface SocialLinksFieldProps {
  currentValue: unknown[];
  onChange: (newArray: unknown[]) => void;
  itemSchema: TObject<TProperties>;
  formSchema: TObject<TProperties>;
  title?: string;
  brickId?: string;
  parents?: string[];
  fieldName: string;
  id: string;
}

export const SocialLinksField: FC<SocialLinksFieldProps> = ({
  currentValue,
  onChange,
  itemSchema,
  formSchema,
  title,
  brickId,
  parents,
  fieldName,
  id,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Debug: Log when currentValue changes unexpectedly
  useEffect(() => {
    console.log("[SocialLinksField] currentValue changed:", currentValue);
  }, [currentValue]);

  // Clean up expanded items when currentValue changes significantly
  useEffect(() => {
    setExpandedItems((prev) => {
      const validIndices = new Set<number>();
      prev.forEach((index) => {
        if (index < currentValue.length) {
          validIndices.add(index);
        }
      });
      return validIndices;
    });
  }, [currentValue.length]);

  // Get existing social platforms to filter out from the add popover
  const existingPlatforms = currentValue
    .map((item) => {
      const typedItem = item as Record<string, unknown>;
      return typedItem?.icon as string;
    })
    .filter(Boolean);

  const availablePlatforms = SOCIAL_PLATFORMS.filter(
    (platform) => !existingPlatforms.includes(platform.icon),
  );

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleAddSocialLink = (platform: (typeof SOCIAL_PLATFORMS)[0]) => {
    const newLink = {
      href: platform.defaultUrl,
      label: platform.name,
      icon: platform.icon,
    };

    const newArray = [...currentValue, newLink];
    onChange(newArray);
    setIsPopoverOpen(false);
  };

  const handleRemoveItem = (index: number) => {
    const newArray = currentValue.filter((_, i) => i !== index);
    onChange(newArray);

    // Clean up expansion state - remove the deleted index and adjust indices
    setExpandedItems((prev) => {
      const newSet = new Set<number>();
      prev.forEach((expandedIndex) => {
        if (expandedIndex < index) {
          // Keep indices before the deleted item
          newSet.add(expandedIndex);
        } else if (expandedIndex > index) {
          // Shift indices after the deleted item down by 1
          newSet.add(expandedIndex - 1);
        }
        // Skip the deleted index
      });
      return newSet;
    });
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // If dropped outside the list
    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (destination.index === source.index) {
      return;
    }

    // Reorder the items
    const newArray = Array.from(currentValue);
    const [reorderedItem] = newArray.splice(source.index, 1);
    newArray.splice(destination.index, 0, reorderedItem);

    onChange(newArray);

    // Update expansion state to match the new order
    setExpandedItems((prev) => {
      const newSet = new Set<number>();
      prev.forEach((expandedIndex) => {
        let newIndex = expandedIndex;

        if (expandedIndex === source.index) {
          // The dragged item moves to destination index
          newIndex = destination.index;
        } else if (source.index < destination.index) {
          // Moving item down - indices between source and destination shift up
          if (expandedIndex > source.index && expandedIndex <= destination.index) {
            newIndex = expandedIndex - 1;
          }
        } else {
          // Moving item up - indices between destination and source shift down
          if (expandedIndex >= destination.index && expandedIndex < source.index) {
            newIndex = expandedIndex + 1;
          }
        }

        newSet.add(newIndex);
      });
      return newSet;
    });
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-1 items-center justify-between">
        {title && <label className="block text-sm font-medium text-gray-700">{title}</label>}
        <Popover.Root open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <Popover.Trigger>
            <button
              type="button"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
              disabled={availablePlatforms.length === 0}
            >
              <MdAdd className="w-4 h-4" />
            </button>
          </Popover.Trigger>

          <Popover.Content className="w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="space-y-3">
              <div className="flex justify-between">
                <h4 className="text-sm font-medium text-gray-900">Add Social Platform</h4>
                <button type="button" onClick={() => setIsPopoverOpen(false)} className="">
                  <MdOutlineCancel className="w-4 h-4" />
                </button>
              </div>

              {availablePlatforms.length === 0 ? (
                <p className="text-xs text-gray-500">All available platforms have been added.</p>
              ) : (
                <div className="max-h-48 overflow-y-auto">
                  <div className="grid grid-cols-3 gap-2">
                    {availablePlatforms.map((platform) => (
                      <button
                        key={platform.icon}
                        type="button"
                        onClick={() => handleAddSocialLink(platform)}
                        className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-100 transition-colors"
                        title={platform.name}
                      >
                        <platform.component className="w-5 h-5" />
                        <span className="text-xs text-gray-600">{platform.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Popover.Content>
        </Popover.Root>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="social-links-list">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`space-y-1 ${snapshot.isDraggingOver ? "bg-blue-50" : ""}`}
            >
              {currentValue.map((item, index) => {
                const typedItem = item as Record<string, unknown>;
                const platform = SOCIAL_PLATFORMS.find((p) => p.icon === typedItem?.icon);
                const isExpanded = expandedItems.has(index);

                // Create a stable key based on the item's content, not internal IDs
                // Use a combination of icon and href to create a unique identifier
                const contentHash = `${typedItem?.icon || "unknown"}-${((typedItem?.href as string) || "").replace(/https?:\/\//, "")}`;
                const stableKey = `item-${contentHash}-${index}`;
                const itemId = `${id}[${index}]`;

                return (
                  <Draggable key={stableKey} draggableId={stableKey} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${snapshot.isDragging ? "shadow-lg" : ""}`}
                      >
                        {/* Header row - always visible */}
                        <div className="flex items-center justify-between p-2 hover:bg-gray-50 border border-gray-200 rounded bg-white">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            {/* Drag handle */}
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                            >
                              <MdDragIndicator className="w-4 h-4" />
                            </div>

                            {platform && <platform.component className="w-4 h-4 flex-shrink-0" />}
                            <span className="text-sm font-medium text-gray-700 truncate">
                              {(typedItem?.label as string) || platform?.name || "Social Link"}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => toggleExpanded(index)}
                              className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded transition-colors"
                              title={isExpanded ? "Collapse" : "Expand"}
                            >
                              {isExpanded ? (
                                <MdExpandLess className="w-4 h-4" />
                              ) : (
                                <MdExpandMore className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Expanded content - only visible when expanded */}
                        {isExpanded && (
                          <div className="border-t border-l border-r border-b border-gray-200 p-3 bg-upstart-50 rounded-b">
                            <div className="space-y-3">
                              {/* Edit fields - exclude the icon field */}
                              {(() => {
                                // Create a schema without the icon field
                                const filteredSchema = {
                                  ...itemSchema,
                                  properties: Object.fromEntries(
                                    Object.entries(itemSchema.properties || {}).filter(
                                      ([key]) => key !== "icon",
                                    ),
                                  ),
                                };

                                return processObjectSchemaToFields({
                                  schema: filteredSchema as TObject<TProperties>,
                                  formData: typedItem || {},
                                  formSchema: formSchema,
                                  onChange: (itemData, itemFieldId) => {
                                    const newArray = [...currentValue];
                                    const currentItem = (newArray[index] as Record<string, unknown>) || {};
                                    newArray[index] = { ...currentItem, ...itemData };
                                    onChange(newArray);
                                  },
                                  options: {
                                    brickId: brickId,
                                    parents: [...(parents || []), `${fieldName}[${index}]`],
                                  },
                                });
                              })()}

                              {/* Action buttons */}
                              <div className="flex justify-end border-gray-200">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(index)}
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                  title="Remove social link"
                                >
                                  <MdDelete className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {currentValue.length === 0 && (
        <div className="text-center py-6 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded text-pretty">
          No social links added yet. Click on the "+" to get started.
        </div>
      )}
    </div>
  );
};
