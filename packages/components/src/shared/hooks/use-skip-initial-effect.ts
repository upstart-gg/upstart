import { useCallback, useEffect, useRef, type DependencyList, type EffectCallback } from "react";

/**
 * A custom hook that skips the initial effect execution, similar to useEffect
 * but only runs on subsequent dependency changes, not on the first render.
 *
 * @param callback - The effect callback function to execute
 * @param dependencies - The dependency array to watch for changes
 */
function useSkipInitialEffect(callback: EffectCallback, dependencies: DependencyList) {
  const isFirstRender = useRef(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedCallback = useCallback(callback, dependencies);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    return memoizedCallback();
  }, [memoizedCallback]);
}

export { useSkipInitialEffect };
