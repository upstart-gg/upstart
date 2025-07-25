import { useDraft } from "./use-editor";

export function useDatasource(datasourceId?: string) {
  const draft = useDraft();
  const datasource = datasourceId ? draft.datasources?.[datasourceId] : null;
  return datasource ?? null;
}

export function useDatasources() {
  const draft = useDraft();
  const datasources = Object.values(draft.datasources ?? {});
  const options = datasources.map((source) => ({
    value: source.id,
    label: source.name,
  }));
  return {
    datasources,
    options,
  };
}
