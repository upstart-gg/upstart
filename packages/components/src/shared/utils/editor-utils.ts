import type { Fragment } from "@tiptap/pm/model";
import type { Content, Editor } from "@tiptap/react";

export function getEditorNodeFromField(field: string) {
  return [
    {
      type: "mention",
      attrs: { "data-id": field, label: field },
    },
    {
      type: "text",
      text: ` `,
    },
  ];
}

export function insertInEditor(editor: Editor, content: Content | Node | Fragment) {
  console.log("Inserting content %s", content);
  editor
    .chain()
    .insertContent(content, {
      parseOptions: {
        preserveWhitespace: "full",
      },
    })
    .run();
}
