import { Tabs } from "@upstart.gg/style-system/system";
import type { ComponentProps } from "react";
import { css } from "@emotion/css";
import clsx from "clsx";

const tabContentScrollClass = css({
  scrollbarColor: "var(--violet-4) var(--violet-2)",
  scrollBehavior: "smooth",
  scrollbarWidth: "thin",
  "&:hover": {
    scrollbarColor: "var(--violet-6) var(--violet-3)",
  },
});

export function ScrollablePanelTab({ children, tab, className }: ComponentProps<"div"> & { tab: string }) {
  return (
    <Tabs.Content
      value={tab}
      className={clsx("h-[calc(100dvh-99px)] overflow-y-auto", tabContentScrollClass, className)}
    >
      {children}
    </Tabs.Content>
  );
}
