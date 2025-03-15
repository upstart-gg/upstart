import type { EditorEvents } from "@tiptap/react";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { useDraftHelpers, useGetBrick } from "~/editor/hooks/use-editor";
import { set } from "lodash-es";

export function useTextEditorUpdateHandler(brickId: Brick["id"], propPath = "textContent") {
  const getBrick = useGetBrick();
  const helpers = useDraftHelpers();
  return (e: EditorEvents["update"]) => {
    const brick = getBrick(brickId);
    if (!brick) {
      console.warn("No brick for update found for id", brickId);
      return;
    }

    console.log("Text editor update", e, e.editor.getHTML());

    // Note: this is a weird way to update the brick props, but it'it allows us to deal with frozen trees
    const props = JSON.parse(JSON.stringify(brick?.props ?? {}));
    // `propertyChangedPath` can take the form of `a.b.c` which means we need to update `props.a.b.c`
    // For this we use lodash.set
    set(props, propPath, e.editor.getHTML());
    // Update the brick props in the store
    helpers.updateBrickProps(brickId, props);
  };
}
