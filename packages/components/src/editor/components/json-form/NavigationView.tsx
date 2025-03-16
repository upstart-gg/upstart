import { useState, useCallback, createContext, useContext, type ReactNode, type FC } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { tx, css } from "@upstart.gg/style-system/twind";
import type { NavItem, NavItemProperty } from "./types";
import { processObjectSchemaToFields } from "./field-factory";
import { Type, type TObject } from "@sinclair/typebox";

type NavigationContextType = {
  navigateTo: (item: NavItem) => void;
  navigateBack: () => void;
  isRootView: boolean;
};

// Create context for navigation
const NavigationContext = createContext<NavigationContextType | null>(null);

// Custom hook to use navigation
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a NavigationProvider");
  }
  return context;
};

// Navigation Content component
const NavigationContent: FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={tx("p-4 flex-1 overflow-auto")}>content: {children}</div>;
};

// Create List component
export const NavList: FC<{ items: NavItem[] }> = ({ items }) => {
  const { navigateTo } = useNavigation();
  return (
    <ul className={tx("list-none p-0 m-0")}>
      {items.map((item) => {
        return (
          <li
            key={item.id}
            className={tx(
              `select-none p-2.5 flex items-center text-sm justify-between border-b border-gray-200
            dark:border-dark-400 transition-colors duration-200 font-medium`,
              item.children && "cursor-pointer hover:bg-gray-100 dark:hover:bg-dark-600",
            )}
            onClick={() => {
              console.log("clicked on %o", item);
              if (item.children) {
                console.log("navigating to %o", item);
                navigateTo(item);
              }
            }}
          >
            {item.schema ? <SchemaField item={item} /> : item.label}
            {item.children && <FiChevronRight className={tx("text-gray-400")} />}
          </li>
        );
      })}
    </ul>
  );
};

function SchemaField({ item, brickId }: { item: NavItemProperty; brickId?: string }) {
  const onChange = (value: any) => {};
  console.log("Generating fields for %s, schema = %o", item.id, item.schema);
  const fields = processObjectSchemaToFields(Type.Object({ [item.id]: item.schema }), {}, onChange, {
    brickId,
  });
  console.log("fields: %o", fields);
  return fields.length ? fields : <div>No fields for {item.id} </div>;
}

// Main navigation component
type NavigationContainerProps = {
  title: string;
  navItems: NavItem[];
  className?: string;
  style?: React.CSSProperties;
};

export const NavigationContainer: React.FC<NavigationContainerProps> = ({
  title,
  navItems,
  className,
  style,
}) => {
  // Stack of views (each with content and title)
  const [viewStack, setViewStack] = useState<{ content: ReactNode; title: string }[]>([
    {
      content: <NavList items={navItems} />,
      title,
    },
  ]);

  // Direction of animation
  const [animationDirection, setAnimationDirection] = useState<"forward" | "backward" | null>(null);

  // Navigate to a new view
  const navigateTo = useCallback((item: NavItem) => {
    setAnimationDirection("forward");

    const content = item.children ? <NavList items={item.children} /> : <div>content: {item.label}</div>;
    const title = item.label ?? "Untitled";
    setViewStack((prev) => [...prev, { content, title }]);
    // Reset animation direction after animation completes
    setTimeout(() => {
      setAnimationDirection(null);
    }, 300);
  }, []);

  // Navigate back to previous view
  const navigateBack = useCallback(() => {
    if (viewStack.length <= 1) return;

    setAnimationDirection("backward");
    setViewStack((prev) => prev.slice(0, -1));

    // Reset animation direction after animation completes
    setTimeout(() => {
      setAnimationDirection(null);
    }, 300);
  }, [viewStack.length]);

  // Current view is the last one in the stack
  const currentView = viewStack[viewStack.length - 1];

  // Get animation classes based on direction
  const getAnimationClass = () => {
    if (!animationDirection) return "";
    return animationDirection === "forward" ? "animate-slide-in" : "animate-slide-back";
  };

  return (
    <NavigationContext.Provider
      value={{
        navigateTo,
        navigateBack,
        isRootView: viewStack.length === 1,
      }}
    >
      <div
        className={tx(
          "relative overflow-hidden rounded-md border border-gray-200 dark:border-dark-400 bg-white dark:bg-dark-500",
          className,
        )}
        style={{
          // height: "500px",
          minHeight: "300px",
          width: "100%",
          ...style,
        }}
      >
        {/* Current View */}
        <div className={tx("absolute inset-0 flex flex-col", getAnimationClass())}>
          {/* Header */}
          <div className={tx("flex items-center p-2.5 border-b border-gray-200 dark:border-dark-400")}>
            {viewStack.length > 1 && (
              <button
                type="button"
                className={tx(
                  `flex items-center gap-1 p-0 bg-transparent text-upstart-600 dark:text-upstart-300
                  border-0 cursor-pointer font-medium text-sm hover:opacity-90 focus:outline-none`,
                )}
                onClick={navigateBack}
              >
                <FiChevronLeft />
                Back
              </button>
            )}
            <h3 className={tx("flex-1 m-0 text-sm font-semibold text-center select-none")}>
              {currentView.title}
            </h3>
            {viewStack.length > 1 && <div className={tx("w-10")} />} {/* Spacer for alignment */}
          </div>
          <div className={tx("flex-1 overflow-auto min-h-max h-fit")}>{currentView.content}</div>
        </div>
      </div>
    </NavigationContext.Provider>
  );
};

// Helper function to create a submenu
export const useSubMenu = (title: string, items: NavItem[]) => {
  return <NavList items={items} />;
};
