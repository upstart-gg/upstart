import { useEffect, useState } from "react";

interface UserConfig {
  credits: number;
  [key: string]: unknown; // Permet d'accepter d'autres propriétés
}

async function fetchConfig(): Promise<Partial<UserConfig>> {
  const url = "/editor/config";
  const result = await fetch(url);
  if (result.status === 200 && result.headers.get("content-type")?.startsWith("application/json")) {
    const data = await result.json();
    return data ?? {};
  } else {
    console.warn("useConfig: ignoring invalid response");
    return {};
  }
}

export function useUserConfig() {
  const [config, setConfig] = useState<UserConfig>({
    credits: 0,
  });
  useEffect(() => {
    async function loadConfig() {
      const fetchedConfig = await fetchConfig();
      // Merge avec les valeurs par défaut
      setConfig((prevConfig) => ({
        ...prevConfig,
        ...fetchedConfig,
      }));
    }
    const itv = setInterval(loadConfig, 10000);
    loadConfig(); // Initial load

    return () => {
      clearInterval(itv);
    };
  }, []);
  return config;
}
