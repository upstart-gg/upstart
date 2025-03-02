import { LuPlus, LuPanelLeft, LuPanelRight } from "react-icons/lu";
import { PiPalette } from "react-icons/pi";
import { VscSettings, VscDatabase } from "react-icons/vsc";
import type { MouseEvent, PropsWithChildren } from "react";
import { useEditorHelpers, usePanel, usePreviewMode } from "../hooks/use-editor";
import { tx, css } from "@upstart.gg/style-system/twind";
import { DropdownMenu } from "@upstart.gg/style-system/system";

type ToolbarProps = {
  showIntro: boolean;
};

export default function Toolbar({ showIntro }: ToolbarProps) {
  const previewMode = usePreviewMode();
  const editorHelpers = useEditorHelpers();
  const { panel, panelPosition } = usePanel();

  const baseCls = `bg-gradient-to-r from-transparent
  to-[rgba(255,255,255,0.15)] dark:to-dark-800
  border-y border-t-gray-200 border-b-gray-300
  dark:(border-t-dark-600 border-b-dark-700)`;

  const commonCls = `${baseCls}
    w-full
    hover:from-transparent hover:to-[rgba(255,255,255,0.45)] dark:hover:to-dark-700
    active:(from-transparent hover:to-[rgba(0,0,0,0.07)])
    disabled:text-gray-400/80 disabled:hover:from-transparent disabled:hover:to-transparent
  `;

  const btnClass = tx(
    `flex border-transparent items-center justify-center py-3 gap-x-0.5 aspect-square
    group relative disabled:hover:cursor-default focus-visible:outline-none`,
    {
      "border-l-[3px]": panelPosition === "left",
      "border-r-[3px]": panelPosition === "right",
    },
    panelPosition === "left" &&
      css`&:is(.active) {
      border-left-color: var(--violet-8);
    }`,
    panelPosition === "right" &&
      css`&:is(.active) {
      border-right-color: var(--violet-8);
    }`,
  );

  const tooltipCls = tx(
    `absolute py-0.5 px-2.5 bg-upstart-600/90 group-hover:translate-x-0
    rounded-full text-sm text-white min-w-full transition-all delay-75 duration-200 ease-in-out opacity-0
    group-hover:block group-hover:opacity-100  text-nowrap whitespace-nowrap pointer-events-none`,

    panelPosition === "left" && "left-[calc(100%+.5rem)] -translate-x-1.5",
    panelPosition === "right" && "right-[calc(100%+.5rem)] translate-x-1.5",
  );

  return (
    <nav
      role="toolbar"
      className={tx(
        `bg-gray-200 dark:bg-dark-800 z-[9999] transition-opacity duration-300
          flex flex-col w-[3.7rem] text-xl text-gray-600 dark:text-gray-300
          border-r border-gray-300 dark:border-dark-700`,
        {
          "shadow-[0px_0px_10px_0px_rgba(0,0,0,0.08)]": !panel,
        },
        css({
          gridArea: "toolbar",
        }),
        showIntro && "opacity-0",
      )}
    >
      <div className={tx("flex-1", baseCls)} />
      <button
        type="button"
        disabled={previewMode === "mobile"}
        onClick={() => editorHelpers.togglePanel("library")}
        className={tx(btnClass, commonCls, panel === "library" && "active")}
      >
        <LuPlus className="h-7 w-auto" />
        {previewMode === "desktop" && <span className={tooltipCls}>Add elements</span>}
        {previewMode === "mobile" && (
          <span className={tx(tooltipCls, "!bg-gray-400/90")}>Disabled in mobile view</span>
        )}
      </button>
      <button
        type="button"
        className={tx(btnClass, commonCls, panel === "settings" && "active")}
        onClick={(e) => {
          editorHelpers.togglePanel("settings");
        }}
      >
        <VscSettings className="h-7 w-auto" />
        <span className={tx(tooltipCls)}>Page & site settings</span>
      </button>
      <button
        type="button"
        className={tx(btnClass, commonCls, panel === "theme" && "active")}
        onClick={(e) => {
          editorHelpers.togglePanel("theme");
        }}
      >
        <PiPalette className="h-7 w-auto" />
        <span className={tx(tooltipCls)}>Color theme</span>
      </button>
      {/* <button
        type="button"
        className={tx(btnClass, commonCls, panel === "data" && "active")}
        onClick={(e) => {
          editorHelpers.togglePanel("data");
        }}
      >
        <VscDatabase className="h-7 w-auto" />
        <span className={tx(tooltipCls)}>Data</span>
      </button> */}
      <div className={tx("flex-1", "border-t-gray-200 dark:border-t-dark-500")} />
      <button
        type="button"
        className={tx(btnClass, commonCls)}
        onClick={(e) => {
          editorHelpers.togglePanelPosition();
        }}
      >
        {panelPosition === "left" ? (
          <LuPanelLeft className="h-7 w-auto" />
        ) : (
          <LuPanelRight className="h-7 w-auto" />
        )}
        <span className={tx(tooltipCls)}>
          {panelPosition === "left" ? "Move toolbar to right" : "Move toolbar to left"}
        </span>
      </button>
    </nav>
  );
}

type ToolbarMenuItem = {
  label: string;
  shortcut?: string;
  onClick?: (e: MouseEvent) => void;
  type?: never;
};

type ToolbarMenuSeparator = {
  type: "separator";
};

type ToolbarMenuItems = (ToolbarMenuItem | ToolbarMenuSeparator)[];

/**
 */
function ToolbarMenu(props: PropsWithChildren<{ items: ToolbarMenuItems }>) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="focus:outline-none">{props.children}</DropdownMenu.Trigger>
      <DropdownMenu.Content side="left">
        {props.items.map((item, index) =>
          item.type === "separator" ? (
            <div key={index} className="my-1.5 h-px bg-black/10" />
          ) : (
            <DropdownMenu.Item key={item.label}>
              <button
                onClick={item.onClick}
                type="button"
                className="group flex justify-start items-center text-nowrap rounded-[inherit]
                py-1.5 w-fulldark:text-white/90 text-left data-[focus]:bg-upstart-600 data-[focus]:text-white "
              >
                <span className="pr-3">{item.label}</span>
                {item.shortcut && (
                  <kbd
                    className="ml-auto font-sans text-right text-[smaller] text-black/50 dark:text-dark-300
                    group-hover:text-white/90
                      group-data-[focus]:text-white/70 group-data-[active]:text-white/70"
                  >
                    {item.shortcut}
                  </kbd>
                )}
              </button>
            </DropdownMenu.Item>
          ),
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
