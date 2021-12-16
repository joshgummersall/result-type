import * as Result from "./result";
import chain from "./chain";
import chalk from "chalk";
import fetch from "cross-fetch";
import * as Task from "./task";
import { match, instanceOf } from "ts-pattern";

class WrappedJsonError extends Error {
  public readonly foo?: string;
}
class TypeCheckError extends Error {
  public readonly bar?: string;
}

const getIpCountry = () => {
  const resp = Task.of(
    () => fetch(/* https:// */ "https://ifconfig.co/json" /* /json */),
    TypeError
  );

  const json = chain(
    resp,
    Task.of(
      (value) =>
        value
          .json()
          .catch((error) => Promise.reject(new WrappedJsonError(`${error}`))),
      WrappedJsonError
    )
  );

  const ipCountry = chain(
    json,
    Task.of(async (json) => {
      const { ip, country } = json;

      // if (typeof ip !== "number") {
      //   throw new TypeCheckError(`ip: expected number, received ${typeof ip}`);
      // }
      if (typeof ip !== "string") {
        throw new TypeCheckError(`ip: expected string, received ${typeof ip}`);
      }

      if (typeof country !== "string") {
        throw new TypeCheckError(
          `country: expected string, received ${typeof country}`
        );
      }

      // throw new Error("unexpected!!!");

      return { ip, country };
    }, TypeCheckError)
  );

  return ipCountry();
};

(async () => {
  const result = await getIpCountry();

  const value = Result.mapOr(
    result,
    (err) =>
      match(err)
        .with(instanceOf(TypeError), (err) => {
          console.log(chalk.yellow("TypeError"), err.message);
          return null;
        })
        .with(instanceOf(WrappedJsonError), (err) => {
          console.log(chalk.yellow("WrappedJsonError"), err.message);
          return null;
        })
        .with(instanceOf(TypeCheckError), (err) => {
          console.log(chalk.yellow("TypeCheckError"), err.message);
          return null;
        })
        .otherwise((err) => {
          throw err;
        })
  );

  console.log(
    `${chalk.green("ip")}: ${value?.ip}, ${chalk.green("country")}: ${
      value?.country
    }`
  );
})();
