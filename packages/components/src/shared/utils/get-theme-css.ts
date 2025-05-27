import type { Theme } from "@upstart.gg/sdk/shared/theme";
import { generateColorsVars } from "@upstart.gg/sdk/shared/themes/color-system";

export function getThemeCss(theme: Theme) {
  const shades = generateColorsVars(theme);
  const injected = `@layer upstart-theme {
    :root {
      color-scheme: ${theme.browserColorScheme};
      /* cache buster */
      --rnd: ${Date.now()};
      ${Object.entries(shades)
        .map(([key, value]) => `--${key}: ${value};`)
        .join("\n")}
    }
  }`;
  return injected;
}
