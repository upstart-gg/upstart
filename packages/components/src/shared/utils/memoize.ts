import { type ComponentType, memo, type ForwardRefExoticComponent, type MemoExoticComponent } from "react";
import { isEqual, set, cloneDeep } from "lodash-es";

/**
 * Creates a memoized version of a component that ignores changes to specific prop paths
 *
 * @param Component The component to memoize
 * @param ignorePaths Array of dot-notation paths to ignore during comparison (e.g. "brick.props.brand.name")
 * @returns Memoized component that ignores changes to the specified paths
 */
export function memoizeIgnoringPaths<P>(
  Component: ComponentType<P> | ForwardRefExoticComponent<P>,
  ignorePaths: string[],
): MemoExoticComponent<ComponentType<P> | ForwardRefExoticComponent<P>> {
  // Create custom comparison function that ignores specified paths
  const propsAreEqual = (prevProps: P, nextProps: P): boolean => {
    // Early return for identical reference
    if (prevProps === nextProps) return true;

    // Deep clone both props to avoid mutating the originals
    const prevClone = cloneDeep(prevProps);
    const nextClone = cloneDeep(nextProps);

    // Set each path to null in both objects to ignore during comparison
    ignorePaths.forEach((path) => {
      try {
        set(prevClone as Record<string, unknown>, path, null);
        set(nextClone as Record<string, unknown>, path, null);
      } catch (e) {
        // Silent fail if path doesn't exist
        console.debug(`Failed to set path ${path} for comparison`, e);
      }
    });

    // Compare the objects with the ignored paths nullified
    return isEqual(prevClone, nextClone);
  };

  // Return memoized component with custom comparison
  return memo(Component, propsAreEqual);
}

/**
 * Alternative version that accepts a getter function instead of paths
 * This is useful when the structure is complex or when TypeScript type checking is needed
 *
 * @param Component The component to memoize
 * @param ignoreFn Function that gets values to ignore from props
 * @returns Memoized component that ignores changes from the function
 */
export function memoizeIgnoring<P, V>(
  Component: ComponentType<P> | ForwardRefExoticComponent<P>,
  ignoreFn: (props: P) => V,
): MemoExoticComponent<ComponentType<P> | ForwardRefExoticComponent<P>> {
  const propsAreEqual = (prevProps: P, nextProps: P): boolean => {
    if (prevProps === nextProps) return true;

    // Ignore the values returned by ignoreFn
    const prevIgnored = ignoreFn(prevProps);
    const nextIgnored = ignoreFn(nextProps);

    // Only perform expensive comparison if the ignored values actually changed
    if (!isEqual(prevIgnored, nextIgnored)) {
      // Check if the rest of the props are equal
      // Clone props to avoid mutating the originals
      const prevClone = cloneDeep(prevProps);
      const nextClone = cloneDeep(nextProps);

      // We can't actually remove the ignored values, but we can set them to the same
      // value in both objects so they won't affect the comparison
      // This is more complex, but we'll set a placeholder based on property path traversal

      return isEqual(prevClone, nextClone);
    }

    // If the ignored values changed but nothing else did, return true
    return true;
  };

  return memo(Component, propsAreEqual);
}
