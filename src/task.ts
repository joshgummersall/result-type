import * as err from "./err";
import * as ok from "./ok";
import { Result } from "./result";

export type Task<A extends unknown[], T, E> = (
  ...args: A
) => Promise<Result<T, E>>;

export class UnknownError extends Error {
  constructor(public readonly caught: unknown) {
    super();
  }
}

export function task<A extends unknown[], T, E extends Error>(
  fn: (...args: A) => Promise<T>,
  ...errorCtors: Array<new (...args: any[]) => E>
): Task<A, T, E | UnknownError> {
  return async (...args: A) => {
    try {
      return ok.from(await fn(...args));
    } catch (error) {
      const Ctor = errorCtors.find((ctor) => error instanceof ctor);
      return err.from(
        Ctor && error instanceof Ctor ? error : new UnknownError(error)
      );
    }
  };
}
