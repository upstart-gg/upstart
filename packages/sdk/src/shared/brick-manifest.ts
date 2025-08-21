import type { TObject, TProperties, TArray } from "@sinclair/typebox";
import type { IconBase, IconType } from "react-icons/lib";
import { getSchemaDefaults } from "./utils/schema";
import type { ReactNode } from "react";

export type BrickCategory = "layout" | "basic" | "media" | "widgets" | "container";

type BrickManifestProps<BProps extends TProperties, DSSchema extends TObject | TArray<TObject>> = {
  type: string;
  category?: BrickCategory;
  name: string;
  icon: IconType;
  iconClassName?: string;
  staticClasses?: string;
  description?: string;
  // Min width in pixels
  minWidth?: {
    mobile?: number;
    desktop?: number;
  };
  // Max width in pixels
  maxWidth?: {
    mobile?: number;
    desktop?: number;
  };
  // Min height in pixels
  minHeight?: {
    mobile?: number;
    desktop?: number;
  };
  // Max height in pixels
  maxHeight?: {
    mobile?: number;
    desktop?: number;
  };
  // default width can be in various css units, but should be a number
  defaultWidth?: {
    mobile?: string;
    desktop?: string;
  };
  defaultHeight?: {
    mobile?: string;
    desktop?: string;
  };
  props: TObject<BProps>;
  hideInLibrary?: boolean;
  /**
   * If true, the brick can consume multiple rows of data from a data source.
   * This is useful for bricks that display lists or collections of items.
   */
  consumesMultipleQueryRows?: boolean;
  defaultInspectorTab?: "preset" | "style" | "content";
  deletable?: boolean;
  movable?: boolean;
  resizable?: boolean | "horizontal" | "vertical";
  duplicatable?: boolean;
  /**
   * Some specific bricks like sidebar or header may not be draggable inline, as we want to place them manually in the layout.
   */
  inlineDragDisabled?: boolean;
  isContainer?: boolean;
  aiInstructions?: string;
};

export function defineBrickManifest<BProps extends TProperties, DSSchema extends TObject | TArray<TObject>>({
  props,
  defaultHeight,
  defaultWidth,
  category = "widgets",
  isContainer = false,
  hideInLibrary = false,
  deletable = true,
  movable = true,
  resizable = true,
  duplicatable = true,
  defaultInspectorTab = "preset",
  icon,
  ...rest
}: BrickManifestProps<BProps, DSSchema>) {
  return {
    ...rest,
    icon,
    props,
    category,
    defaultInspectorTab,
    hideInLibrary,
    deletable,
    movable,
    resizable,
    duplicatable,
    isContainer,
    defaultWidth: { mobile: defaultWidth?.mobile ?? "auto", desktop: defaultWidth?.desktop ?? "auto" },
    defaultHeight: {
      mobile: defaultHeight?.mobile ?? "auto",
      desktop: defaultHeight?.desktop ?? "auto",
    },
  } as const;
}

export type BrickManifest = ReturnType<typeof defineBrickManifest>;

export function getBrickManifestDefaults<M extends BrickManifest>(manifest: M) {
  return {
    ...manifest,
    props: getSchemaDefaults(manifest.props),
    mobileProps: {},
    // ...(manifest.datarecord ? { datarecord: Value.Create(manifest.datarecord) } : {}),
  };
}

export type BrickDefaults = ReturnType<typeof getBrickManifestDefaults>;

export type BrickConstraints = Pick<
  BrickManifest,
  "defaultWidth" | "defaultHeight" | "minWidth" | "minHeight" | "maxWidth" | "resizable" | "movable"
>;
