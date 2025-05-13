import { type ComponentProps, useEffect, useRef, useState } from "react";
import { useAttributes, usePreviewMode } from "~/editor/hooks/use-editor";
import { useBodyStyle } from "~/shared/hooks/use-page-style";
import { tx, css } from "@upstart.gg/style-system/twind";

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
      id="device-frame"
      ref={ref}
      className={tx(
        // The container class is important because it simulate the device frame viewport
        "@container relative transition-all duration-300 overscroll-contain overflow-y-auto",
        // styles[previewMode],
        {
          "!opacity-90": !show,
          "!opacity-100": show,
        },
        css({
          maxHeight: previewMode === "desktop" ? "auto" : "800px",
          maxWidth: previewMode === "desktop" ? "100%" : "380px",
          minHeight: previewMode === "desktop" ? "auto" : "800px",
          height: previewMode === "desktop" ? "auto" : "94dvh",
          aspectRatio: previewMode === "desktop" ? "16/9" : "9/19.5",
          borderRadius: previewMode === "desktop" ? "0.5rem" : "24px",
          border: previewMode === "desktop" ? "8px solid rgba(0 0 0 / 0.2)" : "none",
          outline: previewMode === "desktop" ? "none" : "14px solid #000",
          width: previewMode === "desktop" ? "100%" : "100%",
          // marginBlock: "auto",
          marginBottom: previewMode === "desktop" ? "0.75rem" : "auto",
          marginTop: previewMode === "desktop" ? "0" : "auto",
          marginInline: previewMode === "desktop" ? "1rem" : "auto",
          boxShadow:
            previewMode === "desktop"
              ? "1px solid rgba(0, 0, 0, 0.15)"
              : "0 0.5em 2em 0.2em rgba(0, 0, 0, 0.33), inset 0 0 0 0.5px #000",
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
