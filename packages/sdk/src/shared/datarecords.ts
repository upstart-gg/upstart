import type { DatarecordsList } from "./datarecords/types";

export function defineDataRecords<T extends DatarecordsList>(datarecords: T) {
  return datarecords;
}
