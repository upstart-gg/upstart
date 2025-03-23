import { mergeWith, isArray } from "lodash-es";

export function mergeIgnoringArrays<T>(target: T, ...sources: T[]): T {
  return mergeWith(target, ...sources, customizer);
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
function customizer(objValue: any, srcValue: any) {
  if (isArray(objValue)) {
    return srcValue;
  }
}
