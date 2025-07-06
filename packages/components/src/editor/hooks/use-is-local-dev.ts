export function useIsLocalDev() {
  // Check if the current environment is a local development environment
  // This can be determined by checking the hostname or other environment variables
  return globalThis.location?.hostname === "localhost";
}
