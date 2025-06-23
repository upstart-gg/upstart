import { useEffect, useState } from "react";

export function useKeyPressed(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey || (targetKey === "Meta" && (event.metaKey || event.ctrlKey))) {
        setKeyPressed(true);
      }
    };

    const upHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey || (targetKey === "Meta" && !event.metaKey && !event.ctrlKey)) {
        setKeyPressed(false);
      }
    };

    const blurHandler = () => {
      setKeyPressed(false);
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    window.addEventListener("blur", blurHandler);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
      window.removeEventListener("blur", blurHandler);
    };
  }, [targetKey]);

  return keyPressed;
}

export function useCmdOrCtrlPressed(): boolean {
  return useKeyPressed("Meta");
}
