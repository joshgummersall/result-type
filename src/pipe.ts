import * as err from "./err";
import { Task } from "./task";

export default function pipe<FT, FE, ST, SE>(
  left: Task<[], FT, FE>,
  right: Task<[FT], ST, SE>
): Task<[], ST, FE | SE> {
  return async () => {
    const result = await left();

    if (err.is(result)) {
      return result;
    }

    return right(result.value);
  };
}
