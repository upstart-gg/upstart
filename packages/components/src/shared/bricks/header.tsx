import { forwardRef } from "react";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/header.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useBrickStyle } from "../hooks/use-brick-style";
import { tx, apply } from "@upstart.gg/style-system/twind";
import { TextContent } from "../components/TextContent";
import { useDatasource } from "../hooks/use-datasource";
import { LAYOUT_ROW_HEIGHT } from "@upstart.gg/sdk/shared/layout-constants";
import { RxHamburgerMenu } from "react-icons/rx";

const Header = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const styles = useBrickStyle<Manifest>(brick);
  const props = brick.props;
  const ds = useDatasource(props.navigation.items, manifest.datasource);

  return (
    <header
      ref={ref}
      data-brick-group="container"
      className={tx(
        "flex-1 flex px-4 brick",
        !props.container.backgroundColor && "bg-gradient-to-t from-gray-200 to-gray-50",
        styles.container,
      )}
    >
      <div
        className={tx(
          "flex flex-1 items-center @mobile:justify-between @desktop:justify-start",
          props.navigation.position !== "center" && "@desktop:gap-4",
        )}
      >
        <div
          className={tx("flex items-center gap-3", styles.brand)}
          data-brick-group="brand"
          data-brick-menu-offset="70"
        >
          {props.brand.logo?.src && (
            <img
              src={props.brand.logo.src}
              alt={props.brand.logo.alt ?? "Logo"}
              className={`h-full max-h-[${brick.position.desktop.h * LAYOUT_ROW_HEIGHT - 18}px] flex-1`}
            />
          )}
          {props.brand.name && !props.brand.hideText && (
            <TextContent
              as="h1"
              propPath="brand.name"
              className={tx("text-2xl font-bold flex-1")}
              brickId={brick.id}
              content={props.brand.name}
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
            "@mobile:hidden @desktop:flex items-center gap-2",
            styles.navigation,
            props.navigation.position === "right" && "ml-auto",
            props.navigation.position === "center" && "mx-auto",
          )}
        >
          {ds.data.map((item, index) => {
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
          })}
        </nav>
        <div
          role="menu"
          className="@desktop:hidden @mobile:flex items-center gap-4 color-auto"
          data-brick-group="actions"
        >
          <RxHamburgerMenu className="w-6 h-6" />
        </div>
      </div>
    </header>
  );
});

export default Header;
