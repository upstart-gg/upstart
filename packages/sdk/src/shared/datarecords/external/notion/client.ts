const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export default function getClient(token: string) {
  if (!token) {
    throw new Error("Missing Notion API token");
  }

  return {
    async callApi<R, P extends Record<string, unknown> = Record<string, unknown>>(
      path: string,
      method: "GET" | "POST" | "DELETE" | "PUT" | "PATCH" = "GET",
      body: P | null = null,
    ) {
      const url = `https://api.notion.com/${path}`;
      const maxRetries = 5;
      const retryDelay = 30000; // 30 seconds

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const res = await fetch(url, {
            method,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "Notion-Version": "2022-06-28",
            },
            body: body ? JSON.stringify(body) : undefined,
          });

          // if 429 is rate limit exceeded
          if (res.status === 429 && attempt < maxRetries) {
            console.warn(
              `Notion rate limit hit (429) on attempt ${attempt}/${maxRetries}. Waiting ${retryDelay / 1000}s before retry...`,
            );
            await sleep(retryDelay);
            continue; // Retry
          }

          // for any other response (success or definitive error)
          return {
            status: res.status,
            success: res.ok,
            data: (await res.json()) as R,
          };
        } catch (error) {
          // In case of network error, we also retry except on the last attempt
          if (attempt < maxRetries) {
            console.warn(
              `Network error on attempt ${attempt}/${maxRetries}. Waiting ${retryDelay / 1000}s before retry...`,
              error,
            );
            await sleep(retryDelay);
            continue;
          }
          // On the last attempt, we rethrow the error
          console.error(`Error on attempt ${attempt}/${maxRetries}:`, error);
          throw error;
        }
      }

      // If we reach here, it means we exhausted all attempts with 429
      throw new Error(`Notion API rate limit exceeded after ${maxRetries} attempts`);
    },
  };
}
