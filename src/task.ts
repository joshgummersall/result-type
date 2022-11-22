import * as Err from "./err";
import * as Ok from "./ok";
import * as Result from "./result";

export type Task<A extends unknown[], T, E> = (
  ...args: A
) => Promise<Result.T<T, E>>;

export function of<A extends unknown[], T, E>(
  fn: (...args: A) => Promise<T>,
  ...errorCtors: Array<new (...args: any[]) => E>
): Task<A, T, E> {
  return async (...args: A) => {
    try {
      return Ok.from(await fn(...args));
    } catch (error) {
      const Ctor = errorCtors.find((ctor) => error instanceof ctor);

      // If the error thrown matches a constructor in the allow list, coerce
      // to Err<E>, otherwise this is unexpected and should crash the program
      if (Ctor) {
        return Err.from(error as E); // note: we know error instanceof Ctor, as casting safe
      } else {
        throw error;
      }
    }
  };
}
