import * as Err from "./err";
import * as Ok from "./ok";
import * as Result from "./result";

export type Task<A extends unknown[], T, E> = (
  ...args: A
) => Promise<Result.T<T, E>>;

export function of<A extends unknown[], T, E extends Error>(
  fn: (...args: A) => Promise<T>,
  ...errorCtors: Array<new (...args: any[]) => E>
): Task<A, T, E | Error> {
  return async (...args: A) => {
    try {
      return Ok.from(await fn(...args));
    } catch (error) {
      const Ctor = errorCtors.find((ctor) => error instanceof ctor);
      return Err.from(
        Ctor && error instanceof Ctor ? error : new Error(`${error}`)
      );
    }
  };
}
