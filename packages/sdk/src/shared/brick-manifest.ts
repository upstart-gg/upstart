import { Type, type Static, type TObject, type TProperties, type TArray } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

export function defineBrickManifest<
  BProps extends TProperties,
  DSSchema extends TObject | TArray<TObject>,
  DRProps extends TProperties,
>({
  type,
  name,
  description,
  defaultWidth,
  defaultHeight,
  minWidth,
  minHeight,
  maxWidth,
  icon,
  props,
  datasource,
  datarecord,
  kind = "brick",
  isContainer = false,
  hideInLibrary = false,
  deletable = true,
  movable = true,
  resizable = true,
  repeatable = false,
  defaultInspectorTab = "preset",
}: {
  type: string;
  kind?: "brick" | "widget" | "container";
  name: string;
  icon: string;
  description?: string;
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
  defaultWidth?: {
    mobile: number;
    desktop: number;
  };
  defaultHeight?: {
    mobile: number;
    desktop: number;
  };
  props: TObject<BProps>;
  datasource?: DSSchema;
  datarecord?: TObject<DRProps>;
  hideInLibrary?: boolean;
  defaultInspectorTab?: "preset" | "style" | "content";
  deletable?: boolean;
  movable?: boolean;
  repeatable?: boolean;
  resizable?: boolean;
  isContainer?: boolean;
}) {
  return {
    type,
    kind,
    name,
    description,
    defaultInspectorTab: defaultInspectorTab ?? "preset",
    icon,
    hideInLibrary,
    deletable,
    movable,
    resizable,
    repeatable,
    isContainer,
    defaultWidth:
      defaultWidth ?? minWidth ?? ({ desktop: 8, mobile: -1 } as { desktop: number; mobile: number }),
    defaultHeight:
      defaultHeight ?? minHeight ?? ({ desktop: 3, mobile: 3 } as { desktop: number; mobile: number }),
    minWidth,
    maxWidth,
    minHeight,
    ...(datasource ? { datasource } : {}),
    ...(datarecord ? { datarecord } : {}),
    props,
  };
}

export type StaticManifest<T extends ReturnType<typeof defineBrickManifest>> = Omit<T, "props"> & {
  props: Static<T["props"]>;
  datasource: T["datasource"] extends TObject | TArray<TObject> ? Static<T["datasource"]> : never;
  datarecord: T["datarecord"] extends TObject ? Static<T["datarecord"]> : never;
};

export type BrickManifest = ReturnType<typeof defineBrickManifest>;

export function getBrickManifestDefaults(manifest: BrickManifest) {
  return {
    ...manifest,
    props: Value.Create(manifest.props),
  };
}

export type BrickConstraints = Pick<
  BrickManifest,
  "defaultWidth" | "defaultHeight" | "minWidth" | "minHeight" | "maxWidth" | "resizable" | "movable"
>;
