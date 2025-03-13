import { type TProperties, Type, type TSchema, TObject } from "@sinclair/typebox";

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Export the TSchema type for use in other files
export type { TSchema };

export type FieldMetadata = {
  "ui:field"?: string;
  [key: string]: string | number | boolean | undefined;
};

export interface PropSchema extends TSchema {
  title: string;
}

export type Prop = {
  id: string;
  title: string;
  schema: TSchema;
  children?: (PropGroup | TSchema)[];
};

export type PropGroup = {
  title: string;
  tab: "common" | "preset";
  children: (PropSchema | PropGroup | TSchema)[]; // Modified to allow nested PropGroup
};

// UI metadata that we want to associate with schemas - only for group-related info
export type UIMetadata = {
  group?: string;
  groupTab?: string;
};

function isTSchema(obj: PropSchema | PropGroup | TSchema): obj is TSchema {
  return obj && typeof obj === "object" && "type" in obj && !("children" in obj);
}

// Type guard to check if an object is a PropGroup
function isPropGroup(obj: PropSchema | PropGroup | TSchema): obj is PropGroup {
  return obj && typeof obj === "object" && "title" in obj && "children" in obj;
}

// Type guard to check if an object is a TSchema with metadata
function isSchemaWithGroupMetadata(obj: PropGroup | TSchema): obj is TSchema {
  return obj && typeof obj === "object" && "metadata" in obj && obj.metadata !== undefined;
}

function groupTitleToId(title: string) {
  return title.toLowerCase().replace(/\s/g, "_");
}

function processGroupChild(child: PropSchema | PropGroup | TSchema): [string, TSchema] {
  if (isPropGroup(child)) {
    // If it's a nested group, process it recursively
    const nestedGroup = group(child);
    return [groupTitleToId(child.title), nestedGroup];
  } else {
    return [child.id ?? groupTitleToId(child.title ?? `group`), child];
  }
}

function group({ title, children, tab = "common" }: PartialBy<PropGroup, "tab">): TSchema {
  // Process each child, handling both PropSchema and nested PropGroup
  const properties: TProperties = {};

  for (const child of children) {
    const [key, schema] = processGroupChild(child);
    properties[key] = schema;
  }

  // Create the TypeBox schema with title as a standard property
  // and group-specific info in metadata
  return Type.Object(properties, {
    title,
    metadata: {
      group: groupTitleToId(title),
      groupTab: tab,
    },
  });
}

function prop({ id, title, schema, children }: Prop): PropSchema {
  // If there are no children, return a schema with title
  if (!children || children.length === 0) {
    // add the title
    return { ...schema, title, id } as PropSchema;
  }

  // If there are children groups, create a properties object
  const childProperties: TProperties = {};

  // Process each child into the properties object
  for (const child of children) {
    if (isPropGroup(child)) {
      // It's a PropGroup, process it recursively
      const groupSchema = group(child);
      childProperties[groupTitleToId(child.title)] = groupSchema;
    } else if (isSchemaWithGroupMetadata(child)) {
      // It's a TSchema with group metadata, extract title
      const metadata = child.metadata as UIMetadata;
      const schemaTitle = (child.title as string) || null;
      if (schemaTitle) {
        childProperties[schemaTitle.toLowerCase()] = child;
      } else if (metadata?.group) {
        childProperties[metadata.group] = child;
      } else {
        // Fallback if no title
        const randomKey = `group_${Object.keys(childProperties).length}`;
        childProperties[randomKey] = child;
      }
    } else {
      // It's a TSchema without metadata
      const randomKey = `group_${Object.keys(childProperties).length}`;
      childProperties[randomKey] = child;
    }
  }

  // Create a parent object that contains both the value and child groups
  return Type.Object(
    {
      value: Type.Composite([schema], { title }),
      ...childProperties,
    },
    {
      title,
    },
  ) as PropSchema;
}

// Functions to extract metadata from schemas
function getGroupInfo(schema: TSchema) {
  const meta = schema.metadata as UIMetadata;
  return {
    title: (schema.title ?? schema.metadata?.title) as string | undefined,
    meta,
    tab: meta.groupTab || "common",
  };
}

export function defineProps(props: Record<string, TSchema>) {
  return Type.Object(props);
}

export { group, prop, getGroupInfo };
