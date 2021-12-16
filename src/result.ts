import * as Err from "./err";
import * as Ok from "./ok";
import { match as _match } from "ts-pattern";

export type T<O, E> = Ok.T<O> | Err.T<E>;

export const match = <O, E, OT, ET>(
  result: T<O, E>,
  ok: (value: O) => OT,
  err: (error: E) => ET
): OT | ET =>
  _match(result)
    .with(Ok.T, ({ value }) => ok(value))
    .with(Err.T, ({ value }) => err(value))
    .exhaustive();

export const mapOr = <O, E, ET>(
  result: T<O, E>,
  or: (error: E) => ET
): O | ET => match(result, (value) => value, or);
