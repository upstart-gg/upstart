import { useState, useCallback, createContext, useContext, type ReactNode } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { tx, css } from "@upstart.gg/style-system/twind";

// Types
export type NavigationItem = {
  id: string;
  label: ReactNode;
  content?: ReactNode;
  hasChildren?: boolean;
  onSelect?: () => void;
};

type NavigationContextType = {
  navigateTo: (content: ReactNode, title: string) => void;
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
export const NavigationContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className={tx("p-4 flex-1 overflow-auto")}>{children}</div>;
};

// Create List component
export const NavList: React.FC<{ items: NavigationItem[] }> = ({ items }) => {
  const { navigateTo } = useNavigation();

  return (
    <ul className={tx("list-none p-0 m-0")}>
      {items.map((item) => (
        <li
          key={item.id}
          className={tx(
            "p-3 flex items-center justify-between border-b border-gray-200 cursor-pointer hover:bg-gray-100 transition-colors duration-200",
          )}
          onClick={() => {
            if (item.onSelect) {
              item.onSelect();
            }
            if (item.hasChildren && item.content) {
              const title = typeof item.label === "string" ? item.label : "Detail";
              navigateTo(item.content, title);
            }
          }}
        >
          {item.label}
          {item.hasChildren && <FiChevronRight className={tx("text-gray-400")} />}
        </li>
      ))}
    </ul>
  );
};

// Main navigation component
type NavigationContainerProps = {
  rootTitle: string;
  rootItems: NavigationItem[];
  className?: string;
  style?: React.CSSProperties;
};

export const NavigationContainer: React.FC<NavigationContainerProps> = ({
  rootTitle,
  rootItems,
  className,
  style,
}) => {
  // Stack of views (each with content and title)
  const [viewStack, setViewStack] = useState<{ content: ReactNode; title: string }[]>([
    {
      content: <NavList items={rootItems} />,
      title: rootTitle,
    },
  ]);

  // Direction of animation
  const [animationDirection, setAnimationDirection] = useState<"forward" | "backward" | null>(null);

  // Navigate to a new view
  const navigateTo = useCallback((content: ReactNode, title: string) => {
    setAnimationDirection("forward");
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
        className={tx("relative overflow-hidden rounded-md border border-gray-200 bg-white", className)}
        style={{
          height: "500px",
          width: "100%",
          ...style,
        }}
      >
        {/* Current View */}
        <div className={tx("absolute inset-0 flex flex-col", getAnimationClass())}>
          {/* Header */}
          <div className={tx("flex items-center p-3 border-b border-gray-200 min-h-12")}>
            {viewStack.length > 1 && (
              <button
                type="button"
                className={tx(
                  "flex items-center gap-1 p-0 bg-transparent text-upstart-600 border-0 cursor-pointer font-medium text-sm hover:opacity-90 focus:outline-none",
                )}
                onClick={navigateBack}
              >
                <FiChevronLeft />
                Back
              </button>
            )}
            <h3 className={tx("flex-1 m-0 text-base font-semibold text-center")}>{currentView.title}</h3>
            {viewStack.length > 1 && <div className={tx("w-10")} />} {/* Spacer for alignment */}
          </div>
          <div className={tx("flex-1 overflow-auto")}>{currentView.content}</div>
        </div>
      </div>
    </NavigationContext.Provider>
  );
};

// Helper function to create a submenu
export const useSubMenu = (title: string, items: NavigationItem[]) => {
  return <NavList items={items} />;
};
