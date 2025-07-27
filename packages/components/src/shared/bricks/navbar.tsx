import { manifest, type Manifest } from "@upstart.gg/sdk/shared/bricks/manifests/navbar.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useBrickStyle } from "../hooks/use-brick-style";
import TextContent from "../components/TextContent";
import { RxHamburgerMenu } from "react-icons/rx";
import { tx } from "@upstart.gg/style-system/twind";
import { useColorPreset } from "../hooks/use-color-preset";
import BrickRoot from "../components/BrickRoot";

export default function Navbar({ brick, editable }: BrickProps<Manifest>) {
  const styles = useBrickStyle<Manifest>(brick);
  const presetClasses = useColorPreset<Manifest>(brick);
  const props = brick.props;

  return (
    <BrickRoot
      manifest={manifest}
      as="header"
      data-brick-group="container"
      data-is-navbar
      className={tx("flex px-4 brick basis-full h-[60px]", styles.gradientDirection, presetClasses.main)}
    >
      <div
        className={tx(
          "flex flex-1 items-center justify-between @lg:justify-start",
          props.linksPosition !== "center" && "@lg:gap-4",
        )}
      >
        <div
          className={tx("flex items-center gap-3", styles.brand)}
          data-brick-group="brand"
          data-brick-menu-offset="70"
        >
          {props.logo?.src && (
            <img
              src={props.logo.src}
              alt={props.logo.alt ?? "Logo"}
              className={`h-full max-h-[60px] w-auto flex-1`}
            />
          )}
          {props.brand && !props.hideBrand && (
            <TextContent
              as="h1"
              propPath="brand.name"
              className={tx("text-2xl font-bold flex-1")}
              brickId={brick.id}
              content={props.brand}
              editable={editable}
              noTextAlign={true}
              noTextType={true}
              noTextStrike={true}
              inline
            />
          )}
        </div>
        <nav
          data-brick-group="navigation"
          className={tx(
            "hidden @desktop:flex items-center gap-2",
            styles.navigation,
            props.linksPosition === "right" && "ml-auto",
            props.linksPosition === "center" && "mx-auto",
          )}
        >
          {/* {ds.data.map((item, index) => {
            return (
              <a
                key={index}
                href={item.href}
                className={tx(
                  "font-semibold py-2 px-4 self-stretch rounded-md",
                  editable && "hover:bg-black/10",
                  styles.navigationItem,
                )}
              >
                {item.label}
              </a>
            );
          })} */}
        </nav>
        <div role="menu" className="ml-auto @desktop:hidden items-center gap-4" data-brick-group="actions">
          <RxHamburgerMenu className="w-6 h-6" />
        </div>
      </div>
    </BrickRoot>
  );
}
