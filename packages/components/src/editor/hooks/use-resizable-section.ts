import interact from "interactjs";
import type { Section as SectionType } from "@upstart.gg/sdk/bricks";
import { useEffect, useRef } from "react";
import { invariant } from "@upstart.gg/sdk/utils";
import { useDraftHelpers } from "../hooks/use-page-data";

export function useResizableSection(section: SectionType) {
  // Use interact.js to allow resizing a section manually
  const interactable = useRef<Interact.Interactable | null>(null);
  const draftHelpers = useDraftHelpers();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const sectionEl = document.getElementById(section.id);

    invariant(sectionEl, "Section element not found");

    interactable.current = interact(`#${section.id}`);
    const resizable = interactable.current.resizable({
      edges: {
        top: false,
        left: false,
        bottom: ".section-resizable-handle",
        right: false,
      },
      inertia: true,
      autoScroll: false,
      listeners: {
        start: (event) => {
          event.stopPropagation();
        },
        move: (event) => {
          event.stopPropagation();

          const h = sectionEl.dataset.h ? parseFloat(sectionEl.dataset.h) : sectionEl.offsetHeight;
          const newHeight = h + event.delta.y;

          requestAnimationFrame(() => {
            Object.assign(sectionEl.style, {
              minHeight: `${newHeight}px`,
              // maxHeight: `${newHeight}px`,
              flex: "none",
            });
          });

          Object.assign(sectionEl.dataset, { h: newHeight });
        },
        end: (event) => {
          const minHeight = `${parseFloat(sectionEl.dataset.h as string).toFixed(0)}px`;
          sectionEl.style.removeProperty("minHeight");
          sectionEl.style.removeProperty("height");
          sectionEl.style.removeProperty("maxHeight");
          sectionEl.style.removeProperty("flex");
          sectionEl.dataset.h = "";
          console.log("Resized section", section.id, "to height", minHeight);
          draftHelpers.updateSectionProps(section.id, {
            minHeight,
          });
        },
      },
    });
    // DO NOT REMOVE
    // IMPORTANT: This prevents the default click event from propagating and
    // causing selection of elements like the section itself or other bricks
    resizable.on("resizeend", function () {
      window.addEventListener("click", (ev) => ev.stopImmediatePropagation(), {
        capture: true,
        once: true,
      });
    });
    // END OF DO NOT REMOVE
    return () => {
      interactable.current?.unset();
      interactable.current = null;
    };
  }, []);
}
