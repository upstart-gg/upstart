/**
 * Helper functions for defining and working with props and groups of props
 */
import { type TProperties, Type, type TSchema, type TObject, type ObjectOptions } from "@sinclair/typebox";
import { commonProps } from "./common";
import type { PartialBy, PropGroup, GroupMetadata } from "./types";

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
  options?: ObjectOptions & { noGrow?: boolean; noAlignSelf?: boolean; defaultPreset?: string },
) {
  const allProps = { ...commonProps, ...props };
  const { alignSelf, growHorizontally, ...rest } = allProps;
  const finalProps = {
    ...(options?.noAlignSelf ? {} : { alignSelf }),
    ...(options?.noGrow ? {} : { growHorizontally }),
    ...rest,
  } as typeof allProps;
  // if (!options?.noAlignSelf) {
  //   finalProps.alignSelf = alignSelf;
  // }
  // if (!options?.noGrow) {
  //   finalProps.growHorizontally = growHorizontally;
  // }
  return Type.Object(finalProps, options);
}

// export const optional = Type.Optional;
export const array = Type.Array;
