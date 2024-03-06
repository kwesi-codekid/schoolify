/* eslint-disable @typescript-eslint/no-explicit-any */
import Datepicker from "react-tailwindcss-datepicker";
import { useState, useEffect } from "react";

const CustomDatePicker = ({
  name,
  placeholder,
  defaultValue,
}: {
  placeholder?: string;
  name: string;
  defaultValue?: string;
}) => {
  const [value, setValue] = useState({
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    if (defaultValue) {
      setValue({
        startDate: defaultValue,
        endDate: defaultValue,
      });
    }
  }, [defaultValue]);

  const handleValueChange = (newValue: any) => {
    setValue(newValue);
    console.log(newValue, value);
  };

  return (
    <>
      <input
        type="text"
        name={name}
        value={value.startDate ?? ""}
        onChange={() => {}}
        className="hidden"
      />

      <Datepicker
        asSingle={true}
        useRange={false}
        value={value}
        onChange={handleValueChange}
        placeholder={placeholder}
        inputClassName={
          "h-12 rounded-xl dark:!text-slate-100 text-sm focus:!ring-none focus:!outline-none w-full focus:!border-none dark:bg-slate-800 px-3 font-nunito font-bold"
        }
      />
    </>
  );
};

export default CustomDatePicker;
