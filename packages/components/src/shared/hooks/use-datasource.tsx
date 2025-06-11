import { createContext, useContext, useState, type ReactNode } from "react";
import type { Static, TArray, TObject } from "@sinclair/typebox";
import type { DatasourceRefSettings } from "@upstart.gg/sdk/shared/bricks/props/datasource";
import { getSchemaDefaults } from "@upstart.gg/sdk/shared/utils/schema";

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

/**
 * Uses a datasource declared in a brick manifest
 */
export function useDatasource<
  S extends DatasourceSchema | null = null,
  D extends DatasourceRefSettings = DatasourceRefSettings,
>(dsRef: D | undefined, schema: S) {
  const datasources = useDatasourceContext();

  // console.log("datasources", { datasources, dsRef });

  type DatasourceInfo = {
    datasourceId: string | null;
    data: S extends DatasourceSchema ? Static<S> : Record<string, unknown>[];
    isSample: boolean;
  };

  if (!dsRef) {
    return {
      datasourceId: null,
      data: schema !== null ? getSchemaDefaults(schema) : [],
      isSample: true,
    } as DatasourceInfo;
  }

  const data = dsRef?.id ? datasources.get(dsRef.id) : null;

  return {
    datasourceId: dsRef?.id,
    data: data ?? (schema !== null ? getSchemaDefaults(schema) : []),
    isSample: !data,
  } as DatasourceInfo;
}
