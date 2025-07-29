import { useDraft } from "./use-page-data";

export function useDatasource(datasourceId?: string | null) {
  const draft = useDraft();
  const datasource = draft.datasources.find((ds) => ds.id === datasourceId);
  return datasource;
}

export function useDatasources() {
  const draft = useDraft();
  return draft.datasources;
}
