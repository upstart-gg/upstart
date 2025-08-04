import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/social-links.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";
import { InlineIcon } from "@iconify/react";
import BrickRoot from "../components/BrickRoot";

export default function SocialLinks({ brick, editable }: BrickProps<Manifest>) {
  const styles = useBrickStyle<Manifest>(brick);
  const { props } = brick;
  // Ensure links is an array - allow empty arrays
  const links = Array.isArray(props.links) ? props.links : [];

  return (
    <BrickRoot
      editable={editable}
      manifest={manifest}
      className={tx("flex justify-start items-start gap-2", Object.values(styles))}
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
    </BrickRoot>
  );
}
