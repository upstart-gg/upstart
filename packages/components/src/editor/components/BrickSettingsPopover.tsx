import type { PropsWithChildren } from "react";
import { useBrickSettingsPopover } from "../hooks/use-brick-settings-popover";
import BrickSettingsGroupMenu from "./BrickSettingsGroupMenu";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import BrickSettingsMenu from "./json-form/BrickSettingsMenu";
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

type BrickSettingsPopoverProps = PropsWithChildren<{
  brick: Brick;
}>;

/**
 * Generic popover for brick settings
 */
export function BrickSettingsPopover({ brick, children }: BrickSettingsPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content width="300px">
        <Inset>
          <BrickSettingsMenu brick={brick} />
        </Inset>
      </Popover.Content>
    </Popover.Root>
  );
}
