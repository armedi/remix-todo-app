import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export type TodoSearchBoxProps = {
  value: string;
  onChange: (newValue: string) => void;
};

export default function TodoSearchBox(props: TodoSearchBoxProps) {
  return (
    <div className="flex items-center relative">
      <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 absolute left-3" />
      <input
        className="w-full p-3 pl-11 placeholder:italic"
        placeholder="Search..."
        value={props.value}
        onChange={(event) => {
          props.onChange(event.currentTarget.value);
        }}
      />
    </div>
  );
}
