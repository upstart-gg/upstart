import {
  useState,
  useCallback,
  createContext,
  useContext,
  type ReactNode,
  type FC,
  useRef,
  useEffect,
  type CSSProperties,
} from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { tx } from "@upstart.gg/style-system/twind";
import type { NavItem, NavItemProperty } from "./types";
import { processObjectSchemaToFields } from "./field-factory";
import { Type } from "@sinclair/typebox";
import { useMutationObserver } from "~/editor/hooks/use-mutation-observer";

type FormNavigatorContextType = {
  navigateTo: (item: NavItem) => void;
  navigateBack: () => void;
  onChange: (data: Record<string, unknown>, changedPath: string) => void;
  formData: Record<string, unknown>;
  isRootView: boolean;
};

// Create context for navigation
const FormNavigatorContext = createContext<FormNavigatorContextType | null>(null);

// Custom hook to use navigation
export const useFormNavigation = () => {
  const context = useContext(FormNavigatorContext);
  if (!context) {
    throw new Error("useNavigation must be used within a FormNavigatorContext");
  }
  return context;
};

// Create List component
export const NavList: FC<{ items: NavItem[] }> = ({ items }) => {
  const { navigateTo } = useFormNavigation();
  return (
    <ul className={tx("list-none p-0 m-0")}>
      {items.map((item) => {
        return (
          <li
            key={item.id}
            className={tx(
              `select-none p-2.5 flex items-center text-[0.9rem] justify-between border-b last:border-b-0 border-gray-200
            dark:border-dark-400 transition-colors duration-200 flex-wrap`,
              item.children && "cursor-pointer hover:bg-upstart-50 dark:hover:bg-dark-600",
            )}
            onClick={() => {
              if (item.children) {
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
  const { onChange, formData } = useFormNavigation();
  const fields = processObjectSchemaToFields(Type.Object({ [item.id]: item.schema }), formData, onChange, {
    brickId,
    parents: item.path.split(".").slice(0, -1),
  });
  return fields.length ? fields : <div>No fields for {item.id} </div>;
}

// Main navigation component
type FormNavigatorProps = {
  title: string;
  navItems: NavItem[];
  onChange: (data: Record<string, unknown>, changedPath: string) => void;
  formData: Record<string, unknown>;
  className?: string;
  style?: CSSProperties;
  initialGroup?: string;
};

const FormNavigator: FC<FormNavigatorProps> = ({
  title,
  navItems,
  className,
  style,
  onChange,
  formData,
  initialGroup,
}) => {
  // Stack of views (each with content and title)
  const [viewStack, setViewStack] = useState<{ content: ReactNode; title: string }[]>([
    {
      content: <NavList items={navItems} />,
      title,
    },
  ]);

  const ref = useRef<HTMLDivElement>(null);
  const refNavigated = useRef(false);

  // Direction of animation
  const [animationDirection, setAnimationDirection] = useState<"forward" | "backward" | null>(null);

  // watch for overflow changes on vertical scroll
  useMutationObserver(
    ref,
    (entries) => {
      // wait for end of animation
      setTimeout(() => {
        for (const entry of entries) {
          const target = (entry.target as HTMLElement).closest(".navigator-view");
          if (!target?.clientHeight) return;
          if (ref.current && target.scrollHeight - target.clientHeight > 5) {
            ref.current.style.minHeight = `${target.scrollHeight + 2}px`;
          }
        }
      }, 200);
    },
    {},
  );

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
    if (initialGroup && !refNavigated.current) {
      return "";
    }
    return animationDirection === "forward" ? "animate-slide-in" : "animate-slide-back";
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (initialGroup && !refNavigated.current) {
      const item = navItems.find((item) => item.id === initialGroup);
      if (item) {
        navigateTo(item);
        setTimeout(() => {
          refNavigated.current = true;
        }, 0);
      }
    }
  }, []);

  return (
    <FormNavigatorContext.Provider
      value={{
        navigateTo,
        navigateBack,
        onChange,
        formData,
        isRootView: viewStack.length === 1,
      }}
    >
      <div
        ref={ref}
        className={tx(
          "navigator-view transition-all relative overflow-x-hidden overflow-y-hidden rounded-md  bg-white dark:bg-dark-500",
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
          <div
            className={tx(
              "flex items-center p-2.5 border-b border-gray-200 dark:border-dark-400 bg-gray-50 sticky top-0 z-10",
            )}
          >
            {!initialGroup && viewStack.length > 1 ? (
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
            ) : (
              <div className={tx("w-10")} />
            )}
            <h3 className={tx("flex-1 m-0 text-sm font-semibold text-center select-none")}>
              {currentView.title}
            </h3>
            {viewStack.length > 1 && <div className={tx("w-10")} />} {/* Spacer for alignment */}
          </div>
          <div className={tx("flex-1 overflow-auto min-h-max h-fit")}>{currentView.content}</div>
        </div>
      </div>
    </FormNavigatorContext.Provider>
  );
};

// Helper function to create a submenu
export const useSubMenu = (title: string, items: NavItem[]) => {
  return <NavList items={items} />;
};

export default FormNavigator;
