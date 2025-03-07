import { tx, apply, css } from "@upstart.gg/style-system/twind";
import type { AllStyleProps } from "@upstart.gg/sdk/bricks/props/all";
import { propToStyle } from "@upstart.gg/sdk/shared/themes/color-system";

export type BrickStyleProps = AllStyleProps & {
  className?: string;
  mobileProps: AllStyleProps | undefined;
};

export function getBackgroundStyles(props: BrickStyleProps) {
  if ("background" in props) {
    return [
      propToStyle(props.background?.color, "backgroundColor"),
      props.background?.image &&
        css({
          backgroundImage: `url(${props.background.image})`,
          backgroundSize: props.background.size ?? "auto",
          backgroundRepeat: props.background.repeat ?? "no-repeat",
        }),
    ];
  }
}

export function getEffectsStyles(props: BrickStyleProps) {
  if ("effects" in props) {
    return [propToStyle(props.effects?.opacity, "opacity"), props.effects?.shadow];
  }
}

export function getBorderStyles(props: BrickStyleProps) {
  if ("border" in props) {
    return [
      propToStyle(props.border?.color, "borderColor"),
      props.border?.radius,
      props.border?.style,
      props.border?.width,
    ];
  }
}

export function getBasicAlignmentStyles(props: BrickStyleProps) {
  if ("align" in props) {
    return [props.align?.vertical, props.align?.horizontal];
  }
}

/**
 * Flexbox handles alignment using a main axis and a cross axis.
 * We want to map the alignment to the flexbox properties.
 */
export function getFlexStyles(props: BrickStyleProps) {
  const { mobileProps } = props;
  if (mobileProps && "flex" in mobileProps) {
    return `@desktop:(
      ${props.flex?.direction ?? ""}
      ${props.flex?.justifyContent ?? ""}
      ${props.flex?.alignItems ?? ""}
      ${props.flex?.wrap ?? ""}
      ${props.flex?.gap ?? ""}
    )
    @mobile:(
      ${mobileProps.flex?.direction ?? props.flex?.direction ?? ""}
      ${mobileProps.flex?.justifyContent ?? props.flex?.justifyContent ?? ""}
      ${mobileProps.flex?.alignItems ?? props.flex?.alignItems ?? ""}
      ${mobileProps.flex?.wrap ?? props.flex?.wrap ?? ""}
      ${mobileProps.flex?.gap ?? props.flex?.gap ?? ""}
    )`;
  }
  return [
    props.flex?.direction,
    props.flex?.justifyContent,
    props.flex?.alignItems,
    props.flex?.wrap,
    props.flex?.gap,
  ];
}
