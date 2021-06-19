import {
  Validate as ValidateOriginal,
  validate as validateOriginal,
  validateOrReject,
  ValidatorOptions,
} from "./class-validator.ts";
import {
  Handler,
  UnprocessableEntityError,
} from "https://deno.land/x/nhttp@0.2.4/mod.ts";

export * from "./class-validator.ts";

// original validate
export { ValidateOriginal, validateOriginal };

type TValidatorOptions = ValidatorOptions & {
  throw?: { new (message: any): any };
};

type Class = { new (): any };

function joinTargetMethod(target: any, prop: string, arr: any[]) {
  let obj = target["methods"] || {};
  obj[prop] = obj[prop] || {};
  obj[prop].handlers = arr.concat(obj[prop].handlers || []);
  return obj;
}

export function validate(_class: Class, opts: TValidatorOptions = {}): Handler {
  opts.throw = opts.throw || UnprocessableEntityError;
  return async (rev, next) => {
    let obj = new _class();
    Object.assign(obj, rev.body);
    try {
      await validateOrReject(obj, opts);
    } catch (error) {
      throw new (opts as any).throw(error);
    }
    next();
  };
}

export function Validate(_class: Class, opts: TValidatorOptions = {}) {
  return (target: any, prop: string, des: PropertyDescriptor) => {
    target["methods"] = joinTargetMethod(target, prop, [
      validate(_class, opts),
    ]);
    return des;
  };
}
