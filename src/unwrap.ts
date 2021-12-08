
import * as ok from "./ok";
import { Result } from "./result";

export type ErrorHandler<E, T> = [new (...args: any[]) => E, (error: E) => T];

export default function unwrap<T, E, E1, U>(
  result: Result<T, E>,
  handler1: ErrorHandler<E1, U>
): T | U;

export default function unwrap<T, E, E1, E2, U>(
  result: Result<T, E>,
  handler1: ErrorHandler<E1, U>,
  handler2: ErrorHandler<E2, U>
): T | U;

export default function unwrap<T, E, E1, E2, E3, U>(
  result: Result<T, E>,
  handler1: ErrorHandler<E1, U>,
  handler2: ErrorHandler<E2, U>,
  handler3: ErrorHandler<E3, U>
): T | U;

export default function unwrap<T, E, E1, E2, E3, E4, U>(
  result: Result<T, E>,
  handler1: ErrorHandler<E1, U>,
  handler2: ErrorHandler<E2, U>,
  handler3: ErrorHandler<E3, U>,
  handler4: ErrorHandler<E4, U>
): T | U;

export default function unwrap<T, E, E1, E2, E3, E4, U>(
  result: Result<T, E>,
  handler1: ErrorHandler<E1, U>,
  handler2?: ErrorHandler<E2, U>,
  handler3?: ErrorHandler<E3, U>,
  handler4?: ErrorHandler<E4, U>
): T | U {
  if (ok.is(result)) {
    return result.value;
  } else {
    const error = result.value;

    if (error instanceof handler1[0]) {
      return handler1[1](error);
    }

    if (handler2 && error instanceof handler2[0]) {
      return handler2[1](error);
    }

    if (handler3 && error instanceof handler3[0]) {
      return handler3[1](error);
    }

    if (handler4 && error instanceof handler4[0]) {
      return handler4[1](error);
    }

    throw result.value;
  }
}
