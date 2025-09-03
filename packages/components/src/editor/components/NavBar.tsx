import { css, tx } from "@upstart.gg/style-system/twind";
import { type MouseEvent, type PropsWithChildren, useCallback, useMemo } from "react";
import { BsStars } from "react-icons/bs";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { LuRedo, LuUndo } from "react-icons/lu";
import { RxDesktop, RxMobile, RxZoomIn, RxZoomOut } from "react-icons/rx";
import { VscCopy } from "react-icons/vsc";
import { RxExternalLink } from "react-icons/rx";
import { BsDatabaseDown } from "react-icons/bs";
import { DropdownMenu, HoverCard, Tooltip } from "@upstart.gg/style-system/system";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { RiArrowDownSLine } from "react-icons/ri";
import { RxRocket } from "react-icons/rx";
import {
  useChatVisible,
  useEditorHelpers,
  useLogoLink,
  useModal,
  usePanel,
  usePreviewMode,
  useZoom,
} from "~/editor/hooks/use-editor";
import dark from "../../../../../creatives/upstart-dark.svg";
import logo from "../../../../../creatives/upstart.svg";
import { LuPlus } from "react-icons/lu";
import { PiPalette } from "react-icons/pi";
import { VscSettings } from "react-icons/vsc";
import { useUserConfig } from "../hooks/use-user-config";
import {
  useDraft,
  usePageVersion,
  useSitemap,
  useDraftUndoManager,
  useGenerationState,
  useSite,
  usePage,
} from "../hooks/use-page-data";

export default function NavBar() {
  const editorHelpers = useEditorHelpers();
  const previewMode = usePreviewMode();
  const logoLink = useLogoLink();
  const draft = useDraft();
  const pageVersion = usePageVersion();
  const pages = useSitemap();
  const site = useSite();
  const page = usePage();
  const { panel } = usePanel();
  const modal = useModal();
  const { canZoomIn, canZoomOut, zoomIn, zoomOut, zoom, resetZoom } = useZoom();
  const userConfig = useUserConfig();
  const chatVisible = useChatVisible();
  const { undo, redo, futureStates, pastStates } = useDraftUndoManager();
  const canRedo = useMemo(() => futureStates.length > 0, [futureStates]);
  const canUndo = useMemo(() => pastStates.length > 0, [pastStates]);
  const currentPageLabel = page.label ?? "Untitled Page";
  const generationState = useGenerationState();

  const publish = useCallback(
    (wholeSite = false) => {
      if (wholeSite) {
        editorHelpers.onPublish({ mode: "publish-site", siteId: site.id });
      } else {
        editorHelpers.onPublish({
          mode: "publish-page",
          pageId: page.id,
          siteId: site.id,
          pageVersionId: pageVersion ?? "latest",
        });
      }
    },
    [site.id, page.id, pageVersion, editorHelpers.onPublish],
  );

  const switchPreviewMode = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      editorHelpers.setPreviewMode(previewMode === "mobile" ? "desktop" : "mobile");
      // Hide the panel if its in library mode because we can't add bricks in mobile preview mode
      editorHelpers.hidePanel("library");
    },
    [previewMode, editorHelpers.setPreviewMode, editorHelpers.hidePanel],
  );

  // bg-upstart-600
  const baseCls = tx(`transition-opacity duration-300 px-2 min-w-[2.5rem]`);

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
  const separator = tx("h-[70%] w-px bg-black/10 mx-1");

  return (
    <nav
      role="navigation"
      className={tx(
        `z-[9999] h-full gap-1 px-4 flex text-xl w-full items-center transition-opacity duration-300
        text-black/70 dark:text-dark-200 bg-white`,
        css({
          gridArea: "navbar",
        }),
      )}
    >
      <button
        type="button"
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

      <div className={tx("flex items-center gap-1 flex-1", !generationState.isReady && "hidden")}>
        <TopbarMenu
          id="switch-page-menu-btn"
          items={[
            { label: "New page", onClick: () => editorHelpers.onShowPopup?.("add-page") },
            { label: "Duplicate page", onClick: () => editorHelpers.onShowPopup?.("duplicate-page") },
            { type: "separator" as const },
            ...(pages.length > 1 ? [{ type: "label", label: "Switch to page" } as const] : []),
            ...(pages.length > 1
              ? pages.map((p) => ({
                  label: p.label,
                  type: "checkbox" as const,
                  checked: page.id === p.id || page.path === p.path,
                  onClick: () => {
                    const currentURL = new URL(window.location.href);
                    currentURL.searchParams.set("p", p.id);
                    currentURL.searchParams.set("r", `${Date.now()}`);
                    window.location.href = currentURL.href;
                  },
                }))
              : []),
          ]}
        >
          <button
            type="button"
            className={tx(btnClass, commonCls, btnWithArrow, "!px-1.5 ml-4 cursor-pointer !py-2")}
          >
            <VscCopy className={tx("h-5 w-auto")} />
            <div className={tx("flex flex-col gap-1 ml-1.5 mr-2 justify-start items-start")}>
              <span className={tx("text-xs inline-block font-thiner")}>Page</span>
              <span className={tx("text-sm inline-block -mt-[7px] font-medium max-w-[10dvw] truncate")}>
                {currentPageLabel}
              </span>
            </div>
            <RiArrowDownSLine className={tx(arrowClass)} />
          </button>
        </TopbarMenu>

        {/* spacer */}
        <div className={tx("max-lg:hidden flex-1")} />

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

        <Tooltip content="Undo" side="bottom" align="center" aria-disabled={!canUndo}>
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
              "text-gray-500 dark:text-dark-200 text-[.85rem] text-right cursor-pointer hover:text-upstart-800 min-w-[40px]",
            )}
          >
            {(zoom * 100).toFixed(0)}%
          </button>
        </Tooltip>

        <div className={separator} />

        <Tooltip content="Open preview" side="bottom" align="center">
          <button
            type="button"
            className={tx(btnClass, squareBtn, commonCls)}
            onClick={() => {
              window.open(`/sites/${site.id}/pages/${page.id}/preview`, "upstart_preview");
            }}
          >
            <RxExternalLink className="h-5 w-auto" />
          </button>
        </Tooltip>

        <div className={separator} />

        <div className={tx("flex flex-col gap-1.5 leading-none text-sm items-start px-1.5")}>
          <span
            className={tx(
              "inline-flex items-center gap-1 text-nowrap",
              userConfig.credits === 0 && "text-red-800 font-semibold",
            )}
          >
            <BsStars className={tx("opacity-60 w-4 h-4")} /> {userConfig.credits.toLocaleString()} credits
          </span>
          <div className={tx("inline-flex gap-1 items-center")}>
            <HoverCard.Root>
              <HoverCard.Trigger>
                <button
                  type="button"
                  className={tx(
                    "hover:underline cursor-help tracking-tight underline-offset-2 text-[88%] text-upstart-700 hover:text-upstart-700 text-nowrap",
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
                      className={tx(
                        "text-nowrap text-upstart-700 cursor-pointer font-medium hover:underline",
                      )}
                      onClick={() => {
                        editorHelpers.onShowPopup?.("purchase-credits");
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
                "text-nowrap hover:underline tracking-tight underline-offset-2 text-[88%] text-upstart-700 hover:text-orange-800",
              )}
              onClick={() => {
                editorHelpers.onShowPopup?.("purchase-credits");
                // alert("buy credits");
              }}
            >
              Buy more
            </button>
          </div>
        </div>

        <div className={separator} />

        <button type="button" className={tx(btnClass, commonCls, squareBtn)}>
          <IoIosHelpCircleOutline className="h-5 w-auto" />
        </button>

        <div className={tx("flex-1", "border-x border-l-upstart-400 border-r-upstart-700")} />

        {/* <div className={tx(btnClass, baseCls, "px-8")}>
          {lastSaved ? (
            <div className={tx("text-sm text-black/50")}>
              Saved {formatDistance(lastSaved, new Date(), { addSuffix: true })}
              Saved {formatDistance(lastSaved, new Date(), { addSuffix: true })}
            </div>
          ) : (
            <div className={tx("text-sm")}>Not saved yet</div>
          )}
        </div> */}

        <TopbarMenu
          id="publish-menu-btn"
          items={[
            { label: "Publish this page", onClick: () => publish() },
            { label: "Publish all pages", onClick: () => publish(true) },
            { type: "separator" as const },
            { label: "Schedule publication", onClick: () => editorHelpers.onShowPopup?.("schedule-publish") },
          ]}
        >
          <button type="button" className={tx(btnClass, rocketBtn, btnWithArrow)}>
            <div
              style={{
                textShadow: "1px 1px 0px rgba(255, 255, 255, 0.3)",
              }}
              className={tx(
                "font-semibold inline-flex gap-1.5 bg-orange-100 py-2 px-3 rounded-full text-nowrap items-center cursor-pointer",
                css({ fontSize: ".94rem" }),
              )}
            >
              <RxRocket className={tx("h-4 w-auto stroke-orange-600")} />
              Publish
              <RiArrowDownSLine className={tx(arrowClass, "!text-orange-700")} />
            </div>
            {/* <div>
                <RxRocket className={tx("h-5 w-auto")} />
              </div>
              <span className={tx("font-bold italic px-2", css({ fontSize: "1rem" }))}>Publish</span> */}
          </button>
        </TopbarMenu>
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
            <DropdownMenu.CheckboxItem key={item.label} checked={item.checked} onClick={item.onClick}>
              <div
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
              </div>
            </DropdownMenu.CheckboxItem>
          ) : (
            <DropdownMenu.Item key={item.label} onClick={item.onClick}>
              <div
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
              </div>
            </DropdownMenu.Item>
          ),
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
