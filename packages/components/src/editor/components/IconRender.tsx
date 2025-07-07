import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import { tx } from "@upstart.gg/style-system/twind";

export function IconRender({ manifest, className }: { manifest: BrickManifest; className?: string }) {
  const icon =
    typeof manifest.icon === "string" ? (
      <span
        className={tx(
          className,
          "w-7 h-7 text-upstart-600 dark:text-upstart-400 [&>svg]:w-auto [&>svg]:h-7 inline-block",
        )}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: manifest.icon }}
      />
    ) : (
      <manifest.icon
        className={tx(
          className,
          "w-6 h-6 text-upstart-600/90 group-hovertext-upstart-700",
          manifest.iconClassName,
        )}
      />
    );
  return icon;
}
