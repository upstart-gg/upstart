import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/footer.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx } from "@upstart.gg/style-system/twind";

const Footer = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick }, ref) => {
  const props = brick.props;
  return (
    <footer ref={ref} className={tx("footer sm:footer-horizontal bg-neutral text-neutral-content p-10")}>
      {props.linksSections?.map((section, index) => (
        <nav key={index}>
          <h6 className={tx("footer-title")}>{section.sectionTitle}</h6>
          {section.links.map((link, linkIndex) => (
            <a key={linkIndex} href={link.url} className={tx("link link-hover")}>
              {link.title}
            </a>
          ))}
        </nav>
      ))}
    </footer>
  );
});

export default Footer;
