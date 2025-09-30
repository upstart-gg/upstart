import { useCallback, useEffect, useRef, type DependencyList } from "react";

type DebounceOptions = {
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export function useDebounceCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: DependencyList = [],
  options: DebounceOptions = {},
): T {
  const { leading = false, trailing = true, maxWait } = options;

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxWaitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastCallTimeRef = useRef<number>(0);
  const lastInvokeTimeRef = useRef<number>(0);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const argsRef = useRef<any[]>([]);
  const callbackRef = useRef(callback);

  // Update callback ref when dependencies change
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback, ...deps]);

  // Clear timeouts when dependencies change or on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (maxWaitTimeoutRef.current) {
        clearTimeout(maxWaitTimeoutRef.current);
      }
    };
  }, deps);

  const invokeFunction = useCallback(() => {
    const args = argsRef.current;
    const time = Date.now();
    lastInvokeTimeRef.current = time;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (maxWaitTimeoutRef.current) {
      clearTimeout(maxWaitTimeoutRef.current);
      maxWaitTimeoutRef.current = null;
    }

    return callbackRef.current(...args);
  }, []);

  const debouncedCallback = useCallback(
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    (...args: any[]) => {
      const time = Date.now();
      const timeSinceLastCall = time - lastCallTimeRef.current;
      const timeSinceLastInvoke = time - lastInvokeTimeRef.current;

      lastCallTimeRef.current = time;
      argsRef.current = args;

      // Leading edge
      if (leading && timeSinceLastCall >= delay) {
        return invokeFunction();
      }

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set up maxWait timeout if specified
      if (maxWait !== undefined && !maxWaitTimeoutRef.current) {
        const timeUntilMaxWait = maxWait - timeSinceLastInvoke;
        if (timeUntilMaxWait > 0) {
          maxWaitTimeoutRef.current = setTimeout(() => {
            maxWaitTimeoutRef.current = null;
            invokeFunction();
          }, timeUntilMaxWait);
        }
      }

      // Trailing edge
      if (trailing) {
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
          invokeFunction();
        }, delay);
      }
    },
    [delay, leading, trailing, maxWait, invokeFunction],
  ) as T;

  return debouncedCallback;
}

// Example usage:
// const debouncedSearch = useDebounceCallback(
//   (query: string) => {
//     console.log('Searching for:', query, 'with filter:', filter);
//   },
//   500,
//   [filter] // Refresh when filter changes
// );
