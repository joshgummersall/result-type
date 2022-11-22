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
      fetch(/* https:// */ "ifconfig.co/json" /* /json */).catch(
        (reason) => Promise.reject(new FetchError(reason))
      ),
    FetchError
  );

  const json = pipe(
    resp,
    Task.of(
      (value) =>
        value.json().catch((reason) => Promise.reject(new JsonError(reason))),
      JsonError
    )
  );

  const ipCountry = pipe(
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
  // note: no try/catch, because any other error that happens is _truly_
  // exceptional and should crash the program
  const message = Result.map(await getIpCountry(), {
    ok: (value) => `user IP: ${value.ip}, country: ${value.country}`,
    err: (err) => `error: could not find IP (${err})`,
  });

  console.log(message);

  const result = await getIpCountry();

  match(result)
    .with(Ok.T, ({ value }) => {
      console.log(
        `${chalk.green("ip")}: ${value?.ip}, ${chalk.green("country")}: ${
          value?.country
        }`
      );
    })
    .with(Err.T, ({ value: err }) => {
      match(err)
        .with(instanceOf(FetchError), (err) => {
          console.log(chalk.yellow("FetchError"), err.message);
        })
        .with(instanceOf(JsonError), (err) => {
          console.log(chalk.yellow("WrappedJsonError"), err.message);
        })
        .with(instanceOf(TypeCheckError), (err) => {
          console.log(chalk.yellow("TypeCheckError"), err.message);
        })
        .with(instanceOf(Error), (err) => {
          console.error(err);
        })
        .exhaustive();
    })
    .exhaustive();
})();
