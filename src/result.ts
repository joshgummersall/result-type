import * as Err from "./err";
import * as Ok from "./ok";

export type T<O, E> = Ok.T<O> | Err.T<E>;