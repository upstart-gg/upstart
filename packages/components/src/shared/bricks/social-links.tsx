import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/social-links.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { toast } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import { forwardRef } from "react";
import { useBrickStyle } from "../hooks/use-brick-style";
import { InlineIcon } from "@iconify/react";

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
  };

  // Ensure links is an array - allow empty arrays
  const links = Array.isArray(props.links) ? props.links : [];

  const isRowDisplay = props.display?.includes("row") ?? false;

  return (
    <div
      ref={ref}
      className={tx(
        "flex flex-1 justify-start items-start text-xl",
        isRowDisplay ? "flex-row" : "flex-col items-stretch",
        // editable && "relative group",
        styles.backgroundColor,
      )}
    >
      {editable && links.length === 0 && (
        <div className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md">
          <span className="text-sm text-gray-500 dark:text-gray-400">Add social links to get started</span>
        </div>
      )}
      {links.map((link, index) => {
        return (
          <a
            key={index}
            type="button"
            href={link.href}
            onClick={(e) => {
              if (editable) {
                e.preventDefault();
              }
            }}
            className={tx("p-0.5 grow flex items-center gap-1 hover:opacity-80")}
            title={link.label || link.href}
          >
            {link.icon && <InlineIcon icon={link.icon} className="text-[100%]" />}
            {!props.icononly && link.label && <span className="ml-1">{link.label}</span>}
          </a>
        );
      })}
    </div>
  );
});

SocialLinks.displayName = "SocialLinks";

export default SocialLinks;
