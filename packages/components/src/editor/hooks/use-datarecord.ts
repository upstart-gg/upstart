import { useDraft } from "./use-editor";

export function useDatarecord(datarecordId?: string) {
  const draft = useDraft();
  const datarecord = datarecordId ? draft.datarecords?.[datarecordId] : null;
  return datarecord ?? null;
}

export function useDatarecords() {
  const draft = useDraft();
  const datarecords = Object.values(draft.datarecords ?? {});
  const options = datarecords.map((record) => ({
    value: record.id,
    label: record.label,
  }));
  return {
    datarecords,
    options,
  };
}
