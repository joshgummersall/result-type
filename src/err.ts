import * as tagged from "./tagged";

const tag = "Err";

export type T<E> = tagged.Tagged<typeof tag> & {
  value: E;
};

export const T = tagged.from(tag);

export function from<E>(value: E): T<E> {
  return tagged.from(tag, value);
}

export function is<E>(value: tagged.Tagged): value is T<E> {
  return tagged.is(value, tag);
}
