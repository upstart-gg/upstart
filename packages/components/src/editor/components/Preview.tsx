import { type ComponentProps, useEffect, useRef, useState } from "react";
import { useAttributes, usePreviewMode } from "~/editor/hooks/use-editor";
import { css } from "@emotion/css";
import { useBodyStyle } from "~/shared/hooks/use-page-style";
import styles from "./Preview.module.css";
import clsx from "clsx";

export function DeviceFrame({ children, ...props }: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const previewMode = usePreviewMode();
  const attributes = useAttributes();
  const [show, setShow] = useState<boolean | null>(false);
  const bodyClasssName = useBodyStyle({ attributes });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setShow(false);
    setTimeout(() => {
      setShow(true);
    }, 300);
  }, [previewMode]);

  return (
    <div
      ref={ref}
      className={clsx(
        // The container class is important because it simulate the device frame viewport
        "device-frame @container opacity-20 transition-all duration-200 mx-auto  overscroll-contain",
        styles[previewMode],
        {
          [styles.handled]: previewMode === "mobile",
          "!opacity-90": !show,
          "!opacity-100": show,
        },
        css({
          scrollbarColor: "var(--violet-4) var(--violet-2)",
          scrollBehavior: "smooth",
          scrollbarWidth: previewMode === "desktop" ? "thin" : "none",
          "&:hover": {
            scrollbarColor: "var(--violet-7) var(--violet-3)",
          },
        }),
        bodyClasssName,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
