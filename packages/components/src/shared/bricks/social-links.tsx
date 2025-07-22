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
  // Ensure links is an array - allow empty arrays
  const links = Array.isArray(props.links) ? props.links : [];
  const isRowDisplay = props.display?.includes("row") ?? false;

  return (
    <div
      ref={ref}
      className={tx(
        "flex flex-grow shrink-0 justify-start items-start min-h-fit min-w-fit gap-2",
        isRowDisplay ? "flex-row" : "flex-col items-stretch",
        Object.values(styles),
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
            href={link.href}
            data-prevented-by-editor={editable ? "true" : "false"}
            onClick={(e) => {
              if (editable) {
                // toast(`This link is not clickable in edit mode.`, {
                //   id: `social-link-no-click-toast`,
                //   style: {
                //     minWidth: "max-content",
                //   },
                // });
                e.preventDefault();
              }
            }}
            className={tx("grow flex items-center gap-0.5 hover:opacity-80")}
            title={link.label || link.href}
          >
            {link.icon && <InlineIcon icon={link.icon} className="text-[100%]" />}
            {!props.icononly && link.label && <span className="ml-1 text-nowrap">{link.label}</span>}
          </a>
        );
      })}
    </div>
  );
});

SocialLinks.displayName = "SocialLinks";

export default SocialLinks;
