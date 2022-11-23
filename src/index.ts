import * as Err from "./err";
import * as Ok from "./ok";
import * as Task from "./task";
import * as Result from "./result";
import pipe from "./pipe";

import chalk from "chalk";
import fetch from "cross-fetch";
import { match, instanceOf } from "ts-pattern";

class FetchError extends Error {}
class JsonError extends Error {}
class TypeCheckError extends Error {}

const getIpCountry = () => {
  const resp = Task.of(
    () =>
      fetch(/* https:// */ "ifconfig.c0" /* /json */).catch(
        (reason) => {
          throw new FetchError(reason)
        }
      ),
    FetchError
  );

  const json = pipe(
    resp,
    Task.of(
      (value) =>
        value.json().catch(
          (reason) => {
            throw new JsonError(reason)
          }
        ),
      JsonError
    )
  );

  const ipCountry = pipe(
    json,
    Task.of(async (json) => {
      const { ip, country } = json;

      // Note: comment out to fix
      if (typeof ip !== "number") {
        throw new TypeCheckError(`ip: expected number, received ${typeof ip}`);
      }

      if (typeof ip !== "string") {
        throw new TypeCheckError(`ip: expected string, received ${typeof ip}`);
      }

      if (typeof country !== "string") {
        throw new TypeCheckError(
          `country: expected string, received ${typeof country}`
        );
      }

      // Note: comment out to fix
      (10 as any).toUpperCase();

      return { ip, country };
    }, TypeCheckError)
  );

  return ipCountry();
};

(async () => {
  const result = await getIpCountry();

  // note: no try/catch, because any other error that happens is _truly_
  // exceptional and should crash the program
  const message = Result.map(result, {
    ok: (value) => `user IP: ${value.ip}, country: ${value.country}`,
    err: (err) => `error: could not fetch user IP/country (${err})`,
  });

  console.log(message);

  // match(result)
  //   .with(Ok.T, ({ value }) => {
  //     console.log(
  //       `${chalk.green("ip")}: ${value?.ip}, ${chalk.green("country")}: ${
  //         value?.country
  //       }`
  //     );
  //   })
  //   .with(Err.T, ({ value: err }) => {
  //     match(err)
  //       .with(instanceOf(FetchError), (err) => {
  //         console.log(chalk.yellow("FetchError"), err.message);
  //       })
  //       .with(instanceOf(JsonError), (err) => {
  //         console.log(chalk.yellow("JsonError"), err.message);
  //       })
  //       .with(instanceOf(TypeCheckError), (err) => {
  //         console.log(chalk.yellow("TypeCheckError"), err.message);
  //       })
  //       .exhaustive();
  //   })
  //   .exhaustive();
})();
