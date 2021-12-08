import * as tagged from "./tagged";

export type Err<E> = tagged.Tagged<"Err"> & {
  value: E;
};

export function from<E>(value: E): Err<E> {
  return tagged.from("Err", value);
}

export function is<E>(value: tagged.Tagged): value is Err<E> {
  return tagged.is(value, "Err");
}
