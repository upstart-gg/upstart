import { useEffect, useState } from "react";

/**
 * Manage state history and sync url parameters
 */
export function useHistoryState() {
  const [state, setState] = useState(() => {
    return window.history.state || {};
  });

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log("PopState event:", event);
      setState(event.state || {});
      const newUrl = new URL(window.location.href);
      Object.entries(event.state).forEach(([key, value]) => {
        newUrl.searchParams.set(key, JSON.stringify(value));
      });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const updateHistory = (newState: Record<string, unknown>) => {
    setState(newState);
    window.history.pushState(newState, "");
  };

  return { state, updateHistory };
}
