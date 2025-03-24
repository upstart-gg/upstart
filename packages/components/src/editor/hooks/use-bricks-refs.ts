import { useCallback, useRef } from "react";

interface ElementRefs {
  setBrickRef: (id: string, node: HTMLElement | null) => void;
  getBrickRef: (id: string) => HTMLElement;
}

export const useBricksRefs = (): ElementRefs => {
  const elementRefs = useRef(new Map<string, HTMLElement>());

  const setBrickRef = useCallback((id: string, node: HTMLElement | null) => {
    if (node) {
      elementRefs.current.set(id, node);
    } else {
      elementRefs.current.delete(id);
    }
  }, []);

  const getBrickRef = useCallback((id: string): HTMLElement => {
    const existing = elementRefs.current.get(id);
    if (existing) {
      return existing;
    }
    const node = document.getElementById(id);
    if (!node) {
      throw new Error(`Brick with id ${id} not found`);
    }
    elementRefs.current.set(id, node);
    return node;
  }, []);

  return { setBrickRef, getBrickRef };
};
