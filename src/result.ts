import * as Err from "./err";
import * as Ok from "./ok";

export type T<O, E> = Ok.T<O> | Err.T<E>;

export function map<O, E, R>(
  result: T<O, E>,
  fns: {
    ok: (o: O) => R;
    err: (e: E) => R;
  }
): R {
  if (Ok.is(result)) {
    return fns.ok(result.value);
  } else {
    return fns.err(result.value);
  }
}
