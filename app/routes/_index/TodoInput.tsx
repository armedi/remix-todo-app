import { ComponentProps } from "react";

export type TodoInputProps = ComponentProps<"input">;

export default function TodoInput(props: TodoInputProps) {
  return (
    <input
      {...props}
      className={`w-full p-3 placeholder:italic ${props.className}`}
      placeholder="What needs to be done?"
    />
  );
}
