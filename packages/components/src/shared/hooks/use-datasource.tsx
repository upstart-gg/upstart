import { createContext, useContext, useState, type ReactNode } from "react";
import type { Static, TArray, TObject } from "@sinclair/typebox";
import type { DatasourceRef } from "@upstart.gg/sdk/shared/bricks/props/datasource";
import { Value } from "@sinclair/typebox/value";
import { datasource } from "@upstart.gg/sdk/shared/bricks/manifests/images-wall.manifest";

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
  D extends DatasourceRef = DatasourceRef,
  S extends DatasourceSchema | null = null,
>(dsRef: D | undefined, schema: S = null as S) {
  const datasources = useDatasourceContext();

  if (!dsRef) {
    return {
      datasourceId: null,
      data: schema !== null ? Value.Create(schema) : [],
      isSample: true,
    };
  }

  const data = dsRef.id ? datasources.get(dsRef.id) : null;

  return {
    datasourceId: dsRef.id,
    data: data ?? (schema !== null ? Value.Create(schema) : []),
    isSample: !data,
  } as {
    datasourceId: string;
    data: S extends DatasourceSchema ? Static<S> : Record<string, unknown>[];
    isSample: boolean;
  };
}
