import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSubmit } from "@remix-run/react";

import { TodoItem as TodoItemData } from "~/types/todo";

export default function TodoListItem(props: TodoItemData) {
  const submit = useSubmit();

  const toggleComplete = () => {
    submit(
      {
        intent: "toggle-complete",
        todoId: props.id,
      },
      { method: "post", encType: "application/json" }
    );
  };

  const deleteTodo = () => {
    submit(
      {
        intent: "delete",
        todoId: props.id,
      },
      { method: "post", encType: "application/json" }
    );
  };

  return (
    <div
      className="flex items-center gap-3 p-3 group"
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.code === "Enter" || event.code === "Space") {
          toggleComplete();
        } else if (event.code === "Backspace" || event.code === "Delete") {
          deleteTodo();
        }
      }}
      onClick={toggleComplete}
    >
      <input
        type="checkbox"
        checked={props.completed}
        tabIndex={-1}
        onChange={() => {
          /* nothing to do here, the click event is handled by parent */
        }}
        className="h-5 w-5 rounded border-gray-300 accent-orange-700"
      />
      <label
        className={`flex-grow ${
          props.completed ? "line-through text-gray-400" : ""
        }`}
      >
        {props.text}
      </label>
      <button
        className="hidden group-hover:block"
        onClick={(event) => {
          event.stopPropagation();
          deleteTodo();
        }}
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
