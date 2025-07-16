import { isStandardColor } from "@upstart.gg/sdk/shared/themes/color-system";
import { css } from "@upstart.gg/style-system/twind";
import { usePageContext } from "../hooks/use-page-context";

/**
 * Hook to get the page text color style
 * This returns the text color that should be used for elements that need to inherit the page's text color
 */
export function usePageTextColor() {
  try {
    const { attributes } = usePageContext();

    return isStandardColor(attributes.$textColor)
      ? css({ color: attributes.$textColor as string })
      : (attributes.$textColor as string);
  } catch {
    // If we're not within a PageProvider, return empty string (no color override)
    return "";
  }
}
