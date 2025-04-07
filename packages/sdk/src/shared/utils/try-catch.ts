type Result<T = unknown, E extends Error = Error> = [null, T] | [E, null];

/**
 * Try catch wrapper for async functions
 */
export async function tryCatch<T, E extends Error = Error>(promise: Promise<T>): Promise<Result<T, E>> {
  try {
    return [null, await promise];
  } catch (e) {
    return [e instanceof Error ? e : new Error(`Error in tryCatch: ${e}`), null] as Result<T, E>;
  }
}
