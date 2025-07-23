import { Tabs } from "@upstart.gg/style-system/system";
import type { ComponentProps } from "react";
import { tx, css } from "@upstart.gg/style-system/twind";

const tabContentScrollClass = css({
  scrollbarColor: "var(--violet-4) var(--violet-2)",
  "&:hover": {
    scrollbarColor: "var(--violet-6) var(--violet-3)",
  },
});

export function ScrollablePanelTab({ children, tab, className }: ComponentProps<"div"> & { tab: string }) {
  // same for now
  // const height = "h-full";
  const height = "h-[calc(100%-32px)]";
  // const height = "h-[calc(100dvh-60px)]";
  return (
    <Tabs.Content value={tab} className={tx(height, "@container/tab", tabContentScrollClass, className)}>
      {children}
    </Tabs.Content>
  );
}
