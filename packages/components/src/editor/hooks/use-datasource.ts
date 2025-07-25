import { useDraft } from "./use-editor";
import type { TArray, TObject } from "@sinclair/typebox";

export function useDatasource(datasourceId?: string) {
  const draft = useDraft();
  const datasource = datasourceId ? draft.datasources?.[datasourceId] : null;
  const schema = datasource?.schema as TArray<TObject>;
  return {
    datasource,
    schema,
    error: datasourceId && !datasource ? new Error(`Datasource ${datasourceId} not found`) : null,
  };
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
