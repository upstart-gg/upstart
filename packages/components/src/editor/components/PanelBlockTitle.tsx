import { tx } from "@upstart.gg/style-system/twind";
import type { PropsWithChildren } from "react";

export function PanelBlockTitle({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <h3
      className={tx(
        `text-[0.9rem] font-medium bg-gradient-to-tr
         from-upstart-100 to-upstart-50 flex items-center justify-between
         dark:from-dark-800 dark:to-dark-700
         px-2 py-1.5 sticky top-0 z-[999] border-b border-upstart-200 dark:border-dark-500 select-none`,
        className,
      )}
    >
      {children}
    </h3>
  );
}
