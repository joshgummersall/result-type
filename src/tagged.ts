export type Tagged<T extends string = string> = {
  __tag: T;
};

export function from<T extends string>(tag: T): Tagged<T>;

export function from<T extends string, U>(
  tag: T,
  value: U
): Tagged<T> & { value: U };

export function from<T extends string, U>(
  tag: T,
  value?: U
): (Tagged<T> & { value: U }) | Tagged<T> {
  if (value) {
    return { __tag: tag, value };
  } else {
    return { __tag: tag };
  }
}

export function is<T extends string>(
  value: Tagged,
  tag: T
): value is Tagged<T> {
  return value.__tag === tag;
}
