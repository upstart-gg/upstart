import { FiSettings, FiUser } from "react-icons/fi";
import { FaRegBell, FaSignOutAlt } from "react-icons/fa";
import {
  NavigationContainer,
  NavigationContent,
  NavList,
  useSubMenu,
  type NavigationItem,
} from "./NavigationView";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { useBrickManifest } from "~/shared/hooks/use-brick-manifest";
import type { TArray, TObject, TSchema } from "@sinclair/typebox";
import type { BrickPropCategory } from "@upstart.gg/sdk/shared/bricks/props/types";

type BrickPropsMenuProps = {
  brick: Brick;
};

export type NavItem =
  | {
      id: string;
      label: string;
      path: string;
      description?: string;
      schema: TSchema;
      metadata?: Record<string, string | number | boolean> & {
        category?: BrickPropCategory;
      };
    }
  | {
      id: string;
      label: string;
      description?: string;
      children: NavItem[];
      metadata?: Record<string, string | number | boolean> & {
        group: string;
        category?: BrickPropCategory;
      };
    };

function getNavItemsFromManifest(manifest: TObject | TArray, pathsParts: string[] = []): NavItem[] {
  const items = Object.entries<TSchema>(manifest.properties)
    .filter(([, prop]) => prop["ui:field"] !== "hidden" && prop.title)
    .map(([key, prop]) => {
      const nextPathParts = [...pathsParts, key];
      return {
        id: key,
        label: prop.title!,
        ...(prop.metadata && { metadata: prop.metadata }),
        ...(prop.description ? { description: prop.description } : {}),
        ...(prop.metadata?.group
          ? {
              children: getNavItemsFromManifest(prop as TObject, nextPathParts),
            }
          : { schema: (prop.properties ?? prop.items ?? prop) as TSchema, path: nextPathParts.join(".") }),
      };
    });
  return items;
}

export default function BrickPropsMenu({ brick }: BrickPropsMenuProps) {
  const manifest = useBrickManifest(brick.type);
  const navItems = getNavItemsFromManifest(manifest.props);

  console.dir(navItems, { compact: false });

  // Build the navigation items based on the brick manifest

  // Settings submenu items
  const settingsItems = [
    {
      id: "appearance",
      label: (
        <div className="flex items-center gap-2">
          <FiSettings className="text-blue-500" />
          <span>Appearance</span>
        </div>
      ),
      hasChildren: true,
      content: (
        <NavigationContent>
          <h4 className="text-lg font-medium mb-4">Appearance Settings</h4>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Theme</label>
              <select className="rounded border border-gray-200 p-2">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Font Size</label>
              <select className="rounded border border-gray-200 p-2">
                <option>Small</option>
                <option>Medium</option>
                <option>Large</option>
              </select>
            </div>
          </div>
        </NavigationContent>
      ),
    },
    {
      id: "notifications",
      label: (
        <div className="flex items-center gap-2">
          <FaRegBell className="text-yellow-500" />
          <span>Notifications</span>
        </div>
      ),
      hasChildren: true,
      content: (
        <NavigationContent>
          <h4 className="text-lg font-medium mb-4">Notification Settings</h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <input type="checkbox" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <span>Push Notifications</span>
              <input type="checkbox" defaultChecked />
            </div>
          </div>
        </NavigationContent>
      ),
    },
  ];

  // Root menu items
  const rootItems = [
    {
      id: "account",
      label: (
        <div className="flex items-center gap-2">
          <FiUser className="text-blue-500" />
          <span>Account</span>
        </div>
      ),
      hasChildren: true,
      content: (
        <NavigationContent>
          <div className="flex flex-col gap-4">
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                <FiUser size={32} className="text-gray-500" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Name</label>
              <input type="text" defaultValue="John Doe" className="rounded border border-gray-200 p-2" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                defaultValue="john.doe@example.com"
                className="rounded border border-gray-200 p-2"
              />
            </div>
            <button type="button" className="mt-2 p-2 bg-blue-600 text-white rounded w-full">
              Save Changes
            </button>
          </div>
        </NavigationContent>
      ),
    },
    {
      id: "settings",
      label: (
        <div className="flex items-center gap-2">
          <FiSettings className="text-gray-500" />
          <span>Settings</span>
        </div>
      ),
      hasChildren: true,
      content: <NavList items={settingsItems} />,
    },
    {
      id: "logout",
      label: (
        <div className="flex items-center gap-2">
          <FaSignOutAlt className="text-red-500" />
          <span>Logout</span>
        </div>
      ),
      onSelect: () => {
        alert("Logging out...");
      },
    },
  ];

  return <NavigationContainer rootTitle="Settings" rootItems={rootItems} />;
}
