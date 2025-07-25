import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/footer.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx } from "@upstart.gg/style-system/twind";
import { forwardRef, type MouseEventHandler } from "react";
import { useBrickStyle } from "../hooks/use-brick-style";
import { useColorPreset } from "../hooks/use-color-preset";

const Footer = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const props = brick.props;
  const presetClasses = useColorPreset<Manifest>(brick);
  const styles = useBrickStyle<Manifest>(brick);
  const classes = Object.values(styles);
  const onClick: MouseEventHandler | undefined = editable
    ? (e) => {
        e.preventDefault();
      }
    : undefined;
  return (
    // Force 2 cols on mobile
    <footer
      ref={ref}
      className={tx(
        `flex-1 grid gap-6 @desktop:grid-flow-col @mobile:grid-cols-2 @desktop:auto-cols-fr `,
        classes,
        presetClasses.container,
      )}
    >
      {props.logo && (
        <div
          className={tx(
            "items-center @desktop:(mr-10 col-span-1) @mobile:(flex col-start-1 col-span-2 justify-center)",
          )}
          data-brick-group="brand"
        >
          <img src={props.logo.src} alt={props.logo.alt ?? "Logo"} className={`h-full max-h-[80px] w-auto`} />
        </div>
      )}
      {props.linksSections?.map((section, index) => (
        <nav key={index} className={tx("flex flex-col @mobile:gap-3 @desktop:gap-2")}>
          <h6 className={tx("uppercase font-bold opacity-80")}>{section.sectionTitle}</h6>
          {section.links?.map((link, linkIndex) => (
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
