import type { TObject, TProperties } from "@sinclair/typebox";

interface PropertyWithMetadata {
  key: string;
  order?: number;
  group?: string;
  groupOrder?: number;
  "ui:hidden"?: boolean;
}

export function sortJsonSchemaProperties<T extends TObject<TProperties>>(schema: T): T {
  const properties = schema.properties || {};

  // Extract property metadata
  const propertiesMetadata: PropertyWithMetadata[] = Object.entries(properties).map(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    ([key, property]: [string, any]) => ({
      key,
      order: property["ui:order"],
      group: property["ui:group"],
      groupOrder: property["ui:group:order"],
      "ui:hidden": property["ui:hidden"],
    }),
  );

  // Group properties
  const groupedProperties: { [key: string]: PropertyWithMetadata[] } = {};
  const ungroupedProperties: PropertyWithMetadata[] = [];

  propertiesMetadata.forEach((prop) => {
    if (prop.group) {
      if (!groupedProperties[prop.group]) {
        groupedProperties[prop.group] = [];
      }
      groupedProperties[prop.group].push(prop);
    } else {
      ungroupedProperties.push(prop);
    }
  });

  // remove groupedProperties having the "ui:hidden" attribute set to true
  Object.keys(groupedProperties).forEach((group) => {
    if (groupedProperties[group].some((prop) => prop["ui:hidden"])) {
      delete groupedProperties[group];
    }
  });

  // remove ungroupedProperties having the "ui:hidden" attribute set to true
  for (let i = 0; i < ungroupedProperties.length; i++) {
    if (ungroupedProperties[i]["ui:hidden"]) {
      ungroupedProperties.splice(i, 1);
      i--;
    }
  }

  // Sort groups by groupOrder
  const sortedGroups = Object.entries(groupedProperties).sort(
    ([groupNameA, propertiesA], [groupNameB, propertiesB]) => {
      const orderA = propertiesA[0]?.groupOrder;
      const orderB = propertiesB[0]?.groupOrder;

      if (orderA !== undefined && orderB !== undefined) {
        return orderA - orderB;
      }
      if (orderA !== undefined) return -1;
      if (orderB !== undefined) return 1;
      return groupNameA.localeCompare(groupNameB);
    },
  );

  // Create new properties object with sorted keys
  const sortedProperties: TProperties = {};

  // Add grouped properties first
  sortedGroups.forEach(([_, groupProperties]) => {
    groupProperties.forEach((prop) => {
      sortedProperties[prop.key] = properties[prop.key];
    });
  });

  // Add ungrouped properties
  ungroupedProperties.forEach((prop) => {
    sortedProperties[prop.key] = properties[prop.key];
  });

  // Return new schema with sorted properties
  return {
    ...schema,
    properties: sortedProperties,
  };
}
