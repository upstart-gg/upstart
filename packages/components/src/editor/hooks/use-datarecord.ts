import type { AnySchemaObject } from "@upstart.gg/sdk/shared/ajv";
import { useMemo } from "react";
import { useDraft } from "./use-editor";

// Interface temporaire pour accéder à la propriété schema
interface DatarecordWithSchema {
  schema?: unknown;
}

export function useDatarecord(datarecordId?: string) {
  const draft = useDraft();

  const datarecord = useMemo(() => {
    if (!datarecordId || !draft.datarecords) {
      return null;
    }
    return draft.datarecords[datarecordId] || null;
  }, [datarecordId, draft.datarecords]);

  const schema = useMemo(() => {
    if (!datarecord) {
      return null;
    }
    // Cast vers une interface temporaire pour accéder à la propriété schema
    const datarecordWithSchema = datarecord as DatarecordWithSchema;
    const schemaData = datarecordWithSchema.schema;
    if (!schemaData) {
      return null;
    }
    // Le schema est déjà dans l'objet datarecord
    return typeof schemaData === "string" ? JSON.parse(schemaData) : schemaData;
  }, [datarecord]);

  return {
    datarecord,
    schema: schema as AnySchemaObject | null,
    isLoading: false, // Vous pouvez ajouter une logique de loading si nécessaire
    error: datarecordId && !datarecord ? new Error(`Datarecord ${datarecordId} not found`) : null,
  };
}

export function useDatarecords() {
  const draft = useDraft();

  const datarecords = useMemo(() => {
    return draft.datarecords ? Object.values(draft.datarecords) : [];
  }, [draft.datarecords]);

  const options = useMemo(() => {
    return datarecords.map((record) => ({
      value: record.id,
      label: record.label,
    }));
  }, [datarecords]);

  return {
    datarecords,
    options,
  };
}
