import chain from "./chain";
import chalk from "chalk";
import fetch from "cross-fetch";
import unwrap from "./unwrap";
import { task, UnknownError } from "./task";

class WrappedJsonError extends Error {}
class TypeCheckError extends Error {}

const getIpCountry = () => {
  const resp = task(
    () => fetch(/* https:// */ "ifconfig.co" /* /json */),
    TypeError
  );

  const json = chain(
    resp,
    task(
      (value) =>
        value
          .json()
          .catch((error) => Promise.reject(new WrappedJsonError(`${error}`))),
      WrappedJsonError
    )
  );

  const ipCountry = chain(
    json,
    task(async (json) => {
      const { ip, country } = json;

      if (typeof ip !== "number") {
        throw new TypeCheckError(`ip: expected number, received ${typeof ip}`);
      }
      // if (typeof ip !== "string") {
      //   throw new TypeCheckError(`ip: expected string, received ${typeof ip}`);
      // }

      if (typeof country !== "string") {
        throw new TypeCheckError(
          `country: expected string, received ${typeof country}`
        );
      }

      throw new Error("unexpected!!!");

      return { ip, country };
    }, TypeCheckError)
  );

  return ipCountry();
};

(async () => {
  const result = await getIpCountry();

  const value = unwrap(
    result,
    [
      TypeError,
      (error) => {
        console.log(chalk.yellow("[ignoring]"), error);
        return null;
      },
    ],
    [
      WrappedJsonError,
      (error) => {
        console.log(chalk.yellow("[ignoring]"), error);
        return null;
      },
    ],
    [
      TypeCheckError,
      (error) => {
        console.log(chalk.yellow("[ignoring]"), error);
        return null;
      },
    ],
    [
      UnknownError,
      (error) => {
        console.log(chalk.red("[throwing!]", error.caught));
        throw error.caught;
      },
    ]
  );

  console.log(
    `${chalk.green("ip")}: ${value?.ip}, ${chalk.green("country")}: ${
      value?.country
    }`
  );
})();
