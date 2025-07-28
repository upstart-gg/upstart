import { useDraft } from "./use-editor";

export function useDatasource(datasourceId?: string) {
  const draft = useDraft();
  const datasource = draft.datasources.find((ds) => ds.id === datasourceId);
  return datasource;
}

export function useDatasources() {
  const draft = useDraft();
  return draft.datasources;
}
