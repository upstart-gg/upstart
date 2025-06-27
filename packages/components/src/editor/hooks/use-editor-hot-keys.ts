import { useHotkeys } from "react-hotkeys-hook";
import { useDraft, useDraftHelpers, useEditorHelpers, useSelectedBrickId } from "./use-editor";
import { toast } from "@upstart.gg/style-system/system";

export function useEditorHotKeys() {
  const editorHelpers = useEditorHelpers();
  const draftHelpers = useDraftHelpers();
  const draft = useDraft();
  const selectedBrickId = useSelectedBrickId();

  useHotkeys("esc", () => {
    editorHelpers.deselectBrick();
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

  /**
   * Move brick left within a container
   * @todo
   */
  useHotkeys("mod+left", (e) => {
    e.preventDefault();
    if (selectedBrickId) {
      // console
      console.log("Moving %s to left", selectedBrickId);
      draftHelpers.moveBrickWithin(selectedBrickId, "left");
    }
  });
  /**
   * Move brick right within a container
   * @todo
   */
  useHotkeys("mod+right", (e) => {
    e.preventDefault();
    if (selectedBrickId) {
      // console
      console.log("Moving %s to right", selectedBrickId);
      draftHelpers.moveBrickWithin(selectedBrickId, "right");
    }
  });

  // mod+d to duplicate the selected brick
  useHotkeys("mod+d", (e) => {
    e.preventDefault();
    if (selectedBrickId) {
      draftHelpers.duplicateBrick(selectedBrickId);
      toast("Brick duplicated");
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
}
