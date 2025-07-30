import { useDraft } from "./use-page-data";

export function useDatasource(id?: string | null) {
  const draft = useDraft();
  const datasource = draft.datasources.find((ds) => ds.id === id);
  return datasource;
}

export function useDatasources() {
  const draft = useDraft();
  return draft.datasources;
}
