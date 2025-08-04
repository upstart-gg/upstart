import { type ComponentProps, useEffect, useRef, useState } from "react";
import { usePreviewMode } from "~/editor/hooks/use-editor";
import { tx, css } from "@upstart.gg/style-system/twind";
import { useAttributes } from "../hooks/use-page-data";

export default function DeviceFrame({ children, ...props }: ComponentProps<"div">) {
  const ref = useRef<HTMLDivElement>(null);
  const previewMode = usePreviewMode();
  const attributes = useAttributes();
  const [show, setShow] = useState<boolean | null>(false);
  // const bodyClasssName = useBodyStyle({ attributes });

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
          maxWidth: previewMode === "desktop" ? "auto" : "380px",
          minHeight: previewMode === "desktop" ? "auto" : "800px",
          height: previewMode === "desktop" ? "auto" : "94dvh",
          aspectRatio: previewMode === "desktop" ? "16/9" : "9/19.5",
          borderRadius: previewMode === "desktop" ? "0.5rem" : "24px",
          border: previewMode === "desktop" ? "4px solid #111" : "none",
          outline: previewMode === "desktop" ? "none" : "14px solid #111",
          minWidth: previewMode === "desktop" ? "1224px" : "auto",
          width: previewMode === "desktop" ? "100%" : "100%",
          // marginBlock: "auto",
          marginBottom: previewMode === "desktop" ? ".4rem" : "auto",
          marginTop: previewMode === "desktop" ? "0" : "auto",
          marginInline: previewMode === "desktop" ? ".4rem" : "auto",
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
        // bodyClasssName,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
