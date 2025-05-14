import { LuUndo, LuRedo } from "react-icons/lu";
import { RxMobile, RxDesktop, RxZoomIn, RxZoomOut } from "react-icons/rx";
import { VscCopy } from "react-icons/vsc";
import { type MouseEvent, type PropsWithChildren, useCallback, useMemo } from "react";
import { BsStars } from "react-icons/bs";
import { tx, css } from "@upstart.gg/style-system/twind";
import { IoIosHelpCircleOutline } from "react-icons/io";

import {
  useDraftUndoManager,
  usePagesMap,
  useEditorMode,
  usePageVersion,
  useLastSaved,
  useDraft,
  useEditorHelpers,
  usePreviewMode,
  useLogoLink,
  usePanel,
  useChatVisible,
  useZoom,
} from "~/editor/hooks/use-editor";
import { RxRocket } from "react-icons/rx";
import logo from "../../../../../creatives/upstart.svg";
import dark from "../../../../../creatives/upstart-dark.svg";
import { RiArrowDownSLine } from "react-icons/ri";
import { DropdownMenu, Link, Popover, TextField } from "@upstart.gg/style-system/system";
import { IoIosSave } from "react-icons/io";
import { LuExternalLink } from "react-icons/lu";
import { formatDistance } from "date-fns";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

import { LuPlus } from "react-icons/lu";
import { PiPalette } from "react-icons/pi";
import { VscSettings } from "react-icons/vsc";

type TopBarProps = {
  showIntro: boolean;
};

export default function NavBar({ showIntro }: TopBarProps) {
  const editorHelpers = useEditorHelpers();
  const previewMode = usePreviewMode();
  const logoLink = useLogoLink();
  const draft = useDraft();
  const editorMode = useEditorMode();
  const pageVersion = usePageVersion();
  const lastSaved = useLastSaved();
  const pages = usePagesMap();
  const { panel } = usePanel();
  const { canZoomIn, canZoomOut, zoomIn, zoomOut, zoom } = useZoom();
  const chatVisible = useChatVisible();
  const { undo, redo, futureStates, pastStates } = useDraftUndoManager();
  const canRedo = useMemo(() => futureStates.length > 0, [futureStates]);
  const canUndo = useMemo(() => pastStates.length > 0, [pastStates]);
  const currentPageLabel = pages.find((page) => page.id === draft.id)?.label;

  const publish = useCallback(
    (wholeSite = false) => {
      if (wholeSite) {
        editorHelpers.onPublish({ mode: "publish-site", siteId: draft.siteId });
      } else {
        editorHelpers.onPublish({
          mode: "publish-page",
          pageId: draft.id,
          siteId: draft.siteId,
          pageVersionId: pageVersion ?? "latest",
        });
      }
    },
    [draft.siteId, draft.id, pageVersion, editorHelpers.onPublish],
  );

  const duplicatePage = () => {
    if (editorMode === "local") {
      return editorHelpers.onShowLogin();
    }
    const data = draft.getPageDataForDuplication();
    console.log("duplicatePage", data);
    // todo...
  };

  const createPage = () => {
    if (editorMode === "local") {
      return editorHelpers.onShowLogin();
    }
    // todo...
  };

  const switchPreviewMode = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      editorHelpers.setPreviewMode(previewMode === "mobile" ? "desktop" : "mobile");
    },
    [previewMode, editorHelpers.setPreviewMode],
  );

  // bg-upstart-600
  const baseCls = tx(`transition-opacity duration-300 px-3 min-w-[2.5rem]`, showIntro && "opacity-0");

  const commonCls = `${baseCls}
    hover:bg-upstart-100 dark:hover:bg-white/10
    disabled:text-gray-300
  `;

  const activeCls = `bg-upstart-100 dark:bg-upstart-700/80`;

  const rocketBtn = tx(
    `transition-opacity duration-300
    px-3 bg-gradient-to-tr from-orange-400 to-yellow-400 border-l border-l-orange-300
  hover:opacity-80 rounded-lg`,
    showIntro && "opacity-0",
  );

  const btnWithArrow = "cursor-default !aspect-auto";

  const btnClass = `flex items-center justify-center my-1 py-1 gap-x-0.5 px-1.5 group relative
  focus-visible:outline-none disabled:hover:cursor-default rounded-md
  disabled:pointer-events-none text-sm
  `;

  const squareBtn = "aspect-square";

  const tooltipCls = `absolute py-0.5 px-2.5 bg-upstart-600/92 top-[calc(100%+.3rem)]
    rounded-full text-sm text-white min-w-full transition-all delay-75 duration-200 ease-in-out opacity-0 -translate-y-1
  group-hover:block group-hover:opacity-100 group-hover:translate-y-0 text-nowrap whitespace-nowrap pointer-events-none`;

  const arrowClass = "h-4 w-4 opacity-60 -ml-0.5";

  const separator = "h-[70%] w-px bg-black/10 mx-3";

  return (
    <nav
      role="navigation"
      className={tx(
        ` z-[9999] h-14 gap-1
          flex text-xl w-full justify-start items-center transition-opacity duration-300 px-4 pt-2 text-black/70
          dark:text-dark-200
          `,
        css({
          gridArea: "navbar",
        }),
      )}
    >
      <button
        type="button"
        disabled={editorMode === "local"}
        onClick={() => {
          window.location.href = logoLink;
        }}
        className={tx("flex-shrink-0")}
      >
        <picture className={tx("h-8 w-auto")}>
          <source srcSet={dark} className={tx("h-8 w-auto")} media="(prefers-color-scheme: dark)" />
          <img src={logo} className={tx("h-8 w-auto")} alt="Upstart" />
        </picture>
      </button>

      {(editorMode === "remote" || (editorMode === "local" && pages.length > 1)) && (
        <TopbarMenu
          id="switch-page-menu-btn"
          items={[
            { label: "New page", onClick: createPage },
            { label: "Duplicate page", onClick: duplicatePage },
            { type: "separator" as const },

            ...(pages.length > 1 ? [{ type: "label", label: "Switch to page" } as const] : []),
            ...(pages.length > 1
              ? pages.map((page) => ({
                  label: page.label,
                  type: "checkbox" as const,
                  checked: draft.id === page.id || draft.path === page.path,
                  onClick: () => {
                    if (editorMode === "remote") {
                      window.location.href = `/editor/sites/${draft.siteId}/edit?p=${page.id}&r=${Date.now()}`;
                    } else {
                      const currentURL = new URL(window.location.href);
                      currentURL.searchParams.set("p", page.id);
                      currentURL.searchParams.set("r", `${Date.now()}`);
                      window.location.href = currentURL.href;
                    }
                  },
                }))
              : []),
          ]}
        >
          <button type="button" className={tx(btnClass, commonCls, btnWithArrow, "!px-1.5 ml-4")}>
            <VscCopy className="h-6 w-auto" />
            <div className="flex flex-col gap-1 ml-1.5 mr-2 justify-start items-start">
              <span className="text-xs inline-block">Page</span>
              <span className="text-sm inline-block -mt-[8px] font-semibold">{currentPageLabel}</span>
            </div>
            <RiArrowDownSLine className={tx(arrowClass)} />
          </button>
        </TopbarMenu>
      )}

      {/* spacer */}
      <div className={tx(baseCls, "max-lg:hidden flex-1")} />

      <button
        onClick={() => editorHelpers.toggleChat()}
        type="button"
        className={tx(btnClass, squareBtn, commonCls, chatVisible && activeCls)}
      >
        <IoChatboxEllipsesOutline className={tx("h-6 w-auto")} />
        <span className={tx(tooltipCls)}>Toggle chat</span>
      </button>

      <button
        onClick={() => editorHelpers.togglePanel("library")}
        type="button"
        disabled={previewMode === "mobile"}
        className={tx(
          btnClass,
          squareBtn,
          commonCls,
          panel === "library" && previewMode === "desktop" && activeCls,
        )}
      >
        <LuPlus className="h-6 w-auto" />
        <span className={tx(tooltipCls)}>Add elements</span>
      </button>

      <div className={separator} />
      <button
        onClick={() => editorHelpers.togglePanel("theme")}
        type="button"
        className={tx(btnClass, squareBtn, commonCls, panel === "theme" && activeCls)}
      >
        <PiPalette className="h-6 w-auto" />
        <span className={tx(tooltipCls)}>Color theme</span>
      </button>

      <button
        onClick={() => editorHelpers.togglePanel("settings")}
        type="button"
        className={tx(btnClass, squareBtn, commonCls, panel === "settings" && activeCls)}
      >
        <VscSettings className="h-6 w-auto" />
        <span className={tx(tooltipCls)}>Page / Site settings</span>
      </button>

      <div className={separator} />

      <button
        disabled={!canUndo}
        onClick={() => undo()}
        type="button"
        className={tx(btnClass, commonCls, squareBtn, "ml-auto")}
      >
        <LuUndo className="h-5 w-auto" />
        <span className={tx(tooltipCls)}>Undo</span>
      </button>
      <button
        disabled={!canRedo}
        onClick={() => redo()}
        type="button"
        className={tx(btnClass, squareBtn, commonCls)}
      >
        <LuRedo className="h-5 w-auto" />
        <span className={tx(tooltipCls)}>Redo</span>
      </button>

      <div className={separator} />

      <button type="button" className={tx(btnClass, squareBtn, commonCls)} onClick={switchPreviewMode}>
        {previewMode === "desktop" && <RxDesktop className="h-5 w-auto" />}
        {previewMode === "mobile" && <RxMobile className="h-5 w-auto" />}
        <span className={tx(tooltipCls)}>Switch View</span>
      </button>

      <button
        onClick={zoomOut}
        disabled={!canZoomOut}
        type="button"
        className={tx(btnClass, squareBtn, commonCls)}
      >
        <RxZoomOut className="h-5 w-auto" />
        <span className={tx(tooltipCls)}>Zoom Out</span>
      </button>
      <button
        onClick={zoomIn}
        disabled={!canZoomIn}
        type="button"
        className={tx(btnClass, squareBtn, commonCls)}
      >
        <RxZoomIn className="h-5 w-auto" />
        <span className={tx(tooltipCls)}>Zomm In</span>
      </button>

      <span className={tx("text-gray-500 dark:text-dark-200 text-[.85rem] ml-1")}>
        {(zoom * 100).toFixed(0)}%
      </span>

      <div className={separator} />

      <div className="inline-flex flex-col gap-1 leading-none text-sm items-start">
        <span className="inline-flex items-center gap-1">
          <BsStars className="opacity-60 w-4 h-4" /> 3500 credits
        </span>
        <div className="inline-flex gap-1 items-center">
          <button
            type="button"
            className="hover:underline tracking-tight underline-offset-2 -mt-1.5 text-[88%] text-upstart-600 hover:text-upstart-700"
            onClick={() => alert("buy")}
          >
            What's this?
          </button>
          <span className="-mt-1.5 ">&bull;</span>
          <button
            type="button"
            className="hover:underline tracking-tight underline-offset-2 -mt-1.5 text-[88%] text-upstart-600 hover:text-orange-800"
            onClick={() => alert("buy")}
          >
            Buy more
          </button>
        </div>
      </div>

      <div className={separator} />

      <button type="button" className={tx(btnClass, commonCls, squareBtn)}>
        <IoIosHelpCircleOutline className="h-5 w-auto" />
        <span className={tx(tooltipCls)}>Help</span>
      </button>

      <div className={tx("flex-1", "border-x border-l-upstart-400 border-r-upstart-700", baseCls)} />

      {editorMode === "remote" && (
        <button
          type="button"
          className={tx(btnClass, commonCls, "text-base px-5")}
          onClick={() => {
            window.open(`/sites/${draft.siteId}/pages/${draft.id}/preview`, "upstart_preview");
          }}
        >
          Preview
          <LuExternalLink className="h-4 w-auto ml-1" />
          <span className={tx(tooltipCls)}>Open page preview</span>
        </button>
      )}

      {editorMode === "remote" && (
        <div className={tx(btnClass, baseCls, "px-8")}>
          {lastSaved ? (
            <div className={tx("text-sm text-black/50")}>
              Saved {formatDistance(lastSaved, new Date(), { addSuffix: true })}
              Saved {formatDistance(lastSaved, new Date(), { addSuffix: true })}
            </div>
          ) : (
            <div className={tx("text-sm")}>Not saved yet</div>
          )}
        </div>
      )}

      {editorMode === "remote" ? (
        <TopbarMenu
          id="publish-menu-btn"
          items={[
            { label: "Publish this page", onClick: () => publish() },
            { label: "Publish all pages", onClick: () => publish(true) },
            { label: "Schedule publish" },
            { label: "Publish all pages", onClick: () => publish(true) },
            { label: "Schedule publish" },
          ]}
        >
          <button type="button" className={tx(btnClass, rocketBtn, btnWithArrow, "px-4")}>
            <RxRocket className={tx("h-5 w-auto")} />
            <span className={tx("font-bold italic px-2", css({ fontSize: "1rem" }))}>Publish</span>
            <RiArrowDownSLine className={arrowClass} />
          </button>
        </TopbarMenu>
      ) : (
        <button
          id="publish-menu-btn"
          type="button"
          className={tx("px-3.5 py-2 text-black", btnClass, rocketBtn)}
          onClick={() => {
            editorHelpers.onShowLogin();
          }}
        >
          <IoIosSave className={tx("h-5 w-auto")} />
          <span
            style={{
              textShadow: "1px 1px 0px rgba(255, 255, 255, 0.3)",
            }}
            className={tx("font-semibold pl-1 ", css({ fontSize: ".94rem" }))}
          >
            Save your site
          </span>
        </button>
      )}
    </nav>
  );
}

type TopbarMenuItem = {
  label: string;
  shortcut?: string;
  onClick?: (e: MouseEvent) => void;
  type?: never;
};

type TopbarMenuCheckbox = {
  label: string;
  checked: boolean;
  shortcut?: string;
  onClick?: (e: MouseEvent) => void;
  type: "checkbox";
};

type TopbarMenuSeparator = {
  type: "separator";
};
type TopbarMenuLabel = {
  type: "label";
  label: string;
};

type TopbarMenuItems = (TopbarMenuItem | TopbarMenuSeparator | TopbarMenuLabel | TopbarMenuCheckbox)[];

/**
 */
function TopbarMenu(props: PropsWithChildren<{ items: TopbarMenuItems; id?: string }>) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="focus:outline-none" id={props.id}>
        {props.children}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="bottom">
        {props.items.map((item, index) =>
          item.type === "separator" ? (
            <div key={index} className="my-1.5 h-px bg-black/10" />
          ) : item.type === "label" ? (
            <DropdownMenu.Label key={item.label}>{item.label}</DropdownMenu.Label>
          ) : item.type === "checkbox" ? (
            <DropdownMenu.CheckboxItem key={item.label} checked={item.checked}>
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
            </DropdownMenu.CheckboxItem>
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
