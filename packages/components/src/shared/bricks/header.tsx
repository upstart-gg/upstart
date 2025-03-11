import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/header.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useBrickStyle } from "../hooks/use-brick-style";
import { tx, apply } from "@upstart.gg/style-system/twind";

const Header = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  // props = { ...defaults.props, ...props };

  console.log("editor props", props);

  const className = useBrickStyle(props.mainContainerStyles);

  return (
    <header
      className={tx(
        apply(
          "rounded-lg bg-white flex p-4 ",
          !props.mainContainerStyles.background && "bg-gradient-to-t from-gray-200 to-gray-50",
          className,
        ),
      )}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {props.brandPart.logo && <img src={props.brandPart.logo} alt="logo" className="h-full w-auto" />}
          {props.brandPart.brand && <h1 className="text-2xl font-bold">{props.brandPart.brand}</h1>}
        </div>
      </div>
    </header>
  );
});

export default Header;
