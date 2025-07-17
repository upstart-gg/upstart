import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/social-links.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { toast } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import { forwardRef } from "react";
import { useBrickStyle } from "../hooks/use-brick-style";
import { renderIcon } from "../utils/icon-resolver";

const SocialLinks = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const styles = useBrickStyle<Manifest>(brick);
  const { props } = brick;
  const onClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>, link: { href: string }) => {
    e.preventDefault();
    if (editable) {
      console.warn("SocialLinks is editable, links are disabled");
      toast(`This link is not clickable in edit mode but will lead to ${link.href} when published.`, {
        style: {
          minWidth: "max-content",
        },
      });
      return;
    }
    if (!editable && link.href) {
      if (link.href.startsWith("http")) {
        window.open(link.href, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = link.href;
      }
    }
  };

  // Ensure links is an array - allow empty arrays
  const links = Array.isArray(props.links) ? props.links : [];

  const isRowDisplay = props.display?.includes("row") ?? false;

  return (
    <div
      ref={ref}
      className={tx(
        "social-links flex flex-1 justify-start items-start",
        isRowDisplay ? "flex-row" : "flex-col",
        "min-w-fit w-auto min-h-[2rem] my-1",
        editable && "relative group",
        styles.backgroundColor,
      )}
    >
      {editable && links.length === 0 && (
        <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
          <span className="text-sm text-gray-500 dark:text-gray-400">Add social links to get started</span>
        </div>
      )}
      {links.map((link, index) => {
        const iconElement = link.icon ? renderIcon(link.icon, "w-5 h-5") : null;

        return (
          <button
            key={index}
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onClick(e, link);
            }}
            className={tx(
              "social-link-btn  p-1",
              "flex items-center gap-1",
              "hover:opacity-80 transition-all duration-200",
              "border-0 bg-transparent rounded-md hover:bg-gray-100 dark:hover:bg-gray-800",
            )}
            aria-label={link.label || link.href}
            title={link.label || link.href}
          >
            {iconElement}
            {!props.icononly && link.label && <span className="text-sm ml-1">{link.label}</span>}
          </button>
        );
      })}
    </div>
  );
});

SocialLinks.displayName = "SocialLinks";

export default SocialLinks;
