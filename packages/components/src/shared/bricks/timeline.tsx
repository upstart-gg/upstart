import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import BrickWrapper from "../components/BrickWrapper";
import EditableBrickWrapper from "../../editor/components/EditableBrick";
import { tx } from "@upstart.gg/style-system/twind";
import BrickRoot from "../components/BrickRoot";
import { useBrickStyle } from "../hooks/use-brick-style";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { manifest, type Manifest } from "@upstart.gg/sdk/shared/bricks/manifests/timeline.manifest";
import type { Static } from "@sinclair/typebox";

// Define the TimelineItem type from the manifest schema
type TimelineProps = Static<Manifest["props"]>;
type TimelineItem = TimelineProps["items"][number];

export default function Timeline({
  brick,
  editable,
  isDynamicPreview,
  iterationIndex,
  level = 0,
}: BrickProps<Manifest>) {
  const styles = useBrickStyle<Manifest>(brick);

  const items = Array.isArray(brick.props.items) ? brick.props.items : [];
  const children: Brick[][] = Array.isArray(brick.props.$children) ? brick.props.$children : [];
  const layout = brick.props.layout || "left";
  const showConnector = brick.props.showConnector !== false;
  const connectorColor = brick.props.connectorColor;
  const itemSpacing = brick.props.itemSpacing || "2rem";
  const showIcons = brick.props.showIcons !== false;
  const iconSize = brick.props.iconSize || "md";
  const showDates = brick.props.showDates !== false;
  const datePosition = brick.props.datePosition || "top";
  const colorPreset = brick.props.colorPreset;

  const containerClasses = tx([
    "relative",
    // Color preset background
    colorPreset?.color && `bg-[${colorPreset.color}]/5`,
  ]);

  const connectorClasses = tx([
    "absolute left-4 top-0 bottom-0 w-0.5",
    connectorColor?.color ? `bg-[${connectorColor.color}]` : "bg-gray-300",
    layout === "right" && "left-auto right-4",
    layout === "alternating" && "left-1/2 transform -translate-x-1/2",
  ]);

  const getItemClasses = (index: number) => {
    const isAlternating = layout === "alternating";
    const isEven = index % 2 === 0;

    return tx([
      "relative flex items-start",
      `mb-[${itemSpacing}]`,
      layout === "right" && "flex-row-reverse",
      isAlternating && isEven && "flex-row-reverse",
      isAlternating && "justify-center",
    ]);
  };

  const getContentClasses = (index: number) => {
    const isAlternating = layout === "alternating";
    const isEven = index % 2 === 0;

    return tx([
      "flex-1 max-w-md",
      layout === "left" && "ml-8",
      layout === "right" && "mr-8 text-right",
      isAlternating && isEven && "mr-8 text-right",
      isAlternating && !isEven && "ml-8",
    ]);
  };

  const getIconClasses = (status?: string) => {
    const sizeMap = {
      sm: "w-6 h-6",
      md: "w-8 h-8",
      lg: "w-10 h-10",
    };

    const statusColorMap = {
      completed: "bg-green-500 text-white",
      current: "bg-blue-500 text-white",
      upcoming: "bg-gray-400 text-white",
    };

    return tx([
      "rounded-full flex items-center justify-center z-10 relative",
      sizeMap[iconSize as keyof typeof sizeMap],
      (status && statusColorMap[status as keyof typeof statusColorMap]) || "bg-gray-500 text-white",
      colorPreset?.color && !status && `bg-[${colorPreset.color}] text-white`,
    ]);
  };

  const getTitleClasses = (status?: string) => {
    const statusColorMap = {
      completed: "text-green-700",
      current: "text-blue-700",
      upcoming: "text-gray-500",
    };

    return tx([
      "font-semibold text-lg",
      (status && statusColorMap[status as keyof typeof statusColorMap]) || "text-gray-900",
      colorPreset?.color && !status && `text-[${colorPreset.color}]`,
    ]);
  };

  const getDateClasses = () => {
    return tx(["text-sm font-medium", colorPreset?.color ? `text-[${colorPreset.color}]` : "text-gray-600"]);
  };

  const renderTimelineItem = (item: TimelineItem, index: number) => {
    const hasChildren = children[index] && children[index].length > 0;

    return (
      <div key={item.id || index} className={getItemClasses(index)}>
        {/* Icon/Marker */}
        {showIcons && (
          <div className={getIconClasses(item.status)}>
            {item.icon ? (
              <div className="w-4 h-4 flex items-center justify-center">
                <span className="iconify" data-icon={item.icon} />
              </div>
            ) : (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
        )}

        {/* Content */}
        <div className={getContentClasses(index)}>
          {/* Date - Top */}
          {showDates && datePosition === "top" && item.date && (
            <div className={getDateClasses()}>{item.date}</div>
          )}

          {/* Title */}
          <h3 className={getTitleClasses(item.status)}>{item.title}</h3>

          {/* Subtitle */}
          {item.subtitle && <h4 className="text-base font-medium text-gray-600 mt-1">{item.subtitle}</h4>}

          {/* Date - Inline */}
          {showDates && datePosition === "inline" && item.date && (
            <span className={tx([getDateClasses(), "ml-2"])}>• {item.date}</span>
          )}

          {/* Description */}
          {item.description && <p className="text-gray-700 mt-2">{item.description}</p>}

          {/* Custom Content */}
          {hasChildren && (
            <div className="mt-4">
              {children[index].map((childBrick: Brick, childIndex: number) => {
                const ChildBrickComponent = editable ? EditableBrickWrapper : BrickWrapper;
                return (
                  <ChildBrickComponent
                    key={childBrick.id || childIndex}
                    brick={childBrick}
                    index={childIndex}
                    level={level + 1}
                  />
                );
              })}
            </div>
          )}

          {/* Date - Bottom */}
          {showDates && datePosition === "bottom" && item.date && (
            <div className={tx([getDateClasses(), "mt-2"])}>{item.date}</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <BrickRoot editable={editable} manifest={manifest} brick={brick} className={containerClasses}>
      {/* Connector Line */}
      {showConnector && items.length > 1 && <div className={connectorClasses} />}

      {/* Timeline Items */}
      <div className="relative">
        {items.map((item: TimelineItem, index: number) => renderTimelineItem(item, index))}
      </div>
    </BrickRoot>
  );
}
