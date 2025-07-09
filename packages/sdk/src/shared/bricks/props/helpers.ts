/**
 * Helper functions for defining and working with props and groups of props
 */
import { type TProperties, Type, type TSchema, type TObject, type ObjectOptions } from "@sinclair/typebox";
import { commonProps } from "./common";
import type { PartialBy, PropGroup, GroupMetadata } from "./types";
import { get } from "lodash-es";
import { resolveSchema } from "~/shared/utils/schema-resolver";
// import { resolveSchema } from "~/shared/utils/schema-resolver";

function isTObject(schema: TSchema | TProperties): schema is TObject {
  return schema.type === "object";
}

export function group<T extends TProperties>({
  title,
  children,
  category = "settings",
  metadata,
  options,
}: PartialBy<PropGroup<T>, "category">) {
  // check if children is already a TObject
  if (isTObject(children)) {
    const generated = Type.Composite([Type.Object({}), children], {
      title,
      metadata: {
        category,
        group: true,
        ...metadata,
      },
      ...options,
    });
    return generated;
  }

  // Create the TypeBox schema with title as a standard property and group-specific info in metadata
  return Type.Object(children, {
    title,
    ...options,
    metadata: {
      category,
      group: true,
      ...metadata,
    },
  });
}

// Functions to extract metadata from schemas
export function getGroupInfo(schema: TSchema) {
  const meta = schema.metadata as GroupMetadata;
  return {
    title: (schema.title ?? schema.metadata?.title) as string | undefined,
    meta,
    tab: meta.groupTab || "common",
  };
}

export function defineProps<P extends TProperties>(
  props: P,
  options?: ObjectOptions & { noPreset?: boolean; noAlignSelf?: boolean; defaultPreset?: string },
) {
  const finalProps = { ...commonProps, ...props };
  // if (options?.noPreset) {
  //   // If noPreset is true, we don't add the preset property
  //   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  //   // biome-ignore lint/performance/noDelete: <explanation>
  //   delete (finalProps as any).preset;
  // }
  // if (options?.defaultPreset) {
  //   // If defaultPreset is provided, we set it as the default value for the preset property
  //   // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  //   (finalProps as any).preset = Type.Optional(presetRef({ default: options.defaultPreset }));
  // }
  if (options?.noAlignSelf) {
    // If noPreset is true, we don't add the preset property
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    // biome-ignore lint/performance/noDelete: <explanation>
    delete (finalProps as any).alignSelf;
  }
  return Type.Object(finalProps, options);
}

// export const optional = Type.Optional;
export const array = Type.Array;
