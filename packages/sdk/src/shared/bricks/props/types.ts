import type { Static, TObject, TProperties, TSchema } from "@sinclair/typebox";
import type { BrickManifest } from "~/shared/brick-manifest";
import type { Brick } from "~/shared/bricks";

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type BrickProps<T extends BrickManifest> = {
  brick: Omit<Brick, "props" | "mobileProps"> & {
    props: Static<T["props"]>;
    mobileProps?: Partial<Static<T["props"]>>;
  };
  editable?: boolean;
  selected?: boolean;
  isContainerChild?: boolean;
};

export type BrickPropCategory = "settings" | "presets" | "content";

// Export the TSchema type for use in other files
export type { TSchema };

type CommonMetadata = {
  "ui:responsive"?: boolean | "mobile" | "mobile-only";
  "ui:hidden"?: boolean | "if-empty";
  "ui:scope"?: "site" | "page";
  "ui:tab"?: BrickPropCategory;
};

export type FieldMetadata = CommonMetadata & {
  "ui:field"?: string;
  [key: string]: unknown;
};

export type GroupMetadata = CommonMetadata & {
  group?: string;
  groupTab?: string;
  [key: string]: string | number | boolean | undefined;
};

export interface PropSchema extends TSchema {
  title: string;
}

export type Prop<T = TSchema> = {
  title: string;
  description?: string;
  schema: T;
  [key: string]: unknown;
};

export type PropGroup<T extends TProperties = TProperties> = {
  title: string;
  category: BrickPropCategory;
  children: T | TObject<T>;
  metadata?: GroupMetadata;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  options?: Record<string, any>;
};
