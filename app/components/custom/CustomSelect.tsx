/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select, SelectItem, Chip } from "@nextui-org/react";

const CustomSelect = ({
  label,
  name,
  items,
  isInvalid,
  errorMessage,
  isRequired,
  defaultKey,
}: {
  label: string;
  name: string;
  items: {
    value: string;
    label: string;
    id: string | number;
    chipColor: "primary" | "secondary" | "success" | "warning" | "danger";
  }[];
  isInvalid?: boolean;
  errorMessage?: string;
  isRequired?: boolean;
  defaultKey?: any;
}) => {
  return (
    <Select
      items={items}
      label={label}
      classNames={{
        trigger: "dark:!bg-slate-800 dark:!border-slate-700/20",
        popoverContent: "dark:!bg-slate-800 dark:!border-slate-700/20",
        label: "font-nunito font-bold",
      }}
      listboxProps={{
        itemClasses: {
          base: [
            "rounded-md",
            "dark:hover:!bg-slate-700",
            "dark:!text-slate-200",
          ],
        },
      }}
      name={name}
      isInvalid={isInvalid}
      errorMessage={errorMessage}
      isRequired={isRequired}
      renderValue={(items) => {
        return (
          <div className="py-2">
            {items.map((item) => (
              <Chip variant="flat" size="sm" key={item.key}>
                {item.data.label}
              </Chip>
            ))}
          </div>
        );
      }}
    >
      {(item) => (
        <SelectItem key={item.value} value={item.value} textValue={item.label}>
          <Chip color={item.chipColor} variant="flat" className="font-nunito">
            {item.label}
          </Chip>
        </SelectItem>
      )}
    </Select>
  );
};

export default CustomSelect;
