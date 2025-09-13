import { useEffect, useRef, useState, useCallback } from "react";

interface UserConfig {
  credits: number;
  [key: string]: unknown;
}

// Global state to share config across all hook instances
let globalConfig: UserConfig = { credits: 0 };
const subscribers: Set<(config: UserConfig) => void> = new Set();
let fetchPromise: Promise<void> | null = null;
let intervalId: NodeJS.Timeout | null = null;
let isInitialized = false;

async function fetchConfig(): Promise<Partial<UserConfig>> {
  const url = "/editor/config";
  try {
    const result = await fetch(url);
    if (result.status === 200 && result.headers.get("content-type")?.startsWith("application/json")) {
      const data = await result.json();
      return data ?? {};
    } else {
      console.warn("useConfig: ignoring invalid response");
      return {};
    }
  } catch (error) {
    console.error("useConfig: fetch error", error);
    return {};
  }
}

async function loadConfigGlobally(): Promise<void> {
  const fetchedConfig = await fetchConfig();

  // Update global config
  globalConfig = {
    ...globalConfig,
    ...fetchedConfig,
  };

  // Notify all subscribers
  subscribers.forEach((callback) => callback(globalConfig));
}

function startPolling(): void {
  if (intervalId) return; // Already polling

  intervalId = setInterval(() => {
    loadConfigGlobally().catch((error) => {
      console.error("useConfig: polling error", error);
    });
  }, 20000);
}

function stopPolling(): void {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

export function useUserConfig(): UserConfig {
  const [config, setConfig] = useState<UserConfig>(globalConfig);
  const subscriberRef = useRef<((config: UserConfig) => void) | null>(null);

  const updateConfig = useCallback((newConfig: UserConfig) => {
    setConfig(newConfig);
  }, []);

  useEffect(() => {
    // Create subscriber function if not exists
    if (!subscriberRef.current) {
      subscriberRef.current = updateConfig;
    }

    // Add this component as a subscriber
    subscribers.add(subscriberRef.current);

    // Initialize if this is the first subscriber
    if (!isInitialized) {
      isInitialized = true;

      // Prevent multiple simultaneous fetches
      if (!fetchPromise) {
        fetchPromise = loadConfigGlobally().finally(() => {
          fetchPromise = null;
        });
      }

      startPolling();
    }

    // Cleanup function
    return () => {
      if (subscriberRef.current) {
        subscribers.delete(subscriberRef.current);
      }

      // Stop polling if no more subscribers
      if (subscribers.size === 0) {
        stopPolling();
        isInitialized = false;
      }
    };
  }, [updateConfig]);

  return config;
}
