import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { Path } from "react-hook-form";
import { useFormBuilderContext } from "../context";

const PayloadSwitch = <T extends object>({ name, label }: PayloadSwitchProps<T>) => {
  const { watch, setFormValue } = useFormBuilderContext();
  const isChecked = !!watch(name as any);

  const handleChange = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setFormValue(name as any, checked);
  };

  return <FormControlLabel control={<Switch checked={isChecked} onChange={handleChange} color="error" />} label={label} />;
};

export type PayloadSwitchProps<T extends {}> = {
  name: Path<T>;
  label: string;
};

export { PayloadSwitch };
