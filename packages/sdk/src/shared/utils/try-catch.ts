type Result<T, E = Error> = [E | null, T | null];

/**
 * Try catch wrapper for async functions
 */
export async function tryCatch<T, E extends Error>(promise: Promise<T>): Promise<Result<T>> {
  try {
    return [null, await promise];
  } catch (e) {
    return [e === null ? new Error(`Error in tryCatch`) : e, null] as [E, null];
  }
}
