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
import type { NavItem, NavItemProperty } from "./types";
import { processObjectSchemaToFields } from "./field-factory";
import { type TObject, Type } from "@sinclair/typebox";
import { useMutationObserver } from "~/editor/hooks/use-mutation-observer";
import { tx, css } from "@upstart.gg/style-system/twind";

type FormNavigatorContextType = {
  navigateTo: (item: NavItem) => void;
  navigateBack: () => void;
  onChange: (data: Record<string, unknown>, changedPath: string) => void;
  formData: Record<string, unknown>;
  formSchema: TObject;
  isRootView: boolean;
  brickId?: string;
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
    <ul className="list-none p-0 m-0">
      {items.map((item) => {
        return (
          <li
            key={item.id}
            className={tx(
              `select-none p-2.5 flex items-center text-[0.9rem]
              justify-between border-b last:border-b-0 border-gray-100
            dark:border-dark-800 transition-colors duration-200 flex-wrap`,
              // if empty, hide
              "[&:not(:has(*))]:hidden",
              item.children && "cursor-pointer hover:bg-upstart-50 dark:hover:bg-dark-600",
            )}
            onClick={() => {
              if (item.children) {
                navigateTo(item);
              }
            }}
          >
            {item.schema ? <SchemaField item={item} /> : item.label}
            {item.children && <FiChevronRight className="text-gray-400 dark:text-inherit" />}
          </li>
        );
      })}
    </ul>
  );
};

function SchemaField({ item }: { item: NavItemProperty }) {
  const { onChange, formData, formSchema, brickId } = useFormNavigation();
  const fields = processObjectSchemaToFields({
    schema: Type.Object({ [item.id]: item.schema }, item.schema),
    formData,
    formSchema,
    onChange,
    options: {
      brickId,
      parents: item.path.split(".").slice(0, -1),
    },
  });

  return fields.length ? fields : null;
}

// Main navigation component
type FormNavigatorProps = {
  title: string;
  navItems: NavItem[];
  onChange: (data: Record<string, unknown>, changedPath: string) => void;
  formData: Record<string, unknown>;
  formSchema: TObject;
  className?: string;
  // style?: CSSProperties;
  initialGroup?: string;
  brickId?: string;
};

const FormNavigator: FC<FormNavigatorProps> = ({
  title,
  navItems,
  className,
  // style,
  onChange,
  formData,
  formSchema,
  initialGroup,
  brickId,
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

  // Navigate to a new view
  const navigateTo = useCallback((item: NavItem, direction: typeof animationDirection = "forward") => {
    setAnimationDirection(direction);

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (initialGroup && !refNavigated.current) {
      refNavigated.current = true;
      const item = navItems.find((item) => item.id === initialGroup);
      if (item) {
        navigateTo(item, null);
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
        brickId,
        formSchema,
        isRootView: viewStack.length === 1,
      }}
    >
      <div
        ref={ref}
        className={tx("navigator-view transition-all relative overflow-x-hidden scrollbar-thin", className)}
        style={{
          width: "100%",
          // ...style,
        }}
      >
        {/* Current View */}
        <div className={tx("absolute inset-0 flex flex-col", getAnimationClass())}>
          {/* Header */}
          <div className="flex items-center p-2.5 border-b border-gray-200 dark:border-dark-600 bg-gray-50 dark:bg-dark-800 sticky top-0 z-10">
            {viewStack.length > 1 ? (
              <button
                type="button"
                className={tx(
                  `flex items-center gap-1 p-0 bg-transparent text-upstart-600 dark:text-upstart-300
                  border-0 cursor-pointer font-medium text-sm hover:opacity-80 focus:outline-none select-none`,
                )}
                onClick={navigateBack}
              >
                <FiChevronLeft />
                Back
              </button>
            ) : (
              <div className="w-10" />
            )}
            <h3
              className={tx(
                "flex-1 m-0 text-sm font-semibold text-center select-none first-letter:uppercase",
              )}
            >
              {currentView.title}
            </h3>
            <div className="w-10" />
          </div>
          <div className="overflow-y-auto scrollbar-thin min-h-max h-fit pb-2">{currentView.content}</div>
        </div>
      </div>
    </FormNavigatorContext.Provider>
  );
};

export default FormNavigator;
