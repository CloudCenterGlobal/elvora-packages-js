import { PayloadTextField, PayloadTextFieldProps } from "./text-field";

const PayloadOptionsField = <T extends {}>(props: PayloadOptionsFieldProps<T>) => {
  return <PayloadTextField description="Separate options with a comma" placeholder="Option 1, Option 2" {...props} />;
};

export type PayloadOptionsFieldProps<T extends object> = PayloadTextFieldProps<T> & {};

export { PayloadOptionsField };
