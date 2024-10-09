import type { BricksContainer, ContainerVariant } from "~/shared/bricks";
import {
  useState,
  forwardRef,
  useEffect,
  type PropsWithChildren,
  useCallback,
  type CSSProperties,
  useLayoutEffect,
} from "react";
import { useSortable } from "@dnd-kit/sortable";
import clsx from "clsx";
import { tx, apply } from "@twind/core";
import DragabbleBrickWrapper, { getBrickWrapperClass } from "./brick";
import { useDraft, useEditorEnabled } from "./use-editor";
import { CSS } from "@dnd-kit/utilities";
import { Menu, MenuButton, MenuItem, MenuItems, MenuSeparator } from "@headlessui/react";
import { CgArrowsV } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { useDndContext } from "@dnd-kit/core";
import { generateId } from "./bricks/common";
import { useMutationObserver } from "./use-mutation-observer";
import { IoMoveOutline } from "react-icons/io5";
import { RxDragHandleDots2 } from "react-icons/rx";

type ContainerProps = PropsWithChildren<
  {
    className?: string;
    style?: CSSProperties;
    dragging?: boolean;
    active?: boolean;
    placeholder?: boolean;
  } & BricksContainer
>;

export const Container = forwardRef<HTMLElement, ContainerProps>(
  ({ bricks, variant, className, id, children, dragging, placeholder, hidden, ...props }, ref) => {
    const containerBaseStyles = apply(
      "grid gap-2 relative w-full transition-all duration-300",
      {
        "rounded z-[9999] ring ring-primary-500 ring-opacity-80 ring-offset-3 shadow-lg bg-primary-500 bg-opacity-50":
          dragging,
        "hover:rounded hover:(ring ring-primary-100)": !dragging && !placeholder && !hidden,
        "bg-black bg-opacity-10 rounded": placeholder,
        "opacity-50 bg-gray-100 text-xs py-1 text-gray-600 text-center": hidden,
        "h-auto": !hidden && !props.style?.height,
      },
      !hidden && getContainerClasses(variant),
    );

    if (hidden) {
      return (
        <HiddenContainer
          ref={ref}
          id={id}
          className={clsx(tx(containerBaseStyles, className), "brick justify-center h-12")}
        />
      );
    }

    if (placeholder) {
      return (
        <section
          ref={ref}
          id={id}
          style={{ height: props.style?.height, minHeight: props.style?.height }}
          className={tx(containerBaseStyles, className)}
        />
      );
    }

    return (
      <section ref={ref} id={id} className={tx(containerBaseStyles, className)} {...props}>
        {bricks.map((child, index) => (
          <DragabbleBrickWrapper
            key={child.id}
            className={tx(apply(getBrickWrapperClass(child, index, variant)))}
            brick={child}
          />
        ))}
        {children}
        {dragging && (
          /* repeat the container menu because it would disapear while dragging */
          <div
            className={tx(
              "absolute border-8 border-y-0 border-transparent transition-all duration-300 p-2 \
              group-hover:(opacity-100) -right-14 top-0 rounded-r overflow-hidden bg-gray-100 w-12 bottom-0 \
              flex flex-col gap-2 items-center justify-center",
            )}
          >
            <ContainerDragHandle forceVisible />
            <ContainerMenu
              forceVisible
              container={{ id, bricks, variant, type: "container" }}
              bricksCount={1}
            />
          </div>
        )}
      </section>
    );
  },
);

const HiddenContainer = forwardRef<HTMLElement, Pick<HTMLDivElement, "id" | "className">>(
  ({ className, id, ...props }, ref) => {
    const draft = useDraft();
    const [text, setText] = useState("Hidden container");
    const [over, setOver] = useState(false);

    useEffect(() => {
      setText(over ? "Click to show" : "Hidden container");
    }, [over]);

    return (
      <section
        ref={ref}
        id={id}
        className={className}
        onMouseOver={() => setOver(true)}
        onFocus={() => setOver(true)}
        onMouseLeave={() => setOver(false)}
        onBlur={() => setOver(false)}
        {...props}
      >
        <button type="button" onClick={() => draft.toggleContainerVisibility(id)}>
          {text}
        </button>
      </section>
    );
  },
);

export function SortableContainer(props: ContainerProps) {
  const { children, className, ...container } = props;
  // compute the effective container height once mounted
  const [containerHeight, setContainerHeight] = useState(0);
  const dndCtx = useDndContext();

  const { setNodeRef, setActivatorNodeRef, attributes, listeners, transition, transform, over, active } =
    useSortable({
      id: props.id,
      data: { type: "container" },
      transition: {
        duration: 250, // milliseconds
        easing: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    // maintain a fixed height while dragging to avoid layout shift
    ...(dndCtx.active && containerHeight
      ? { height: `${containerHeight}px`, minHeight: `${containerHeight}px` }
      : {}),
  };

  // Always update the container height when the container is mounted
  useEffect(() => {
    const container = document.getElementById(props.id);
    const tmt = setInterval(() => {
      // console.log("compute container height", container?.offsetHeight);
      // console.log("compute rect height", container?.getBoundingClientRect().height);
      setContainerHeight(container?.offsetHeight ?? 0);
    }, 333);
    return () => clearInterval(tmt);
  }, [props.id]);

  return (
    <Container
      ref={setNodeRef}
      className={tx(apply("relative touch-none group"), className)}
      placeholder={active?.data.current?.type === "container" && over?.id === props.id}
      style={style}
      {...container}
      {...attributes}
      data-height={containerHeight}
    >
      {!active && (
        /* Wrapper for container menu */
        <div
          className={tx(
            "absolute border-8 border-y-0 border-transparent transition-all duration-300 p-2 opacity-0 \
            group-hover:(opacity-100) hover:(!opacity-100) -right-14 -top-1 rounded overflow-hidden bg-gray-100 w-12 \
            flex flex-col gap-2 items-center justify-start",
          )}
        >
          <ContainerDragHandle {...listeners} ref={setActivatorNodeRef} />
          <ContainerMenu container={container} bricksCount={container.bricks.length} />
        </div>
      )}
    </Container>
  );
}

type ContainerListProps = {
  containers: BricksContainer[];
};

export function ContainerList(props: ContainerListProps) {
  const editorEnabled = useEditorEnabled();

  if (!editorEnabled) {
    return props.containers.map((container) => <Container {...container} key={container.id} />);
  }

  return props.containers.map((container) => <SortableContainer {...container} key={container.id} />);
}

function getContainerClasses(variant: ContainerVariant) {
  return {
    "grid-cols-1": variant === "full",
    "grid-cols-2": variant === "1-1",
    "md:grid-cols-3": variant === "1-1-1" || variant === "1-2" || variant === "2-1",
    "md:grid-cols-4":
      variant === "1-1-1-1" ||
      variant === "1-1-2" ||
      variant === "2-2" ||
      variant === "1-2-1" ||
      variant === "2-1-1",
  };
}

type ContainerDragHandleProps = {
  forceVisible?: boolean;
};

const ContainerDragHandle = forwardRef<HTMLDivElement, ContainerDragHandleProps>(function ContainerDragHandle(
  { forceVisible, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={clsx(
        "container-handle",
        tx(
          "text-white shadow-sm transition-opacity duration-300 \
          -left-8 h-8 w-8 bg-primary-400 hover:bg-primary-500 rounded flex items-center justify-center cursor-grab",
          "group-hover:(opacity-70) hover:!opacity-100 border-2 border-primary-400 hover:border-primary-400 ",
          { "opacity-100": forceVisible },
        ),
      )}
      {...props}
    >
      <IoMoveOutline className={tx("w-5 h-5 mx-auto select-none")} />
    </div>
  );
});

function computeNextVariant(variant: ContainerVariant): ContainerVariant | undefined {
  switch (variant) {
    case "full":
      return "1-1";
    case "1-1":
      return "1-1-1";
    case "1-1-1":
    case "1-1-2":
    case "1-2-1":
    case "2-1-1":
      return "1-1-1-1";
    case "1-2":
      return "1-1-2";
    case "2-1":
      return "1-2-1";
  }
}

type ContainerMenuProps = {
  container: BricksContainer;
  forceVisible?: boolean;
  bricksCount: number;
};

function ContainerMenu({ forceVisible, bricksCount, container }: ContainerMenuProps) {
  const draft = useDraft();

  const addColumn = useCallback(() => {
    const newVariant = computeNextVariant(container.variant);
    if (newVariant) {
      draft.updateContainer(container.id, {
        variant: newVariant,
        bricks: [
          ...container.bricks,
          {
            id: `brick-${generateId()}`,
            type: "text",
            props: {
              content: "New brick content",
            },
            wrapper: {},
          },
        ],
      });
    }
  }, [container, draft]);

  return (
    <Menu>
      <MenuButton
        className={clsx(
          "container-menu-button",
          tx(
            "text-white shadow-sm transition-opacity duration-300 \
            -left-8 h-8 w-8 bg-primary-400 hover:bg-primary-500 rounded flex items-center justify-center",
            "group-hover:(opacity-70) hover:!opacity-100 border-2 border-primary-400 hover:border-primary-400 ",
            { "opacity-100": forceVisible },
          ),
        )}
      >
        <IoSettingsOutline className={tx("w-5 h-5 mx-auto select-none")} />
      </MenuButton>
      <MenuItems
        anchor="bottom"
        className={tx(
          "bg-white min-w-[9rem] flex flex-col shadow-xl text-sm border border-gray-200 rounded overflow-hidden text-gray-700",
        )}
      >
        <MenuItem
          as="button"
          className={tx("px-2 py-1.5 block hover:bg-primary-100 text-left")}
          onClick={() => draft.toggleContainerVisibility(container.id)}
        >
          {container.hidden ? "Show" : "Hide"} container
        </MenuItem>
        <MenuItem
          as="button"
          className={tx("px-2 py-1.5 block hover:bg-primary-100 text-left")}
          onClick={() => draft.deleteContainer(container.id)}
        >
          Delete row
        </MenuItem>
        {bricksCount < 4 && (
          <>
            <MenuSeparator className={tx("my-1 h-px bg-gray-200")} />
            <MenuItem
              as="button"
              className={tx("px-2 py-1.5 block hover:bg-primary-100 text-left")}
              onClick={() => addColumn()}
            >
              Add column
            </MenuItem>
          </>
        )}
      </MenuItems>
    </Menu>
  );
}

export default Container;
