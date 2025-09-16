import type { Datarecord } from "./datarecords/types";

export function defineDataRecord<T extends Datarecord>(datarecord: T) {
  return datarecord;
}
