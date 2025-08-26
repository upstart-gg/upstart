import type React from "react";
import { useLayoutEffect, useEffect } from "react";

interface HeadInjectorProps {
  htmlContent: string;
  id?: string;
}

const HeadInjector: React.FC<HeadInjectorProps> = ({ htmlContent, id }) => {
  const uniqueId = id || `head-injector-${Math.random().toString(36).substr(2, 9)}`;

  const injectContent = () => {
    if (!htmlContent?.trim()) return () => {};

    try {
      // Clean up existing elements with same ID
      const existing = document.querySelectorAll(`[data-head-injector="${uniqueId}"]`);
      existing.forEach((el) => el.remove());

      // Parse HTML using DOMParser (available in both environments)
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<head>${htmlContent}</head>`, "text/html");

      const insertedElements: Element[] = [];

      // Insert each parsed element into document head
      Array.from(doc.head.children).forEach((child, index) => {
        const element = document.importNode(child, true);
        element.setAttribute("data-head-injector", uniqueId);
        element.setAttribute("data-head-injector-index", index.toString());
        document.head.appendChild(element);
        insertedElements.push(element);
      });

      // Return cleanup function
      return () => {
        insertedElements.forEach((el) => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      };
    } catch (error) {
      console.error("HeadInjector failed:", error);
      return () => {};
    }
  };

  // Server-side: execute immediately during render
  if (typeof window === "undefined") {
    injectContent();
  } else {
    // Client-side: use layout effect for immediate DOM update
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useLayoutEffect(() => {
      return injectContent();
    }, [htmlContent, uniqueId]);
  }

  // This component doesn't render anything visible
  return null;
};

export default HeadInjector;
