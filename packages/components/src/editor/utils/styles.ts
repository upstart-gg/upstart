import { css } from "@upstart.gg/style-system/twind";

/**
 * Used for panels that have a scrollbar
 */
export const panelTabContentScrollClass = css({
  scrollbarColor: "var(--violet-4) var(--violet-2)",
  scrollBehavior: "smooth",
  scrollbarWidth: "thin",
  "&:hover": {
    scrollbarColor: "var(--violet-6) var(--violet-3)",
  },
});
