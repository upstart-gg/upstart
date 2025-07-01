import type { BrickManifest } from "@upstart.gg/sdk/shared/brick-manifest";
import { tx } from "@upstart.gg/style-system/twind";

export function IconRender(props: BrickManifest) {
  const icon =
    typeof props.icon === "string" ? (
      <span
        className={tx(
          "w-7 h-7 text-upstart-600 dark:text-upstart-400 [&>svg]:w-auto [&>svg]:h-7 inline-block",
        )}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{ __html: props.icon }}
      />
    ) : (
      <props.icon
        className={tx("w-6 h-6 text-upstart-600/90 group-hovertext-upstart-700", props.iconClassName)}
      />
    );
  return icon;
}
