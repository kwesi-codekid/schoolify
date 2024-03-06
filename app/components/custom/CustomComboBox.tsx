/* eslint-disable @typescript-eslint/no-explicit-any */
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { useEffect } from "react";

export default function CustomComboBox({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue?: string;
}) {
  const list = useAsyncList<any>({
    async load({ signal, filterText }) {
      const res = await fetch(`/api/parents?search_term=${filterText}`, {
        signal,
      });
      const json = await res.json();
      console.log(json);

      return {
        items: json,
      };
    },
  });

  useEffect(() => {
    console.log(list.items);
  }, [list.items]);

  return (
    <Autocomplete
      name={name}
      inputValue={list.filterText}
      isLoading={list.isLoading}
      items={list.items}
      label={label}
      onInputChange={list.setFilterText}
      defaultSelectedKey={defaultValue}
    >
      {(item) => (
        <AutocompleteItem key={item._id} className="capitalize">
          {item.firstName + " " + item.lastName}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}
