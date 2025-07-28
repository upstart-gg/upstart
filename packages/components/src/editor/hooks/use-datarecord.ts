import { useDraft } from "./use-editor";

export function useDatarecord(datarecordId?: string) {
  const draft = useDraft();
  return draft.datarecords?.find((record) => record.id === datarecordId);
}

export function useDatarecords() {
  const draft = useDraft();
  return draft.datarecords;
}
