import type { DatasourcesMap, DatasourceProvider } from "./datasources/types";
import { schemasMap } from "./datasources/schemas";

export function defineDataSources(datasources: DatasourcesMap) {
  const datasourcesMapped: DatasourcesMap = {};
  for (const [key, value] of Object.entries(datasources)) {
    datasourcesMapped[key] = {
      ...value,
      // @ts-ignore Seems like TS can't infer properly here
      schema: "schema" in value ? value.schema : getSchemaByProvider(value.provider),
    };
  }
  return datasourcesMapped;
}

function getSchemaByProvider(provider: DatasourceProvider) {
  return schemasMap[provider];
}
