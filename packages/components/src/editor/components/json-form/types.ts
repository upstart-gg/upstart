import type { BrickPropCategory, TSchema } from "@upstart.gg/sdk/shared/bricks/props/types";

export type NavItemProperty = {
  id: string;
  path: string;
  label: string;
  description?: string;
  schema: TSchema;
  metadata?: Record<string, string | number | boolean> & {
    category?: BrickPropCategory;
  };
  children?: never;
};

export type NavItemGroup = {
  id: string;
  path: string;
  label: string;
  description?: string;
  children: NavItem[];
  schema?: never;
  metadata: Record<string, string | number | boolean> & {
    group: string;
    category?: BrickPropCategory;
  };
};

export type NavItem = NavItemProperty | NavItemGroup;
