import { forwardRef, type MouseEventHandler } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/footer.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx } from "@upstart.gg/style-system/twind";
import { toast } from "@upstart.gg/style-system/system";

const Footer = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const props = brick.props;
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
    <footer ref={ref} className={tx("footer sm:footer-horizontal flex-1 p-10", `grid-rows-${props.rows}`)}>
      {props.linksSections?.map((section, index) => (
        <nav key={index}>
          <h6 className={tx("footer-title")}>{section.sectionTitle}</h6>
          {section.links.map((link, linkIndex) => (
            <a key={linkIndex} href={link.url} onClick={onClick} className={tx("link link-hover")}>
              {link.title}
            </a>
          ))}
        </nav>
      ))}
    </footer>
  );
});

export default Footer;
