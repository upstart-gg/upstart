import { createContext, useContext, useState, type ReactNode } from "react";
import type { Static, TArray, TObject } from "@sinclair/typebox";
import type { DatasourceRef } from "@upstart.gg/sdk/shared/bricks/props/all";
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

export function useDatasource<D extends DatasourceRef, S extends DatasourceSchema>(dsRef: D, schema: S) {
  const datasources = useDatasourceContext();

  console.log("useDatasource dsRef: %o", dsRef);

  const data = dsRef.id ? datasources.get(dsRef.id) : null;

  return {
    id: dsRef.id,
    data: data ?? Value.Create(schema),
    isSample: !data,
  } as {
    id: string;
    data: Static<S>;
    isSample: boolean;
  };
}
