import type { PropsWithChildren, RefObject } from "react";
import { useBrickSettingsPopover } from "../hooks/use-brick-settings-popover";
import BrickSettingsGroupMenu from "./BrickSettingsGroupMenu";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import BrickSettingsView from "./BrickSettingsView";
import BrickPresetsView from "./BrickPresetsView";
import { Popover, Inset } from "@upstart.gg/style-system/system";

/**
 * Specific popover for brick settings with given group
 */
export default function BrickSettingsGroupPopover() {
  const { popoverElement: brickSettingsPopover } = useBrickSettingsPopover({
    Component: BrickSettingsGroupMenu,
    selector: "[data-brick-group]",
    placement: "bottom",
  });
  return brickSettingsPopover;
}

type BrickPopoverProps = PropsWithChildren<{
  brick: Brick;
  view: "settings" | "presets";
}>;

/**
 * Generic popover for brick settings
 */
export function BrickPopover({ brick, children, view }: BrickPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content
        width={view === "settings" ? "340px" : "600px"}
        maxWidth={view === "settings" ? "100%" : "100%"}
      >
        <Inset>
          {view === "settings" ? <BrickSettingsView brick={brick} /> : <BrickPresetsView brick={brick} />}
        </Inset>
      </Popover.Content>
    </Popover.Root>
  );
}
