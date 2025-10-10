import type { Theme } from "@upstart.gg/sdk/shared/themes/theme";
import { css, tx } from "@upstart.gg/style-system/twind";
import { useEffect, useRef, useState } from "react";

export default function ThemesPreviewList({ themes }: { themes: Theme[] }) {
  const [themeIndex, setThemeIndex] = useState(0);
  const conicRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = themes[themeIndex];

  useEffect(() => {
    containerRef.current?.style.setProperty("background-color", theme.colors.base200);
    // containerRef.current?.style.setProperty("color", theme.colors.baseContent);
    conicRef.current?.style.setProperty(
      "background-image",
      `conic-gradient(from 0deg, ${theme.colors.primary}, ${theme.colors.secondary}, ${theme.colors.accent}, ${theme.colors.primary})`,
    );
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className={tx(
        "w-full flex justify-center items-center h-full relative overflow-hidden animate-background bg-size[400%] opacity-50",
      )}
    >
      <div ref={conicRef} className={tx("absolute w-[100vh] h-[100vh] inset-0 animate-spin-blob z-20")} />
      <div
        className={tx(
          "rounded-full absolute backdrop-blur-3xl inset-0 scale-150 bg-white/40 z-50 flex items-center justify-center",
          css({
            textShadow: `0 0 3px rgba(0, 0, 0, 0.3)`,
            color: "#FFFFFF",
            fontSize: "1.2rem",
            fontWeight: "bold",
            transition: "color 0.3s ease, background-color 0.3s ease",
          }),
        )}
      >
        {theme.name}
      </div>
    </div>
  );
}
