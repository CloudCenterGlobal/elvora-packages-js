import get from "lodash/get";
import type { Path } from "react-hook-form";
import type { InferType, ObjectSchema } from "yup";

const inputIsRequired = <T extends ObjectSchema<any>, Type extends InferType<T>>(name: Path<Type>, schema: T) => {
  return (get(schema.fields, `${name}.spec.optional`) as unknown as boolean) === false;
};

export { inputIsRequired };
