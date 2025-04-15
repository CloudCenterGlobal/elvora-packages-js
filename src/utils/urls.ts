type Join<T extends (string | number)[]> = T extends [infer F, ...infer R]
  ? F extends string | number
    ? R extends (string | number)[]
      ? `${F}/${Join<R>}`
      : never
    : never
  : "";
export const joinPaths = <T extends (string | number)[]>(...parts: T) => {
  return parts.join("/") as Join<T>;
};
