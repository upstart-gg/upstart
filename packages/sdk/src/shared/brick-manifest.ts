import type { TObject, TProperties, TArray } from "@sinclair/typebox";
import type { IconBase } from "react-icons/lib";
import { getSchemaObjectDefaults } from "./utils/schema";

type BrickKind = "brick" | "widget" | "container";

type BrickManifestProps<BProps extends TProperties, DSSchema extends TObject | TArray<TObject>> = {
  type: string;
  kind?: BrickKind;
  name: string;
  icon: typeof IconBase;
  iconClassName?: string;
  staticClasses?: string;
  description?: string;
  // Min width in pixels
  minWidth?: {
    mobile: number;
    desktop: number;
  };
  // Max width in pixels
  maxWidth?: {
    mobile: number;
    desktop: number;
  };
  // Min height in pixels
  minHeight?: {
    mobile: number;
    desktop: number;
  };
  // Max height in pixels
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
  hideInLibrary?: boolean;
  defaultInspectorTab?: "preset" | "style" | "content";
  deletable?: boolean;
  movable?: boolean;
  repeatable?: boolean;
  resizable?: boolean;
  duplicatable?: boolean;
  isContainer?: boolean;
  aiInstructions?: string;
};

export function defineBrickManifest<BProps extends TProperties, DSSchema extends TObject | TArray<TObject>>({
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
  icon,
  datasource,
  ...rest
}: BrickManifestProps<BProps, DSSchema>) {
  return {
    ...rest,
    datasource: datasource as DSSchema,
    icon,
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
    props: getSchemaObjectDefaults(manifest.props),
    // mobileProps: {},
    ...(manifest.datasource ? { datasource: getSchemaObjectDefaults(manifest.datasource) } : {}),
    // ...(manifest.datarecord ? { datarecord: Value.Create(manifest.datarecord) } : {}),
  };
}

export type BrickDefaults = ReturnType<typeof getBrickManifestDefaults>;

export type BrickConstraints = Pick<
  BrickManifest,
  "defaultWidth" | "defaultHeight" | "minWidth" | "minHeight" | "maxWidth" | "resizable" | "movable"
>;
