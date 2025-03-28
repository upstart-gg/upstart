import type { PropsWithChildren } from "react";
import type { Section } from "@upstart.gg/sdk/shared/bricks";
import { Popover, Inset } from "@upstart.gg/style-system/system";
import SectionSettingsView from "./SectionSettingsView";

/**
 * Specific popover for Section settings with given group
 */
// export default function BrickSettingsGroupPopover() {
//   const { popoverElement: brickSettingsPopover } = useBrickSettingsPopover({
//     Component: BrickSettingsGroupMenu,
//     selector: "[data-brick-group]",
//     placement: "bottom",
//   });
//   return brickSettingsPopover;
// }

type SectionPopoverProps = PropsWithChildren<{
  section: Section;
  view: "settings" | "presets";
}>;

export default function SectionPopover({ section, children, view }: SectionPopoverProps) {
  return (
    <Popover.Root>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Anchor />
      <Popover.Content
        sideOffset={8}
        alignOffset={8}
        width={view === "settings" ? "340px" : "600px"}
        maxWidth={view === "settings" ? "100%" : "100%"}
      >
        <Inset>
          <SectionSettingsView section={section} />
        </Inset>
      </Popover.Content>
    </Popover.Root>
  );
}
