import { useEffect, useState } from "react";

async function fetchCredits() {
  const url = "/editor/config";
  const result = await fetch(url);
  if (result.status === 200 && result.headers.get("content-type") === "application/json") {
    const data = await result.json();
    return (data?.credits as number) ?? 0;
  } else {
    console.warn("useCredits: ignoring invalid response");
    return 0;
  }
}

export function useCredits() {
  const [credits, setCredits] = useState(0);
  useEffect(() => {
    async function loadCredits() {
      const credits = await fetchCredits();
      setCredits(credits);
    }
    const itv = setInterval(loadCredits, 10000);
    loadCredits(); // Initial load

    return () => {
      clearInterval(itv);
    };
  }, []);
  return credits;
}
