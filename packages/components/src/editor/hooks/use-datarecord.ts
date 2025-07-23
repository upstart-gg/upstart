import { useDraft } from "./use-editor";
import type { TObject } from "@sinclair/typebox";

export function useDatarecord(datarecordId?: string) {
  const draft = useDraft();
  const datarecord = datarecordId ? draft.datarecords?.[datarecordId] : null;
  const schema = datarecord?.schema as TObject | null;
  return {
    datarecord,
    schema,
    error: datarecordId && !datarecord ? new Error(`Datarecord ${datarecordId} not found`) : null,
  };
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
