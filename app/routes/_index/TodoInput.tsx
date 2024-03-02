import { ComponentProps, Ref, forwardRef } from "react";

export type TodoInputProps = ComponentProps<"input">;

export default forwardRef(function TodoInput(
  props: TodoInputProps,
  ref: Ref<HTMLInputElement>
) {
  return (
    <input
      {...props}
      ref={ref}
      className={`w-full p-3 placeholder:italic ${props.className}`}
      placeholder="What needs to be done?"
    />
  );
});
