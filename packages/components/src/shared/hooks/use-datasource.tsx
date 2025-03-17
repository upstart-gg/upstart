import { createContext, useContext, useState, type ReactNode } from "react";
import type { Static, TArray, TObject } from "@sinclair/typebox";
import type { DatasourceRefSettings } from "@upstart.gg/sdk/shared/bricks/props/datasource";
import { Value } from "@sinclair/typebox/value";

type DatasourceSchema = TObject | TArray<TObject>;
type DatasourceMap = Map<string, unknown>;

const DatasourceContext = createContext<DatasourceMap | undefined>(undefined);

export function DatasourceProvider({ children }: { children: ReactNode }) {
  const [datasources] = useState<DatasourceMap>(new Map());
  return <DatasourceContext.Provider value={datasources}>{children}</DatasourceContext.Provider>;
}

function useDatasourceContext() {
  const context = useContext(DatasourceContext);
  if (!context) {
    throw new Error("useDatasourceContext must be used within a DatasourceProvider");
  }
  return context;
}

export function useDatasource<
  S extends DatasourceSchema | null = null,
  D extends DatasourceRefSettings = DatasourceRefSettings,
>(dsRef: D | undefined, schema: S) {
  const datasources = useDatasourceContext();

  console.log("datasources", { datasources, dsRef });

  if (!dsRef?.datasource) {
    return {
      datasourceId: null,
      data: schema !== null ? Value.Create(schema) : [],
      isSample: true,
    };
  }

  const data = dsRef.datasource?.id ? datasources.get(dsRef.datasource.id) : null;

  return {
    datasourceId: dsRef.datasource?.id,
    data: data ?? (schema !== null ? Value.Create(schema) : []),
    isSample: !data,
  } as {
    datasourceId: string | undefined;
    data: S extends DatasourceSchema ? Static<S> : Record<string, unknown>[];
    isSample: boolean;
  };
}
