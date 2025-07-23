import {
  DragDropContext,
  Draggable,
  Droppable,
  type DraggableProvided,
  type DraggableStateSnapshot,
  type DropResult,
} from "@hello-pangea/dnd";
import type { TObject, TProperties, TSchema } from "@sinclair/typebox";
import { resolveSchema } from "@upstart.gg/sdk/shared/utils/schema-resolver";
import { Button, IconButton, TextField } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import { useState, useRef, useEffect } from "react";
import { MdDragIndicator } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { TbPlus } from "react-icons/tb";
import { FieldTitle, processObjectSchemaToFields } from "../field-factory";
import type { FieldProps } from "./types";

// If the HTML contains any tags, this function will strip them out and return plain text.
// This is useful for displaying text content without HTML formatting (ie for items title).
function stripHtml(html: string) {
  if (!html) return "";
  if (typeof window !== "undefined") {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }
  // SSR fallback
  return html.replace(/<[^>]+>/g, "");
}

export interface ArrayFieldProps extends FieldProps<unknown[]> {
  itemSchema: TSchema;
  fieldName: string;
  id: string;
  parents?: string[];
}

export function ArrayField({
  currentValue = [],
  onChange,
  itemSchema,
  formSchema,
  title,
  description,
  brickId,
  fieldName,
  id,
  parents = [],
  schema,
}: ArrayFieldProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Get UI options from the array schema (not item schema)
  const uiOptions = schema["ui:options"] as Record<string, boolean> | undefined;
  const maxItems = schema.maxItems as number | undefined;
  const addable = uiOptions?.addable ?? true;
  const removable = uiOptions?.removable ?? true;
  const orderable = uiOptions?.orderable ?? true;

  // Get the display field for collapsed items
  const displayField = schema["ui:displayField"] as string | undefined;

  const resolvedItemSchema = resolveSchema(itemSchema);

  // Scroll expanded item into view
  useEffect(() => {
    if (expandedItem !== null && itemRefs.current[expandedItem]) {
      // Use setTimeout to ensure the DOM has updated after expansion
      setTimeout(() => {
        itemRefs.current[expandedItem]?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [expandedItem]);

  // Handle expanding/collapsing items
  const toggleExpanded = (index: number) => {
    setExpandedItem((prev) => {
      // If clicking on the already expanded item, close it
      if (prev === index) {
        return null;
      }
      // Otherwise, expand this item (closing any previously expanded item)
      return index;
    });
  };

  // Handle adding new item
  const handleAddItem = () => {
    if (!addable) return;

    // Check if we've reached the maximum number of items
    if (maxItems !== undefined && currentValue.length >= maxItems) {
      return;
    }

    let defaultItem: unknown;

    if (resolvedItemSchema.type === "object") {
      // Create default object based on schema
      defaultItem = {};
      if (resolvedItemSchema.properties) {
        // Get required fields from the schema
        const requiredFields = new Set(resolvedItemSchema.required || []);

        Object.entries(resolvedItemSchema.properties).forEach(([key, prop]) => {
          const propSchema = resolveSchema(prop as TSchema);

          // Only include required fields with their default values
          // Optional fields will be undefined/null initially
          if (requiredFields.has(key)) {
            (defaultItem as Record<string, unknown>)[key] = propSchema.default;
          }
        });
      }
    } else {
      // For primitive types, use schema default or appropriate default
      defaultItem = resolvedItemSchema.default ?? getDefaultForType(resolvedItemSchema.type);
    }

    const newArray = [...currentValue, defaultItem];
    onChange(newArray);

    // Update refs array size
    itemRefs.current = [...itemRefs.current, null];

    // Automatically expand the newly added item
    const newIndex = newArray.length - 1;
    setExpandedItem(newIndex);
  };

  // Handle removing item
  const handleRemoveItem = (index: number) => {
    if (!removable) return;

    const newArray = currentValue.filter((_, i) => i !== index);
    onChange(newArray);

    // Update refs array size
    itemRefs.current = itemRefs.current.filter((_, i) => i !== index);

    // Update expanded item after removal
    setExpandedItem((prev) => {
      if (prev === null) return null;
      if (prev === index) {
        // If the removed item was expanded, close expansion
        return null;
      } else if (prev > index) {
        // If expanded item was after the removed item, adjust its index
        return prev - 1;
      }
      // If expanded item was before the removed item, keep it as is
      return prev;
    });
  };

  // Handle drag and drop reordering
  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false);

    if (!orderable || !result.destination) return;

    const { source, destination } = result;

    if (source.index === destination.index) return;

    const newArray = Array.from(currentValue);
    const [reorderedItem] = newArray.splice(source.index, 1);
    newArray.splice(destination.index, 0, reorderedItem);

    onChange(newArray);

    // Update expanded item after reordering
    setExpandedItem((prev) => {
      if (prev === null) return null;

      if (prev === source.index) {
        // The expanded item was moved, update to its new position
        return destination.index;
      } else if (source.index < destination.index) {
        // Item moved forward - adjust indexes of items in between
        if (prev > source.index && prev <= destination.index) {
          return prev - 1;
        }
      } else {
        // Item moved backward - adjust indexes of items in between
        if (prev >= destination.index && prev < source.index) {
          return prev + 1;
        }
      }

      return prev;
    });
  };

  // Get display text for an item
  const getDisplayText = (item: unknown, index: number): string => {
    const typedItem = item as Record<string, unknown>;

    if (displayField && typedItem[displayField]) {
      return stripHtml(String(typedItem[displayField]));
    }

    // Fallback: try common field names
    const fallbackFields = ["name", "title", "label", "text", "author"];
    for (const field of fallbackFields) {
      if (typedItem[field]) {
        return stripHtml(String(typedItem[field]));
      }
    }

    return `Item ${index + 1}`;
  };

  // Render array item with expandable design
  const renderArrayItem = (
    item: unknown,
    index: number,
    provided?: DraggableProvided,
    snapshot?: DraggableStateSnapshot,
  ) => {
    const typedItem = item as Record<string, unknown>;
    const isExpanded = expandedItem === index;
    const displayText = getDisplayText(item, index);

    if (resolvedItemSchema.type === "object") {
      return (
        <div
          ref={(el) => {
            if (provided?.innerRef) {
              provided.innerRef(el);
            }
            itemRefs.current[index] = el;
          }}
          {...provided?.draggableProps}
          className={tx(
            "border rounded",
            isExpanded ? "border-gray-300" : "border-gray-200",
            `${snapshot?.isDragging && "shadow-lg"}`,
          )}
        >
          {/* Header row - always visible */}
          <div
            className={tx(
              "flex items-center cursor-pointer justify-between p-2 bg-gray-100 hover:bg-upstart-50",
            )}
            onClick={() => toggleExpanded(index)}
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {/* Drag handle */}
              {orderable && (
                <div
                  {...provided?.dragHandleProps}
                  className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                >
                  <MdDragIndicator className="w-4 h-4" />
                </div>
              )}

              <span className="text-xs font-normal text-gray-700 truncate whitespace-nowrap">
                {displayText}
              </span>
            </div>

            {/* Action buttons */}
            {removable && (
              <IconButton
                type="button"
                size="1"
                variant="ghost"
                color="red"
                onClick={() => handleRemoveItem(index)}
                title="Remove item"
              >
                <RxCross2 className="w-3 h-3" />
              </IconButton>
            )}
          </div>

          {/* Expanded content - only visible when expanded */}
          {isExpanded && (
            <div className="p-2 bg-gray-50 rounded-b-[inherit]">
              <div className="space-y-3">
                {/* Edit fields */}
                {processObjectSchemaToFields({
                  schema: resolvedItemSchema as TObject<TProperties>,
                  formData: typedItem || {},
                  formSchema,
                  onChange: (itemData, itemFieldId) => {
                    const newArray = [...currentValue];
                    const currentItem = (newArray[index] as Record<string, unknown>) || {};
                    newArray[index] = { ...currentItem, ...itemData };
                    onChange(newArray);
                  },
                  options: {
                    brickId,
                    parents: [...parents, `${fieldName}[${index}]`],
                  },
                })}
              </div>
            </div>
          )}
        </div>
      );
    }

    // For primitive types, use simple inline editing
    return (
      <div
        ref={(el) => {
          if (provided?.innerRef) {
            provided.innerRef(el);
          }
          itemRefs.current[index] = el;
        }}
        {...provided?.draggableProps}
        className={`flex items-center gap-2 p-2 border rounded border-gray-200 ${
          snapshot?.isDragging ? "shadow-lg" : ""
        }`}
      >
        {orderable && (
          <div
            {...provided?.dragHandleProps}
            className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600"
          >
            <MdDragIndicator className="w-4 h-4" />
          </div>
        )}

        <TextField.Root
          size="2"
          className="flex-1"
          value={`${item || ""}`}
          onChange={(e) => {
            const newArray = [...currentValue];
            newArray[index] = e.target.value;
            onChange(newArray);
          }}
        />

        {removable && (
          <IconButton
            type="button"
            size="1"
            variant="ghost"
            color="red"
            onClick={() => handleRemoveItem(index)}
            title="Remove item"
            className="group"
          >
            <RxCross2 className="w-3 h-3 text-gray-400 group-hover:text-red-800" />
          </IconButton>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3 flex-1 min-w-0">
      {/* Header with title and add button */}
      <div className="flex w-full items-center justify-between">
        <FieldTitle title={title} description={description} />
        {addable && (
          <Button type="button" onClick={handleAddItem} variant="soft" size="1" radius="full">
            <TbPlus className="w-3 h-3" /> Add item
          </Button>
        )}
      </div>

      {/* Array items */}
      {orderable ? (
        <DragDropContext onDragEnd={handleDragEnd} onDragStart={() => setIsDragging(true)}>
          <Droppable droppableId={`array-${id}`} direction="vertical">
            {(provided, snapshot) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className={`space-y-1`}>
                {currentValue.map((item, index) => {
                  // Create stable key for drag and drop
                  const stableKey = `item-${index}`;

                  return (
                    <Draggable key={stableKey} draggableId={stableKey} index={index}>
                      {(provided) => renderArrayItem(item, index, provided)}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div className="space-y-1 -mx-1">
          {currentValue.map((item, index) => (
            <div key={`${id}-${index}`}>{renderArrayItem(item, index)}</div>
          ))}
        </div>
      )}

      {currentValue.length === 0 && (
        <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded">
          No items added yet.
        </div>
      )}
    </div>
  );
}

// Helper function to get default values for primitive types
function getDefaultForType(type: string | undefined): unknown {
  switch (type) {
    case "string":
      return "";
    case "number":
    case "integer":
      return 0;
    case "boolean":
      return false;
    case "array":
      return [];
    case "object":
      return {};
    default:
      return "";
  }
}
