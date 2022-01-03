import {
  Validate as ValidateOriginal,
  validate as validateOriginal,
  validateOrReject,
  ValidatorOptions,
} from "./class-validator.ts";
import { Handler, HttpError } from "https://deno.land/x/nhttp@1.1.5/mod.ts";

export * from "./class-validator.ts";

// original validate
export { ValidateOriginal, validateOriginal };

type Class = { new (): any };

function joinTargetMethod(target: any, prop: string, arr: any[]) {
  let obj = target["methods"] || {};
  obj[prop] = obj[prop] || {};
  obj[prop].handlers = arr.concat(obj[prop].handlers || []);
  return obj;
}

export function validate(_class: Class, opts: ValidatorOptions = {}): Handler {
  return async (rev, next) => {
    let obj = new _class();
    Object.assign(obj, rev.body);
    try {
      await validateOrReject(obj, opts);
    } catch (error) {
      throw new HttpError(
        422,
        "Unprocessable Entity Error",
        "UnprocessableEntityError",
      );
    }
    next();
  };
}

export function Validate(_class: Class, opts: ValidatorOptions = {}) {
  return (target: any, prop: string, des: PropertyDescriptor) => {
    target["methods"] = joinTargetMethod(target, prop, [
      validate(_class, opts),
    ]);
    return des;
  };
}
