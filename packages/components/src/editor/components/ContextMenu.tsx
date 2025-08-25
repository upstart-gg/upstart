import { useEffect, useMemo, useState, type ComponentProps } from "react";
import { ContextMenu, Portal } from "@upstart.gg/style-system/system";
import { LuChevronRight } from "react-icons/lu";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { useDraft } from "../hooks/use-page-data";

const ContextMenuWrapper = ({ children }: ComponentProps<"div">) => {
  const draft = useDraft();
  const [bookmarksChecked, setBookmarksChecked] = useState(true);
  const [urlsChecked, setUrlsChecked] = useState(false);
  const [person, setPerson] = useState("pedro");
  const [relatedBrick, setRelatedBrick] = useState<Brick | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement | null;
      const isBrick = target?.matches("[data-element-kind='brick']");
      const isBrickChild = target?.closest("[data-element-kind='brick']");
      const brickElement = (isBrick ? target : (isBrickChild ?? null)) as HTMLElement | null;

      if (brickElement) {
        const brickId = brickElement.getAttribute("id");
        if (brickId) {
          setRelatedBrick(draft.getBrick(brickId) ?? null);
        }
      }
    };
    window.addEventListener("contextmenu", handler);
    return () => {
      window.removeEventListener("contextmenu", handler);
    };
  }, [draft]);

  const menuItems = useMemo(() => {
    const groups = [];

    if (relatedBrick) {
      groups.push({
        title: "Brick",
        items: [
          {
            title: "Edit",
            shortcut: "⌘+E",
            action: () => {
              console.log("Edit", relatedBrick);
            },
          },
          {
            title: "Delete",
            shortcut: "⌘+⌫",
            action: () => {
              console.log("Delete", relatedBrick);
            },
          },
        ],
      });
    }

    return groups;
  }, [relatedBrick]);

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <Portal>
        <ContextMenu.Content
          className="min-w-[220px] overflow-hidden rounded-md bg-white p-1.5 shadow-2xl"
          // sideOffset={5}
          alignOffset={5}
          // align="end"
        >
          <ContextMenu.Item className="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-sm leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-upstart-200 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
            Back{" "}
            <div className="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
              ⌘+[
            </div>
          </ContextMenu.Item>
          <ContextMenu.Item
            className="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-sm leading-none text-upstart-900 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-upstart-200 data-[disabled]:text-gray-300 data-[highlighted]:text-violet1"
            disabled
          >
            Forward{" "}
            <div className="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
              ⌘+]
            </div>
          </ContextMenu.Item>
          <ContextMenu.Item className="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-sm leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-upstart-200 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
            Reload{" "}
            <div className="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
              ⌘+R
            </div>
          </ContextMenu.Item>
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger className="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-sm leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-upstart-200 data-[highlighted]:data-[state=open]:bg-upstart-200 data-[state=open]:bg-violet4 data-[disabled]:text-mauve8 data-[highlighted]:data-[state=open]:text-violet1 data-[highlighted]:text-violet1 data-[state=open]:text-violet11">
              More Tools
              <div className="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
                <LuChevronRight />
              </div>
            </ContextMenu.SubTrigger>
            <Portal>
              <ContextMenu.SubContent
                className="min-w-[220px] overflow-hidden rounded-md bg-white p-1.5 shadow-2xl"
                sideOffset={2}
                alignOffset={-5}
              >
                <ContextMenu.Item className="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-sm leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-upstart-200 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
                  Save Page As…{" "}
                  <div className="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
                    ⌘+S
                  </div>
                </ContextMenu.Item>
                <ContextMenu.Item className="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-sm leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-upstart-200 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
                  Create Shortcut…
                </ContextMenu.Item>
                <ContextMenu.Item className="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-sm leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-upstart-200 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
                  Name Window…
                </ContextMenu.Item>
                <ContextMenu.Separator className="m-[5px] h-px bg-gray-200" />
                <ContextMenu.Item className="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-sm leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-upstart-200 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1">
                  Developer Tools
                </ContextMenu.Item>
              </ContextMenu.SubContent>
            </Portal>
          </ContextMenu.Sub>

          <ContextMenu.Separator className="m-[5px] h-px bg-gray-200" />

          <ContextMenu.CheckboxItem
            className="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-sm leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-upstart-200 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1"
            checked={bookmarksChecked}
            onCheckedChange={setBookmarksChecked}
          >
            Show Bookmarks{" "}
            <div className="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
              ⌘+B
            </div>
          </ContextMenu.CheckboxItem>
          <ContextMenu.CheckboxItem
            className="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-sm leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-upstart-200 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1"
            checked={urlsChecked}
            onCheckedChange={setUrlsChecked}
          >
            Show Full URLs
          </ContextMenu.CheckboxItem>

          <ContextMenu.Separator className="m-[5px] h-px bg-gray-200" />

          <ContextMenu.Label className="pl-[25px] text-xs leading-[25px] text-mauve11">
            People
          </ContextMenu.Label>
          <ContextMenu.RadioGroup value={person} onValueChange={setPerson}>
            <ContextMenu.RadioItem
              className="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-sm leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-upstart-200 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1"
              value="pedro"
            >
              Pedro Duarte
            </ContextMenu.RadioItem>
            <ContextMenu.RadioItem
              className="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-sm leading-none text-violet11 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-upstart-200 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1"
              value="colm"
            >
              Colm Tuite
            </ContextMenu.RadioItem>
          </ContextMenu.RadioGroup>
        </ContextMenu.Content>
      </Portal>
    </ContextMenu.Root>
  );
};

export default ContextMenuWrapper;
