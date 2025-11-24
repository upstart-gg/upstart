import type { Datarecord } from "./types";
export * from "./types";

export function defineDataRecord<T extends Datarecord>(datarecord: T) {
  return datarecord;
}
