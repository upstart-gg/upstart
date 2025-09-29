import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/button.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { css, tx } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";
import BrickRoot from "../components/BrickRoot";
import { useSitemap } from "~/editor/hooks/use-page-data";

export default function Button({ brick, editable }: BrickProps<Manifest>) {
  const styles = useBrickStyle<Manifest>(brick);
  const { props } = brick;
  const classes = Object.values(styles);
  const sitemap = useSitemap();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (editable) {
      e.preventDefault();
      return;
    }
    if (props.link) {
      if (props.link.startsWith("http")) {
        window.open(props.link, "_blank");
      } else {
        const page = sitemap.find((p) => p.id === props.link);
        if (page) {
          window.location.href = page.path; // Navigate to the page URL if it exists
        }
      }
    }
  };

  const fillStyle =
    props.fill === "outline"
      ? css({
          backgroundColor: "transparent",
          border: "2px solid currentColor",
          "&:hover": {
            backgroundColor: "currentColor",
            color: "light-dark(white, black)",
          },
        })
      : css({
          "&:hover": {
            filter: "brightness(1.15)",
          },
        });

  return (
    <BrickRoot
      brick={brick}
      manifest={manifest}
      editable={editable}
      as="button"
      type="button"
      className={tx(classes, "btn", fillStyle, editable && "pointer-events-none")}
      data-prevented-by-editor={editable ? "true" : "false"}
      onClick={handleClick}
    >
      {props.label}
    </BrickRoot>
  );
}
