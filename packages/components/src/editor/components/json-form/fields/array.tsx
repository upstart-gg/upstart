import { DragDropContext, Draggable, Droppable, type DropResult } from "@hello-pangea/dnd";
import type { TObject, TProperties, TSchema } from "@sinclair/typebox";
import { resolveSchema } from "@upstart.gg/sdk/shared/utils/schema-resolver";
import { tx } from "@upstart.gg/style-system/twind";
import { useState } from "react";
import { MdDelete, MdDragIndicator, MdExpandLess, MdExpandMore } from "react-icons/md";
import { TbPlus } from "react-icons/tb";
import { FieldTitle, processObjectSchemaToFields } from "../field-factory";
import type { FieldProps } from "./types";

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
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  // Get UI options from the array schema (not item schema)
  const uiOptions = schema["ui:options"] as Record<string, boolean> | undefined;
  const maxItems = schema.maxItems as number | undefined;
  const addable = uiOptions?.addable ?? true;
  const removable = uiOptions?.removable ?? true;
  const orderable = uiOptions?.orderable ?? true;

  // Get the display field for collapsed items
  const displayField = schema["ui:displayField"] as string | undefined;

  const resolvedItemSchema = resolveSchema(itemSchema);

  // Handle expanding/collapsing items
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

    // Automatically expand the newly added item
    const newIndex = newArray.length - 1;
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      newSet.add(newIndex);
      return newSet;
    });
  };

  // Handle removing item
  const handleRemoveItem = (index: number) => {
    if (!removable) return;

    const newArray = currentValue.filter((_, i) => i !== index);
    onChange(newArray);

    // Update expanded items after removal
    setExpandedItems((prev) => {
      const newSet = new Set<number>();
      prev.forEach((expandedIndex) => {
        if (expandedIndex < index) {
          newSet.add(expandedIndex);
        } else if (expandedIndex > index) {
          newSet.add(expandedIndex - 1);
        }
      });
      return newSet;
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

    // Update expanded items after reordering
    setExpandedItems((prev) => {
      const newSet = new Set<number>();
      prev.forEach((expandedIndex) => {
        if (expandedIndex === source.index) {
          newSet.add(destination.index);
        } else if (source.index < destination.index) {
          if (expandedIndex > source.index && expandedIndex <= destination.index) {
            newSet.add(expandedIndex - 1);
          } else {
            newSet.add(expandedIndex);
          }
        } else {
          if (expandedIndex >= destination.index && expandedIndex < source.index) {
            newSet.add(expandedIndex + 1);
          } else {
            newSet.add(expandedIndex);
          }
        }
      });
      return newSet;
    });
  };

  // Get display text for an item
  const getDisplayText = (item: unknown, index: number): string => {
    const typedItem = item as Record<string, unknown>;

    if (displayField && typedItem[displayField]) {
      return String(typedItem[displayField]);
    }

    // Fallback: try common field names
    const fallbackFields = ["name", "title", "label", "text", "author"];
    for (const field of fallbackFields) {
      if (typedItem[field]) {
        return String(typedItem[field]);
      }
    }

    return `Item ${index + 1}`;
  };

  // Render array item with expandable design
  const renderArrayItem = (
    item: unknown,
    index: number,
    // biome-ignore lint/suspicious/noExplicitAny: DragDropContext types are complex
    provided?: { innerRef?: any; draggableProps?: any; dragHandleProps?: any },
  ) => {
    const typedItem = item as Record<string, unknown>;
    const isExpanded = expandedItems.has(index);
    const displayText = getDisplayText(item, index);

    // Create a stable key for drag and drop
    const stableKey = `item-${index}`;

    if (resolvedItemSchema.type === "object") {
      return (
        <div
          ref={provided?.innerRef}
          {...provided?.draggableProps}
          className={`${isDragging ? "shadow-lg" : ""}`}
        >
          {/* Header row - always visible */}
          <div
            className={tx(
              "flex items-center justify-between p-2 hover:bg-gray-50  border-gray-200 rounded bg-white",
              isExpanded ? "border-t, border-r border-l" : "border",
            )}
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

              <span className="text-sm font-medium text-gray-700 truncate">{displayText}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => toggleExpanded(index)}
                className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded transition-colors"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <MdExpandLess className="w-4 h-4" /> : <MdExpandMore className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Expanded content - only visible when expanded */}
          {isExpanded && (
            <div className="border-l border-r border-b border-gray-200 p-3 bg-gray-50 rounded-b">
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

                {/* Action buttons */}
                {removable && (
                  <div className="flex justify-end border-gray-200">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                      title="Remove item"
                    >
                      <MdDelete className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      );
    }

    // For primitive types, use simple inline editing
    return (
      <div
        ref={provided?.innerRef}
        {...provided?.draggableProps}
        className={`flex items-center gap-2 p-2 border rounded bg-white ${
          isDragging ? "shadow-lg" : "shadow-sm"
        } transition-shadow`}
      >
        {orderable && (
          <div
            {...provided?.dragHandleProps}
            className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-600"
          >
            <MdDragIndicator className="w-4 h-4" />
          </div>
        )}

        <input
          type="text"
          value={String(item || "")}
          onChange={(e) => {
            const newArray = [...currentValue];
            newArray[index] = e.target.value;
            onChange(newArray);
          }}
          className="flex-1 px-2 py-1 border rounded text-sm"
        />

        {removable && (
          <button
            type="button"
            onClick={() => handleRemoveItem(index)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto rounded transition-colors"
          >
            <MdDelete className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3 flex-1">
      {/* Header with title and add button */}
      <div className="flex w-full items-center justify-between">
        <FieldTitle title={title} description={description} />
        {addable && (
          <button
            type="button"
            onClick={handleAddItem}
            disabled={maxItems !== undefined && currentValue.length >= maxItems}
            className={tx(
              "inline-flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors",
              maxItems !== undefined && currentValue.length >= maxItems
                ? "text-gray-300 cursor-not-allowed"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-200",
            )}
            title={
              maxItems !== undefined && currentValue.length >= maxItems
                ? `Maximum of ${maxItems} items allowed`
                : "Add Item"
            }
          >
            <TbPlus className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Array items */}
      {orderable ? (
        <DragDropContext onDragEnd={handleDragEnd} onDragStart={() => setIsDragging(true)}>
          <Droppable droppableId={`array-${id}`}>
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-1 ${snapshot.isDraggingOver ? "bg-blue-50" : ""}`}
              >
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
        <div className="space-y-1">
          {currentValue.map((item, index) => (
            <div key={`${id}-${index}`}>{renderArrayItem(item, index)}</div>
          ))}
        </div>
      )}

      {currentValue.length === 0 && (
        <div className="text-center py-6 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded text-pretty">
          No items added yet. Click on the "+" to get started.
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
