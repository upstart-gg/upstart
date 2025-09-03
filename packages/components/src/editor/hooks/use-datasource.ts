import { useDraft } from "./use-page-data";

export function useDatasource(id?: string | null) {
  const draft = useDraft();
  const datasource = draft.site.datasources.find((ds) => ds.id === id);
  return datasource;
}

export function useDatasources() {
  const draft = useDraft();
  return draft.site.datasources;
}

export function useDatasourceSamples(id?: string | null): Record<string, unknown>[] | undefined {
  const datasource = useDatasource(id);
  return datasource?.schema?.examples;
}
