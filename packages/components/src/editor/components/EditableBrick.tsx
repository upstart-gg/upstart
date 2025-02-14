import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { forwardRef, memo, useRef, useState, type ComponentProps, type MouseEvent } from "react";
import { tx } from "@upstart.gg/style-system/twind";
import { useDraft, useEditorHelpers, usePreviewMode, useSelectedBrick } from "../hooks/use-editor";
import { DropdownMenu, IconButton, Portal } from "@upstart.gg/style-system/system";
import { BiDotsVerticalRounded } from "react-icons/bi";
import BaseBrick from "~/shared/components/BaseBrick";
import { useBrickWrapperStyle } from "~/shared/hooks/use-brick-style";

// const MemoBrickComponent = memo(BaseBrick, (prevProps, nextProps) => {
//   const compared = isEqualWith(prevProps, nextProps, (objValue, othValue, key, _, __) => {
//     if (key === "content") {
//       // If the key is in our ignore list, consider it equal
//       return true;
//     }
//     // Otherwise, use the default comparison
//     return undefined;
//   });
//   return compared;
// });

type BrickWrapperProps = ComponentProps<"div"> & {
  brick: Brick;
  isContainerChild?: boolean;
};

const BrickWrapper = forwardRef<HTMLDivElement, BrickWrapperProps>(
  ({ brick, style, children, isContainerChild }, ref) => {
    const hasMouseMoved = useRef(false);
    const selectedBrick = useSelectedBrick();
    const wrapperClass = useBrickWrapperStyle({
      brick,
      editable: true,
      isContainerChild,
      selected: selectedBrick?.id === brick.id,
    });

    console.log({ brick });

    const { setSelectedBrick } = useEditorHelpers();

    /*

    css`
      @keyframes spring {
        0% { transform: scale(1.05); }
        25% { transform: scale(0.95); }
        50% { transform: scale(1.02); }
        75% { transform: scale(0.98); }
        100% { transform: scale(1); }
      }
    `,

    // Animation
    "transform transition-transform duration-600 ease-spring scale-105 animate-spring",
    */

    const onBrickWrapperClick = (e: MouseEvent<HTMLElement>) => {
      const target = e.currentTarget as HTMLElement;
      if (hasMouseMoved.current || target.matches(".react-resizable-handle") || !target.matches(".brick")) {
        return;
      }
      setSelectedBrick(brick);
      hasMouseMoved.current = false;

      // stop propagation otherwise the click could then be handled by the container
      e.stopPropagation();
    };

    return (
      <div
        id={brick.id}
        // data-x="0"
        // data-y="0"
        // data-position={JSON.stringify(brick.position[previewMode])}
        style={style}
        className={wrapperClass}
        ref={ref}
        onClick={onBrickWrapperClick}
        onMouseDown={(e) => {
          hasMouseMoved.current = false;
        }}
        onMouseUp={(e) => {
          setTimeout(() => {
            hasMouseMoved.current = false;
          }, 100);
        }}
        onMouseMove={() => {
          hasMouseMoved.current = true;
        }}
      >
        <BaseBrick brick={brick} id={brick.id} editable />
        <BrickOptionsButton brick={brick} isContainerChild={isContainerChild} />
        {brick.isContainer && <ContainerLabel brick={brick} />}
        {children} {/* Make sure to include children to add resizable handle */}
      </div>
    );
  },
);

function ContainerLabel({ brick }: { brick: Brick }) {
  return (
    <div
      className={tx(
        `container-label capitalize absolute left-0
        bg-upstart-400 text-white py-1 px-2 text-xs font-medium
        opacity-0 group-hover/brick:!opacity-100 transition-opacity duration-100`,
        {
          "bottom-full rounded-t-md": brick.position.desktop.y > 0,
          "top-full rounded-b-md": brick.position.desktop.y === 0,
        },
      )}
    >
      {brick.type}
    </div>
  );
}

// const BrickWrapperMemo = memo(BrickWrapper);
// export default BrickWrapperMemo;

export default BrickWrapper;

function BrickOptionsButton({ brick, isContainerChild }: { brick: Brick; isContainerChild?: boolean }) {
  const [open, setOpen] = useState(false);
  const draft = useDraft();
  const editorHelpers = useEditorHelpers();
  return (
    <DropdownMenu.Root onOpenChange={setOpen}>
      <DropdownMenu.Trigger>
        {/* when the brick is a container child, the button should be on the left side
            so that it doesn't overlap with the container button */}
        <div className={tx("absolute top-1", isContainerChild ? "left-1.5" : "right-1.5 z-[99999]")}>
          <IconButton
            type="button"
            variant="ghost"
            size="1"
            radius="small"
            className={tx(
              {
                "!opacity-0": !open,
              },
              "nodrag transition-all duration-300 group/button group-hover/brick:!opacity-100 \
              active:!opacity-100 focus:!flex focus-within:!opacity-100 !border !border-upstart-500 !bg-upstart-500  \
              hover:!border-upstart-300 !p-0.5",
            )}
          >
            <BiDotsVerticalRounded className="w-5 h-5 text-white/80 group-hover/button:text-white" />
          </IconButton>
        </div>
      </DropdownMenu.Trigger>
      <Portal>
        {/* The "nodrag" class is here to prevent the grid manager
            from handling click event coming from the menu items.
            We still need to stop the propagation for other listeners. */}
        <DropdownMenu.Content className="nodrag">
          <DropdownMenu.Item
            shortcut="⌘D"
            onClick={(e) => {
              e.stopPropagation();
              draft.duplicateBrick(brick.id);
            }}
          >
            Duplicate
          </DropdownMenu.Item>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>Visible on</DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.CheckboxItem
                checked={!brick.position.mobile?.hidden}
                onClick={(e) => e.stopPropagation()}
                onCheckedChange={() => draft.toggleBrickVisibilityPerBreakpoint(brick.id, "mobile")}
              >
                Mobile
              </DropdownMenu.CheckboxItem>

              <DropdownMenu.CheckboxItem
                checked={!brick.position.desktop?.hidden}
                onClick={(e) => e.stopPropagation()}
                onCheckedChange={() => draft.toggleBrickVisibilityPerBreakpoint(brick.id, "desktop")}
              >
                Desktop
              </DropdownMenu.CheckboxItem>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Separator />
          <DropdownMenu.Item
            shortcut="⌫"
            color="red"
            onClick={(e) => {
              e.stopPropagation();
              draft.deleteBrick(brick.id);
              editorHelpers.deselectBrick(brick.id);
            }}
          >
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </Portal>
    </DropdownMenu.Root>
  );
}
