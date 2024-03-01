const CustomDatePicker = ({
  id,
  label,
  name,
  placeholder,
  ...rest
}: {
  id?: string;
  label?: string;
  placeholder?: string;
  name: string;
}) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label htmlFor={id} className="text-slate-200 font-nunito">
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        placeholder={placeholder}
        type="date"
        className="rounded-xl px-3 py-4 focus:outline-none  font-nunito dark:bg-slate-700/40"
        {...rest}
      />
    </div>
  );
};

export default CustomDatePicker;
