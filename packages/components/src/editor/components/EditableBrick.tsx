import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import {
  forwardRef,
  memo,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from "react";
import { tx } from "@upstart.gg/style-system/twind";
import {
  useDraft,
  useDraftHelpers,
  useEditorHelpers,
  usePreviewMode,
  useSelectedBrick,
} from "../hooks/use-editor";
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
  index: number;
};

const BrickWrapper = forwardRef<HTMLDivElement, BrickWrapperProps>(
  ({ brick, style, children, isContainerChild, index }, ref) => {
    const hasMouseMoved = useRef(false);
    const selectedBrick = useSelectedBrick();
    const wrapperClass = useBrickWrapperStyle({
      props: brick.props,
      mobileProps: brick.mobileProps,
      position: brick.position,
      editable: true,
      isContainerChild,
      selected: selectedBrick?.id === brick.id,
    });

    const { setSelectedBrick } = useDraftHelpers();
    const { setPanel } = useEditorHelpers();

    const onBrickWrapperClick = (e: MouseEvent<HTMLElement>) => {
      const target = e.currentTarget as HTMLElement;
      if (hasMouseMoved.current || target.matches(".react-resizable-handle") || !target.matches(".brick")) {
        // if (target.matches(".react-resizable-handle") || !target.matches(".brick")) {
        console.warn("click ignored", target);
        return;
      }
      setSelectedBrick(brick);
      setPanel("inspector");
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
        className={tx(wrapperClass, `![animation-delay:${0.5 * (index + 1)}s]`)}
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
        onMouseMove={(e) => {
          hasMouseMoved.current = true;
        }}
      >
        <BaseBrick brick={brick} id={brick.id} editable />
        {brick.isContainer ? (
          <ContainerLabel brick={brick} />
        ) : (
          <BrickOptionsButton brick={brick} isContainerChild={isContainerChild} />
        )}
        {children} {/* Make sure to include children to add resizable handle */}
      </div>
    );
  },
);

function ContainerLabel({ brick }: { brick: Brick }) {
  const draftHelpers = useDraftHelpers();
  const editorHelpers = useEditorHelpers();
  return (
    <div
      className={tx(
        `container-label bottom-0 rounded-t-md capitalize absolute left-1.5 cursor-pointer flex gap-2 items-center
        bg-upstart-500 text-white py-1 px-2 text-xs font-medium
        opacity-0 group-hover/brick:!opacity-100 transition-opacity duration-100`,
      )}
    >
      <span
        className="flex-1"
        onClick={(e) => {
          e.stopPropagation();
          draftHelpers.setSelectedBrick(brick);
          editorHelpers.setPanel("inspector");
        }}
      >
        {brick.type}
      </span>
      <BrickOptionsButton brick={brick} containerButton />
    </div>
  );
}

// const BrickWrapperMemo = memo(BrickWrapper);
// export default BrickWrapperMemo;

export default BrickWrapper;

function BrickOptionsButton({
  brick,
  isContainerChild,
  containerButton,
}: { brick: Brick; isContainerChild?: boolean; containerButton?: boolean }) {
  const [open, setOpen] = useState(false);
  const draft = useDraft();
  const draftHelpers = useDraftHelpers();
  const editorHelpers = useEditorHelpers();
  return (
    <DropdownMenu.Root onOpenChange={setOpen}>
      <DropdownMenu.Trigger onClick={(e) => e.stopPropagation()}>
        {/* when the brick is a container child, the button should be on the left side
            so that it doesn't overlap with the container button */}
        <div
          className={tx({
            "absolute top-1 right-1.5": !containerButton,
            "!opacity-0 group-hover/brick:!opacity-100": containerButton,
            "!opacity-100": containerButton && open,
          })}
        >
          <IconButton
            type="button"
            variant="ghost"
            size="1"
            radius="small"
            className={tx(
              {
                "!opacity-0": !open,
                "!border !border-upstart-500 !bg-upstart-500 hover:!border-upstart-300 !p-0.5":
                  !containerButton,
              },
              "nodrag transition-all duration-300 group/button group-hover/brick:!opacity-100 \
              active:!opacity-100 focus:!flex focus-within:!opacity-100 ",
            )}
          >
            <BiDotsVerticalRounded
              className={tx(" text-white/80 group-hover/button:text-white", {
                "w-5 h-5": !containerButton,
                "w-4 h-4": containerButton,
              })}
            />
          </IconButton>
        </div>
      </DropdownMenu.Trigger>
      <Portal>
        {/* The "nodrag" class is here to prevent the grid manager
            from handling click event coming from the menu items.
            We still need to stop the propagation for other listeners. */}
        <DropdownMenu.Content className="nodrag" size="1">
          <DropdownMenu.Item
            shortcut="⌘D"
            onClick={(e) => {
              e.stopPropagation();
              draft.duplicateBrick(brick.id);
            }}
          >
            Duplicate
          </DropdownMenu.Item>
          <DropdownMenu.Item
            shortcut="⌘D"
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard.writeText(JSON.stringify(brick));
            }}
          >
            Copy
          </DropdownMenu.Item>
          {isContainerChild && (
            <>
              <DropdownMenu.Item
                shortcut="⌘&larr;"
                onClick={(e) => {
                  e.stopPropagation();
                  draft.moveBrick(brick.id, "left");
                }}
              >
                Move left
              </DropdownMenu.Item>
              <DropdownMenu.Item
                shortcut="⌘&rarr;"
                onClick={(e) => {
                  e.stopPropagation();
                  draft.moveBrick(brick.id, "right");
                }}
              >
                Move right
              </DropdownMenu.Item>
            </>
          )}
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
              draftHelpers.deselectBrick(brick.id);
              editorHelpers.hidePanel("inspector");
            }}
          >
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </Portal>
    </DropdownMenu.Root>
  );
}
