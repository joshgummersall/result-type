export type Tagged<T extends string = string> = {
  __tag: T;
};

export function from<T extends string, U>(
  tag: T,
  value: U
): Tagged<T> & { value: U } {
  return {
    __tag: tag,
    value,
  };
}

export function is<T extends string>(
  value: Tagged,
  tag: T
): value is Tagged<T> {
  return value.__tag === tag;
}
