import { Popover } from "@upstart.gg/style-system/system";
import type { Editor } from "@tiptap/react";
import type { PropsWithChildren } from "react";
import { useLoopAlias } from "~/editor/hooks/use-page-data";
import { getEditorNodeFromField, insertInEditor } from "../utils/editor-utils";
import DatasourceFieldPickerModal from "./DatasourceFieldPickerModal";

export function DatasourceItemButton({
  editor,
  brickId,
  children,
  onFieldClick,
}: PropsWithChildren<{ editor?: Editor | null; brickId: string; onFieldClick?: (field: string) => void }>) {
  const queryAlias = useLoopAlias(brickId);
  const onFieldSelect = (field: string) => {
    onFieldClick?.(field);

    if (!editor) {
      return;
    }

    const content = getEditorNodeFromField(field);
    insertInEditor(editor, content);
  };

  return (
    <Popover.Root>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content minWidth="260px" side="top" align="start" size="2" maxHeight="70dvh" sideOffset={10}>
        <DatasourceFieldPickerModal onFieldSelect={onFieldSelect} brickId={brickId} onlyAlias={queryAlias} />
      </Popover.Content>
    </Popover.Root>
  );
}
