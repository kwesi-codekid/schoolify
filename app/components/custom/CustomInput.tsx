import { Input } from "@nextui-org/react";

const CustomInput = ({
  label,
  name,
  isInvalid,
  errorMessage,
  isRequired,
  type,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  isRequired?: boolean;
  defaultValue?: string;
}) => {
  return (
    <Input
      classNames={{
        inputWrapper: [
          "dark:bg-slate-800 dark:border-slate-700/20",
          "dark:group-data-[focused=true]:!bg-slate-700",
        ],
        label: "font-nunito font-bold",
        input: ["!font-quicksand", "dark:text-slate-200"],
      }}
      label={label}
      name={name}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      required={isRequired}
      type={type}
      defaultValue={defaultValue}
    />
  );
};

export default CustomInput;
