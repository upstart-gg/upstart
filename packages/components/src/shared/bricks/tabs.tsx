import { type Manifest, manifest } from "@upstart.gg/sdk/shared/bricks/manifests/tabs.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import BrickWrapper from "../components/BrickWrapper";
import EditableBrickWrapper from "../../editor/components/EditableBrick";
import { tx } from "@upstart.gg/style-system/twind";
import BrickRoot from "../components/BrickRoot";
import { useBrickStyle } from "../hooks/use-brick-style";
import { useState } from "react";
import type { Brick } from "@upstart.gg/sdk/bricks";

export default function Tabs({
  brick,
  editable,
  isDynamicPreview,
  iterationIndex,
  level = 0,
}: BrickProps<Manifest>) {
  const styles = useBrickStyle<Manifest>(brick);

  const tabs = Array.isArray(brick.props.tabs) ? brick.props.tabs : [];
  const children = Array.isArray(brick.props.$children) ? brick.props.$children : [];
  const defaultTab = typeof brick.props.defaultTab === "number" ? brick.props.defaultTab : 0;
  const tabPosition = brick.props.tabPosition || "top";
  const tabStyle = brick.props.tabStyle || "underline";
  const fullWidth = brick.props.fullWidth || false;
  const padding = brick.props.padding || "1.5rem";
  const gap = brick.props.gap || "0.5rem";

  const [activeTab, setActiveTab] = useState(Math.max(0, Math.min(defaultTab, tabs.length - 1)));

  // Ensure we don't exceed available tabs/children
  const safeActiveTab = Math.max(0, Math.min(activeTab, Math.min(tabs.length - 1, children.length - 1)));
  const activeChildren = Array.isArray(children[safeActiveTab]) ? children[safeActiveTab] : [];

  // Helper function to get tab button classes based on style
  const getTabButtonClasses = (isActive: boolean) => {
    const baseClasses =
      "px-4 py-2 font-medium text-sm transition-all duration-200 cursor-pointer select-none";

    switch (tabStyle) {
      case "pills":
        return tx(
          baseClasses,
          "rounded-full",
          isActive ? "bg-blue-600 text-white shadow-sm" : "bg-gray-100 text-gray-700 hover:bg-gray-200",
        );

      case "bordered":
        return tx(
          baseClasses,
          "border border-gray-200 first:rounded-l-md last:rounded-r-md -ml-px first:ml-0",
          isActive
            ? "bg-blue-50 text-blue-700 border-blue-300 z-10 relative"
            : "bg-white text-gray-700 hover:bg-gray-50",
        );

      default: // underline style
        return tx(
          baseClasses,
          "border-b-2",
          isActive
            ? "border-blue-600 text-blue-700"
            : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300",
        );
    }
  };

  // Helper function to get tab container classes
  const getTabContainerClasses = () => {
    const baseClasses = "flex";

    if (fullWidth) {
      return tx(baseClasses, "w-full");
    }

    switch (tabStyle) {
      case "pills":
        return tx(baseClasses, "space-x-2");
      case "bordered":
        return tx(baseClasses);
      default: // underline style
        return tx(baseClasses, "border-b border-gray-200");
    }
  };

  // Render tab buttons
  const renderTabButtons = () => (
    <div className={getTabContainerClasses()} style={{ gap: tabStyle === "underline" ? gap : undefined }}>
      {tabs.map((tab: { id?: string; label: string }, index: number) => (
        <button
          key={tab.id || index}
          type="button"
          className={tx(getTabButtonClasses(index === safeActiveTab), fullWidth && "flex-1 text-center")}
          onClick={() => setActiveTab(index)}
          disabled={editable}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  // Render tab content panel
  const renderTabContent = () => (
    <div className={tx("flex-1", brick.props.rounding || "rounded-md")} style={{ padding }}>
      {activeChildren.map((child: Brick, index: number) =>
        editable ? (
          <EditableBrickWrapper
            key={child.id}
            brick={child}
            index={index}
            iterationIndex={iterationIndex}
            isDynamicPreview={isDynamicPreview}
          />
        ) : (
          <BrickWrapper key={child.id} brick={child} />
        ),
      )}
      {activeChildren.length === 0 && (
        <div className="text-gray-500 text-center py-8">
          {editable ? "Drop bricks here to add content to this tab" : "No content available"}
        </div>
      )}
    </div>
  );

  if (tabs.length === 0) {
    return (
      <BrickRoot
        editable={editable}
        manifest={manifest}
        brick={brick}
        className={tx("flex flex-col items-center justify-center text-center p-8", Object.values(styles))}
      >
        <div className="text-gray-500">
          {editable ? "Configure tabs in the panel to get started" : "No tabs configured"}
        </div>
      </BrickRoot>
    );
  }

  return (
    <BrickRoot
      editable={editable}
      manifest={manifest}
      className={tx("flex flex-col w-full", Object.values(styles))}
      brick={brick}
    >
      {tabPosition === "top" && renderTabButtons()}
      {renderTabContent()}
      {tabPosition === "bottom" && renderTabButtons()}
    </BrickRoot>
  );
}
