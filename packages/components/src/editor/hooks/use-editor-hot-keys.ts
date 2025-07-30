import { useHotkeys } from "react-hotkeys-hook";
import { useEditorHelpers, usePreviewMode, useSelectedBrickId, useSelectedSectionId } from "./use-editor";
import { toast } from "@upstart.gg/style-system/system";
import { useBrick, useDraft, useDraftHelpers, useDraftUndoManager } from "./use-page-data";

export function useEditorHotKeys() {
  const editorHelpers = useEditorHelpers();
  const draftHelpers = useDraftHelpers();
  const draft = useDraft();
  const previewMode = usePreviewMode();
  const selectedBrickId = useSelectedBrickId();
  const selectedSectionId = useSelectedSectionId();
  const selectedBrick = useBrick(selectedBrickId);
  const { undo, redo } = useDraftUndoManager();

  useHotkeys("esc", () => {
    editorHelpers.deselectBrick();
    editorHelpers.setSelectedSectionId();
    editorHelpers.hidePanel();
  });

  useHotkeys("mod+c", () => {
    // let the browser handle the copy event
    const sel = window.getSelection();
    if (!sel?.rangeCount) {
      console.debug("mod+c pressed");
    }
  });

  useHotkeys(["backspace", "del"], (e) => {
    if (selectedBrickId) {
      e.preventDefault();
      draftHelpers.deleteBrick(selectedBrickId);
      editorHelpers.deselectBrick(selectedBrickId);
      editorHelpers.hidePanel("inspector");
    }
  });

  useHotkeys("s", (e) => {
    e.preventDefault();
    editorHelpers.togglePanel("settings");
  });

  useHotkeys("l", (e) => {
    e.preventDefault();
    editorHelpers.togglePanel("library");
  });

  useHotkeys("t", (e) => {
    e.preventDefault();
    editorHelpers.togglePanel("theme");
  });

  useHotkeys("p", (e) => {
    e.preventDefault();
    editorHelpers.togglePanel();
  });

  // Undo
  useHotkeys(["mod+z", "ctrl+z"], (e) => {
    e.preventDefault();
    undo();
  });

  // Redo
  useHotkeys(["mod+shift+z", "ctrl+shift+z"], (e) => {
    e.preventDefault();
    redo();
  });

  /**
   * Move brick to the left or up within a container
   */
  useHotkeys(
    ["mod+up", "mod+left"],
    (e) => {
      e.preventDefault();
      if (selectedBrickId) {
        // console
        console.log("Moving %s up", selectedBrickId);
        draftHelpers.moveBrickWithin(selectedBrickId, "previous");
      } else if (selectedSectionId) {
        console.log("Moving section %s up", selectedSectionId);
        draftHelpers.moveSectionUp(selectedSectionId);
        const element = document.getElementById(selectedSectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    },
    {
      enableOnContentEditable: true,
    },
  );

  useHotkeys(
    ["mod+down", "mod+right"],
    (e) => {
      e.preventDefault();
      if (selectedBrickId) {
        // console
        console.log("Moving %s to right", selectedBrickId);
        draftHelpers.moveBrickWithin(selectedBrickId, "next");
      } else if (selectedSectionId) {
        console.log("Moving section %s down", selectedSectionId);
        draftHelpers.moveSectionDown(selectedSectionId);
        const element = document.getElementById(selectedSectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    },
    {
      enableOnContentEditable: true,
    },
  );

  // mod+d to duplicate the selected brick
  useHotkeys("mod+d", (e) => {
    e.preventDefault();
    if (selectedBrickId) {
      draftHelpers.duplicateBrick(selectedBrickId);
      toast("Brick duplicated", {
        id: "duplicate-brick",
      });
    }
  });

  useHotkeys("mod+j", (e) => {
    e.preventDefault();
    editorHelpers.toggleEditorEnabled();
  });

  useHotkeys("mod+g", (e) => {
    e.preventDefault();
    console.log("Debugging draft:");
    const { sections, themes, siteAttr, sitemap, attr, brickMap } = draft;
    console.log({ sections, themes, siteAttr, sitemap, attr, brickMap });
  });

  useHotkeys(
    "space",
    (e) => {
      console.log("space pressed", e);

      const target = e.target as HTMLElement;
      if (target.classList.contains("tiptap")) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (selectedBrick) {
        draftHelpers.updateBrickProps(
          selectedBrick.id,
          {
            grow: !selectedBrick.props.grow,
          },
          previewMode === "mobile",
        );
      }
    },
    {
      enableOnContentEditable: true,
    },
  );
}
