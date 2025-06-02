import { LuUndo, LuRedo } from "react-icons/lu";
import { RxMobile, RxDesktop, RxZoomIn, RxZoomOut } from "react-icons/rx";
import { VscCopy } from "react-icons/vsc";
import { type MouseEvent, type PropsWithChildren, useCallback, useMemo } from "react";
import { BsStars } from "react-icons/bs";
import { tx, css } from "@upstart.gg/style-system/twind";
import { IoIosHelpCircleOutline } from "react-icons/io";

import {
  useDraftUndoManager,
  useSitemap,
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
  useCredits,
  useGenerationState,
} from "~/editor/hooks/use-editor";
import { RxRocket } from "react-icons/rx";
import logo from "../../../../../creatives/upstart.svg";
import dark from "../../../../../creatives/upstart-dark.svg";
import { RiArrowDownSLine } from "react-icons/ri";
import {
  Button,
  DropdownMenu,
  HoverCard,
  Link,
  Popover,
  TextField,
  Tooltip,
} from "@upstart.gg/style-system/system";
import { IoIosSave } from "react-icons/io";
import { LuExternalLink } from "react-icons/lu";
import { formatDistance } from "date-fns";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

import { LuPlus } from "react-icons/lu";
import { PiPalette } from "react-icons/pi";
import { VscSettings } from "react-icons/vsc";

export default function NavBar() {
  const editorHelpers = useEditorHelpers();
  const previewMode = usePreviewMode();
  const logoLink = useLogoLink();
  const draft = useDraft();
  const editorMode = useEditorMode();
  const pageVersion = usePageVersion();
  const lastSaved = useLastSaved();
  const pages = useSitemap();
  const { panel } = usePanel();
  const { canZoomIn, canZoomOut, zoomIn, zoomOut, zoom, resetZoom } = useZoom();
  const credits = useCredits();
  const chatVisible = useChatVisible();
  const { undo, redo, futureStates, pastStates } = useDraftUndoManager();
  const canRedo = useMemo(() => futureStates.length > 0, [futureStates]);
  const canUndo = useMemo(() => pastStates.length > 0, [pastStates]);
  const currentPageLabel = pages.find((page) => page.id === draft.id)?.label;
  const generationState = useGenerationState();

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
  const baseCls = tx(`transition-opacity duration-300 px-3 min-w-[2.5rem]`);

  const commonCls = `${baseCls}
    hover:bg-upstart-100 dark:hover:bg-white/10
    disabled:text-gray-300
  `;

  const activeCls = `bg-upstart-100 dark:bg-upstart-700/80`;

  const rocketBtn = tx(
    `transition-opacity duration-300 !rounded-full !p-px
    bg-gradient-to-tr from-orange-400 to-yellow-300 border-l border-l-orange-300
  hover:opacity-80`,
  );

  const btnWithArrow = "cursor-default !aspect-auto";

  const btnClass = `flex items-center justify-center my-1 py-1 gap-x-0.5 px-1.5 group relative
  focus-visible:outline-none disabled:hover:cursor-default rounded-md
  disabled:hover:bg-transparent text-sm
  `;

  const squareBtn = "aspect-square";
  const arrowClass = "h-4 w-4 opacity-60 -ml-0.5";
  const separator = tx("h-[70%] w-px bg-black/10 mx-1.5");

  return (
    <nav
      role="navigation"
      className={tx(
        `z-[9999] h-14 gap-1 px-4 flex text-xl w-full items-center transition-opacity duration-300
        text-black/70 dark:text-dark-200 bg-white`,
        css({
          gridArea: "navbar",
        }),
      )}
    >
      <button
        type="button"
        onClick={() => {
          window.location.href = editorMode === "local" ? "/" : logoLink;
        }}
        className={tx("flex-shrink-0")}
      >
        <picture className={tx("h-8 w-auto")}>
          <source srcSet={dark} className={tx("h-8 w-auto")} media="(prefers-color-scheme: dark)" />
          <img src={logo} className={tx("h-8 w-auto")} alt="Upstart" />
        </picture>
      </button>

      <div className={tx("flex items-center gap-1 flex-1", !generationState.isReady && "hidden")}>
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
              <VscCopy className={tx("h-5 w-auto")} />
              <div className={tx("flex flex-col gap-1 ml-1.5 mr-2 justify-start items-start")}>
                <span className={tx("text-xs inline-block")}>Page</span>
                <span className={tx("text-sm inline-block -mt-[8px] font-semibold")}>{currentPageLabel}</span>
              </div>
              <RiArrowDownSLine className={tx(arrowClass)} />
            </button>
          </TopbarMenu>
        )}

        {/* spacer */}
        <div className={tx(baseCls, "max-lg:hidden flex-1")} />

        <Tooltip content="Toggle chat" side="bottom" align="center">
          <button
            onClick={() => editorHelpers.toggleChat()}
            type="button"
            className={tx(btnClass, squareBtn, commonCls, chatVisible && activeCls)}
          >
            <IoChatboxEllipsesOutline className={tx("h-5 w-auto")} />
          </button>
        </Tooltip>

        <Tooltip
          content={previewMode === "desktop" ? "Add bricks" : "Switch to desktop view to add bricks"}
          side="bottom"
          align="center"
        >
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
            <LuPlus className={tx("h-5 w-auto")} />
          </button>
        </Tooltip>

        <div className={separator} />

        <Tooltip content="Color theme & fonts" side="bottom" align="center">
          <button
            onClick={() => editorHelpers.togglePanel("theme")}
            type="button"
            className={tx(btnClass, squareBtn, commonCls, panel === "theme" && activeCls)}
          >
            <PiPalette className={tx("h-5 w-auto")} />
          </button>
        </Tooltip>

        <Tooltip content="Page / Site settings" side="bottom" align="center">
          <button
            onClick={() => editorHelpers.togglePanel("settings")}
            type="button"
            className={tx(btnClass, squareBtn, commonCls, panel === "settings" && activeCls)}
          >
            <VscSettings className={tx("h-5 w-auto")} />
          </button>
        </Tooltip>

        <div className={separator} />

        <Tooltip content="Redo" side="bottom" align="center" aria-disabled={!canUndo}>
          <button
            disabled={!canUndo}
            onClick={() => undo()}
            type="button"
            className={tx(btnClass, commonCls, squareBtn, "ml-auto")}
          >
            <LuUndo className={tx("h-5 w-auto")} />
          </button>
        </Tooltip>
        <Tooltip content="Redo" side="bottom" align="center" aria-disabled={!canRedo}>
          <button
            disabled={!canRedo}
            onClick={() => redo()}
            type="button"
            className={tx(btnClass, squareBtn, commonCls)}
          >
            <LuRedo className={tx("h-5 w-auto")} />
          </button>
        </Tooltip>

        <div className={separator} />

        <Tooltip
          content={`Switch to ${previewMode === "desktop" ? "mobile" : "desktop"} view`}
          side="bottom"
          align="center"
        >
          <button type="button" className={tx(btnClass, squareBtn, commonCls)} onClick={switchPreviewMode}>
            {previewMode === "desktop" && <RxDesktop className={tx("h-5 w-auto")} />}
            {previewMode === "mobile" && <RxMobile className={tx("h-5 w-auto")} />}
          </button>
        </Tooltip>

        <button
          onClick={zoomOut}
          disabled={!canZoomOut}
          type="button"
          className={tx(btnClass, squareBtn, commonCls)}
        >
          <RxZoomOut className={tx("h-5 w-auto")} />
        </button>
        <button
          onClick={zoomIn}
          disabled={!canZoomIn}
          type="button"
          className={tx(btnClass, squareBtn, commonCls)}
        >
          <RxZoomIn className={tx("h-5 w-auto")} />
        </button>

        <Tooltip content="Click to reset zoom" side="bottom" align="center">
          <button
            type="button"
            onClick={resetZoom}
            className={tx(
              "text-gray-500 dark:text-dark-200 text-[.85rem] mx-1 cursor-pointer hover:text-upstart-800",
            )}
          >
            {(zoom * 100).toFixed(0)}%
          </button>
        </Tooltip>

        <div className={separator} />

        <div className={tx("flex flex-col gap-1.5 leading-none text-sm items-start px-1.5")}>
          <span
            className={tx("inline-flex items-center gap-1", credits === 0 && "text-red-800 font-semibold")}
          >
            <BsStars className={tx("opacity-60 w-4 h-4")} /> {credits} credits
          </span>
          <div className={tx("inline-flex gap-1 items-center")}>
            <HoverCard.Root>
              <HoverCard.Trigger>
                <button
                  type="button"
                  className={tx(
                    "hover:underline cursor-help tracking-tight underline-offset-2 text-[88%] text-upstart-700 hover:text-upstart-700",
                  )}
                >
                  What's this?
                </button>
              </HoverCard.Trigger>
              <HoverCard.Content maxWidth="380px">
                <div className="text-sm flex flex-col gap-2 justify-start items-start">
                  <p>Credits are spent when you generate content with AI.</p>
                  <ul className="list-disc list-inside">
                    <li className="pl-1">On the free plan, usage is limited by day & month</li>
                    <li className="pl-1">On paid plans, usage is only limited by month</li>
                  </ul>
                  <p>
                    If you ever run out of credits, you can either{" "}
                    <button
                      type="button"
                      className={tx("text-upstart-700 cursor-pointer font-medium hover:underline")}
                      onClick={() => {
                        alert("TODO upgrade");
                      }}
                    >
                      upgrade your plan
                    </button>{" "}
                    or{" "}
                    <button
                      type="button"
                      className={tx("text-upstart-700 cursor-pointer font-medium hover:underline")}
                      onClick={() => {
                        alert("TODO buy more");
                      }}
                    >
                      buy more
                    </button>{" "}
                    credits .
                  </p>
                </div>
              </HoverCard.Content>
            </HoverCard.Root>
            <span>&bull;</span>
            <button
              type="button"
              className={tx(
                "hover:underline tracking-tight underline-offset-2 text-[88%] text-upstart-700 hover:text-orange-800",
              )}
              onClick={() => alert("buy")}
            >
              Buy more
            </button>
          </div>
        </div>

        <div className={separator} />

        <button type="button" className={tx(btnClass, commonCls, squareBtn)}>
          <IoIosHelpCircleOutline className="h-5 w-auto" />
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
            <button type="button" className={tx(btnClass, rocketBtn, btnWithArrow)}>
              <div>
                <RxRocket className={tx("h-5 w-auto")} />
              </div>
              <span className={tx("font-bold italic px-2", css({ fontSize: "1rem" }))}>Publish</span>
              <RiArrowDownSLine className={arrowClass} />
            </button>
          </TopbarMenu>
        ) : (
          <button
            id="publish-menu-btn"
            type="button"
            className={tx(btnClass, rocketBtn)}
            onClick={() => {
              editorHelpers.onShowLogin();
            }}
          >
            <div
              style={{
                textShadow: "1px 1px 0px rgba(255, 255, 255, 0.3)",
              }}
              className={tx(
                "font-semibold inline-flex gap-1 bg-orange-100 py-2 px-3 rounded-full",
                css({ fontSize: ".94rem" }),
              )}
            >
              <IoIosSave className={tx("h-5 w-auto")} />
              Save your site
            </div>
          </button>
        )}
      </div>
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
