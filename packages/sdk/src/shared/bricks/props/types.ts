import type { Static, TObject, TProperties, TSchema, StaticDecode } from "@sinclair/typebox";
import type { Brick, BrickManifest } from "../types";

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type BrickProps<T extends BrickManifest> = {
  // brick: Brick;
  brick: Omit<Brick, "props" | "mobileProps"> & {
    props: Static<T["props"]> & {};
    mobileProps?: Partial<Static<T["props"]>> & {};
  };
  /**
   * True if we are in the context of the Editor
   */
  editable?: boolean;
  /**
   * True if the brick is selected in the Editor
   */
  selected?: boolean;
  /**
   * True if the brick is a child of a container (e.g. Section, Box)
   */
  isContainerChild?: boolean;

  isDynamicPreview?: boolean;

  level?: number; // Nesting level of the brick

  iterationIndex?: number; // Index in a loop or iteration context
};

export type BrickPropCategory = "settings" | "presets" | "content";

// Export the TSchema type for use in other files
export type { TSchema };

type CommonMetadata = {
  "ui:responsive"?: boolean | "mobile" | "mobile-only";
  "ui:hidden"?: boolean | "if-empty";
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
