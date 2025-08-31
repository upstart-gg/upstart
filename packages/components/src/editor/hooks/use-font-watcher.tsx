import { useEffect } from "react";
import { useDraft } from "./use-page-data";
import type { Theme } from "@upstart.gg/sdk/shared/theme";

/**
 * Watch for changes in the configured font families and update the page with needed styles.
 */
export function useFontWatcher() {
  const draft = useDraft();
  const themeUsed = draft.previewTheme ?? draft.site.theme;
  useEffect(() => {
    buildHtmlHeadLinks();
    updateLinks(themeUsed.typography);
  }, [themeUsed.typography]);
  return themeUsed.typography;
}

function updateLinks(typography: Theme["typography"]) {
  for (const font of ["body", "heading"] as const) {
    // if we have a google font, we need to load the font
    if (typography[font].type === "google") {
      const linkElement = document.getElementById(`stylesheet-font-${font}`) as HTMLLinkElement;
      linkElement.href = `https://fonts.googleapis.com/css2?family=${typography[font].family.replace(
        / /g,
        "+",
      )}&display=swap`;
    }
  }
}

function buildHtmlHeadLinks() {
  for (const font of ["body", "heading"]) {
    const id = `stylesheet-font-${font}`;

    // always clean up the previous font link
    if (document.getElementById(id)) {
      document.getElementById(id)?.remove();
    }

    const linkElementBody = document.createElement("link");
    linkElementBody.rel = "stylesheet";
    linkElementBody.id = id;
    document.head.appendChild(linkElementBody);
  }
}
