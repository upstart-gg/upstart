import { useDraft } from "./use-page-data";

export function useDatarecord(datarecordId?: string) {
  const draft = useDraft();
  return draft.site.datarecords?.find((record) => record.id === datarecordId);
}

export function useDatarecords() {
  const draft = useDraft();
  return draft.site.datarecords;
}
