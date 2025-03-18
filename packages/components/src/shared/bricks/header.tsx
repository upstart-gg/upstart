import { forwardRef } from "react";
import { manifest, type Manifest } from "@upstart.gg/sdk/bricks/manifests/header.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { urlOrPageId } from "@upstart.gg/sdk/shared/bricks/props/string";
import { useBrickStyle } from "../hooks/use-brick-style";
import { tx, apply } from "@upstart.gg/style-system/twind";
import { TextContent } from "../components/TextContent";
import { useDatasource } from "../hooks/use-datasource";

const Header = forwardRef<HTMLDivElement, BrickProps<Manifest>>(({ brick, editable }, ref) => {
  const styles = useBrickStyle<Manifest>(brick);
  const props = brick.props;

  const ds = useDatasource(props.navigation.items, manifest.datasource);

  console.log("header props", props);
  // console.log("header styles", styles);

  return (
    <header
      ref={ref}
      className={tx(
        "flex-1 rounded-lg flex p-4 ",
        !props.container.backgroundColor && "bg-gradient-to-t from-gray-200 to-gray-50",
        styles.container,
      )}
    >
      <div className="flex flex-1 items-center gap-8 ">
        <div className={tx("flex items-center brand", styles.brand)}>
          {props.brand.logo?.src && <img src={props.brand.logo.src} alt="logo" className="h-full w-auto" />}
          {props.brand.name && (
            <TextContent
              as="h1"
              propPath="brand.name"
              className="text-2xl font-bold"
              brickId={brick.id}
              content={props.brand.name}
              editable={editable}
              noTextAlign={true}
              inline
            />
          )}
        </div>
        <nav
          className={tx(
            "flex items-center gap-2",
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
      </div>
    </header>
  );
});

// Memoize the component to avoid re-rendering when the text content changes
// const MemoHeader = memoizeIgnoringPaths(Header, ["brick.props.brand.name"]);

export default Header;
