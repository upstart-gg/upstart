import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/header.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useBrickStyle } from "../hooks/use-brick-style";
import { tx, apply } from "@upstart.gg/style-system/twind";

const Header = forwardRef<HTMLDivElement, BrickProps<Manifest>>((props, ref) => {
  // props = { ...defaults.props, ...props };

  console.log("editor props", props);

  const className = useBrickStyle(props.containerStyles);

  return (
    <header
      className={tx(
        apply(
          "rounded-lg bg-white flex p-4 ",
          !props.containerStyles.backgroundColor && "bg-gradient-to-t from-gray-200 to-gray-50",
          className,
        ),
      )}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {props.brand.logo && <img src={props.brand.logo.src} alt="logo" className="h-full w-auto" />}
          {props.brand.name && <h1 className="text-2xl font-bold">{props.brand.name}</h1>}
        </div>
      </div>
    </header>
  );
});

export default Header;
