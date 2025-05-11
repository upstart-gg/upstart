import clsx from "clsx";
import type { PropsWithChildren } from "react";

export function PanelBlockTitle({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <h3
      className={clsx(
        "text-[0.9rem] font-medium bg-gradient-to-tr from-upstart-100 to-upstart-50 dark:bg-dark-600 px-2 py-1.5 sticky top-0 z-[999] border-b border-upstart-200 dark:border-dark-500",
        className,
      )}
    >
      {children}
    </h3>
  );
}
