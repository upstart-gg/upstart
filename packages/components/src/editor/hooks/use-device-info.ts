import { useMediaQuery } from "usehooks-ts";
import { useChatVisible } from "./use-editor";

export function useDeviceInfo() {
  const chatVisible = useChatVisible();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");
  const hasMinSizeWithChatVisible = useMediaQuery("(min-width: 1420px)");
  const hasMinSizeWithoutChatVisible = useMediaQuery("(min-width: 1200px)");

  return {
    isMobile,
    isTablet,
    isDesktop,
    canUseDnd: (!chatVisible && hasMinSizeWithoutChatVisible) || (chatVisible && hasMinSizeWithChatVisible),
  };
}
