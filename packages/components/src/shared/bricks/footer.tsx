import { forwardRef, type MouseEventHandler } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/footer.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx } from "@upstart.gg/style-system/twind";
import { toast } from "@upstart.gg/style-system/system";
import { useBrickStyle } from "../hooks/use-brick-style";

const Footer = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const props = brick.props;
  const styles = useBrickStyle<Manifest>(brick);
  const classes = Object.values(styles);
  const onClick: MouseEventHandler | undefined = editable
    ? (e) => {
        e.preventDefault();
        toast(
          `This link is not clickable in edit mode but will lead to "${(e.target as HTMLLinkElement).href}" when published.`,
          {
            style: {
              minWidth: "max-content",
            },
          },
        );
      }
    : undefined;
  return (
    // Force 2 cols on mobile
    <footer
      ref={ref}
      className={tx(
        `flex-1 grid gap-6 @desktop:grid-flow-col @mobile:grid-cols-2 @desktop:auto-cols-fr `,
        classes,
      )}
    >
      {props.linksSections?.map((section, index) => (
        <nav key={index} className="flex flex-col @mobile:gap-3 @desktop:gap-2 text-sm">
          <h6 className={tx("uppercase font-bold opacity-60")}>{section.sectionTitle}</h6>
          {section.links.map((link, linkIndex) => (
            <a key={linkIndex} href={link.url} onClick={onClick} className={tx("link link-hover max-w-fit")}>
              {link.title}
            </a>
          ))}
        </nav>
      ))}
    </footer>
  );
});

export default Footer;
