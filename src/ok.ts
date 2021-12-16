import * as tagged from "./tagged";

const tag = "Ok";

export type T<O> = tagged.Tagged<typeof tag> & {
  value: O;
};

export const T = tagged.from(tag);

export function from<O>(value: O): T<O> {
  return tagged.from(tag, value);
}

export function is<U>(value: tagged.Tagged): value is T<U> {
  return tagged.is(value, tag);
}
