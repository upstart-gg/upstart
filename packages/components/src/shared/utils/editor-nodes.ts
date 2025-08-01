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
