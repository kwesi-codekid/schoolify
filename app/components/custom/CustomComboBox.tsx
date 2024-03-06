/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

export default function CustomComboBox({
  label,
  items,
  defaultValue,
  name,
  isLoading,
  setFilterText,
}: {
  label: string;
  items: any[];
  defaultValue?: string;
  name?: string;
  isLoading: boolean;
  setFilterText: (value: string) => void;
}) {
  const [value, setValue] = React.useState<any>(defaultValue);

  return (
    <div className="flex w-full flex-col">
      <input name={name} type="text" value={value} className="hidden" />
      <Autocomplete
        label={label}
        allowsCustomValue
        defaultItems={items}
        selectedKey={value}
        onSelectionChange={setValue}
        isLoading={isLoading}
        onInputChange={setFilterText}
      >
        {(item) => (
          <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
}
