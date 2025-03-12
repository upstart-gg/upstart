import type { TObject, TProperties, TArray } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

type BrickKind = "brick" | "widget" | "container";

type BrickManifestProps<
  BProps extends TProperties,
  DSSchema extends TObject | TArray<TObject>,
  DRProps extends TProperties,
> = {
  type: string;
  kind?: BrickKind;
  name: string;
  icon: string;
  description?: string;
  minWidth?: {
    mobile: number;
    desktop: number;
  };
  maxWidth?: {
    mobile: number;
    desktop: number;
  };
  minHeight?: {
    mobile: number;
    desktop: number;
  };
  maxHeight?: {
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
  duplicatable?: boolean;
  isContainer?: boolean;
};

export function defineBrickManifest<
  BProps extends TProperties,
  DSSchema extends TObject | TArray<TObject>,
  DRProps extends TProperties,
>({
  props,
  defaultWidth,
  defaultHeight,
  minWidth,
  minHeight,
  kind = "brick",
  isContainer = false,
  hideInLibrary = false,
  deletable = true,
  movable = true,
  resizable = true,
  repeatable = false,
  duplicatable = true,
  defaultInspectorTab = "preset",
  ...rest
}: BrickManifestProps<BProps, DSSchema, DRProps>) {
  return {
    ...rest,
    props,
    kind,
    defaultInspectorTab,
    hideInLibrary,
    deletable,
    movable,
    resizable,
    repeatable,
    duplicatable,
    isContainer,
    defaultWidth:
      defaultWidth ?? minWidth ?? ({ desktop: 8, mobile: -1 } as { desktop: number; mobile: number }),
    defaultHeight:
      defaultHeight ?? minHeight ?? ({ desktop: 3, mobile: 3 } as { desktop: number; mobile: number }),
    minWidth,
    minHeight,
  } as const;
}

export type BrickManifest = ReturnType<typeof defineBrickManifest>;

export function getBrickManifestDefaults<M extends BrickManifest>(manifest: M) {
  return {
    ...manifest,
    props: Value.Create(manifest.props),
    mobileProps: {},
    ...(manifest.datasource ? { datasource: Value.Create(manifest.datasource) } : {}),
    ...(manifest.datarecord ? { datarecord: Value.Create(manifest.datarecord) } : {}),
  };
}

export type BrickDefaults = ReturnType<typeof getBrickManifestDefaults>;

export type BrickConstraints = Pick<
  BrickManifest,
  "defaultWidth" | "defaultHeight" | "minWidth" | "minHeight" | "maxWidth" | "resizable" | "movable"
>;
