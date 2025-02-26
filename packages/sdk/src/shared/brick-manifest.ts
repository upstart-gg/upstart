import { Type, type Static, type TObject, type TProperties, type TArray } from "@sinclair/typebox";
import { LAYOUT_COLS } from "./layout-constants";

export function defineBrickManifest<
  BType extends string,
  BTitle extends string,
  BIcon extends string,
  BDesc extends string,
  BProps extends TProperties,
>({
  type,
  kind,
  title,
  description,
  preferredWidth,
  preferredHeight,
  minWidth,
  minHeight,
  maxWidth,
  icon,
  props,
  datasources,
  datarecord,
  isContainer,
  hideInLibrary,
}: {
  type: BType;
  kind: string;
  title: BTitle;
  icon: BIcon;
  description: BDesc;
  minWidth?: {
    mobile: number;
    desktop: number;
  };
  minHeight?: {
    mobile: number;
    desktop: number;
  };
  maxWidth?: {
    mobile: number;
    desktop: number;
  };
  preferredWidth?: {
    mobile: number;
    desktop: number;
  };
  preferredHeight?: {
    mobile: number;
    desktop: number;
  };
  props: TObject<BProps>;
  datasources?: TObject;
  datarecord?: TObject;
  hideInLibrary?: boolean;
  isContainer?: boolean;
}) {
  return Type.Object({
    type: Type.Literal(type),
    kind: Type.Literal(kind),
    title: Type.Literal(title),
    description: Type.Literal(description),
    icon: Type.Literal(icon),
    hideInLibrary: Type.Boolean({ default: hideInLibrary ?? false }),
    isContainer: Type.Boolean({ default: isContainer ?? false }),
    preferredWidth: Type.Object(
      {
        mobile: Type.Number(),
        desktop: Type.Number(),
      },
      { default: preferredWidth ?? minWidth },
    ),
    preferredHeight: Type.Object(
      {
        mobile: Type.Number(),
        desktop: Type.Number(),
      },
      { default: preferredHeight ?? minHeight },
    ),
    minWidth: Type.Object(
      {
        mobile: Type.Number(),
        desktop: Type.Number(),
      },
      { default: minWidth ?? { mobile: 1, desktop: 1 } },
    ),
    maxWidth: Type.Object(
      {
        mobile: Type.Number(),
        desktop: Type.Number(),
      },
      { default: maxWidth ?? { mobile: LAYOUT_COLS.mobile, desktop: LAYOUT_COLS.desktop } },
    ),
    minHeight: Type.Object(
      {
        mobile: Type.Number(),
        desktop: Type.Number(),
      },
      { default: minHeight ?? { mobile: 1, desktop: 1 } },
    ),
    ...(datasources && { datasources }),
    ...(datarecord && { datarecord }),
    props,
  });
}

export type BrickManifest = ReturnType<typeof defineBrickManifest>;
export type ResolvedBrickManifest = Static<BrickManifest>;

export type BrickConstraints = Pick<
  ResolvedBrickManifest,
  "preferredWidth" | "preferredHeight" | "minWidth" | "minHeight" | "maxWidth"
>;
