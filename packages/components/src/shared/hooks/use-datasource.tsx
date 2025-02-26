import { createContext, useContext, useState, type ReactNode } from "react";
import type { DatasourceSettings } from "@upstart.gg/sdk/shared/bricks/props/common";

type DatasourceMap = Map<string, DatasourceSettings>;

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

export function useDatasource<P extends DatasourceSettings>(props: P) {
  const datasources = useDatasourceContext();

  console.log("useDatasource props", props);

  const data = props.id ? datasources.get(props.id) : null;

  return {
    id: props.id,
    data: data ?? props.schema,
    isSample: !data,
  } as {
    id: string;
    data: P["schema"];
    isSample: boolean;
  };
}
