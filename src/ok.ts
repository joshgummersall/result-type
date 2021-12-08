import * as tagged from "./tagged";

export type Ok<T> = tagged.Tagged<"Ok"> & {
  value: T;
};

export function from<T>(value: T): Ok<T> {
  return tagged.from("Ok", value);
}

export function is<T>(value: tagged.Tagged): value is Ok<T> {
  return tagged.is(value, "Ok");
}
