import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

/**
 * A hook to track how many times a callout has been viewed
 *
 * @param name the name of the callout
 * @param threshold consider a callout viewed if it has been viewed this many times
 */
export const useCalloutViewCounter = (name: string, threshold = 5) => {
  const [viewCount, setViewCount] = useLocalStorage<number>(`callout-${name}`, 0);

  const increment = () => {
    setViewCount((prev) => prev + 1);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (viewCount <= threshold) increment();
  }, []);

  return {
    viewCount,
    increment,
    viewed: viewCount >= threshold,
    shouldDisplay: viewCount < threshold,
  };
};
