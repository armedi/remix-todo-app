import { XMarkIcon } from "@heroicons/react/24/outline";

import { TodoItem as TodoItemData } from "~/types/todo";

export type TodoListItemProps = {
  data: TodoItemData;
  onToggleComplete: () => void;
  onDelete: () => void;
};

export default function TodoListItem(props: TodoListItemProps) {
  return (
    <div
      className="flex items-center gap-3 p-3 group"
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.code === "Enter" || event.code === "Space") {
          props.onToggleComplete();
        } else if (event.code === "Backspace" || event.code === "Delete") {
          props.onDelete();
        }
      }}
      onClick={props.onToggleComplete}
    >
      <input
        type="checkbox"
        checked={props.data.completed}
        tabIndex={-1}
        onChange={() => {
          /* nothing to do here, the click event is handled by parent */
        }}
        className="h-5 w-5 rounded border-gray-300 accent-orange-700"
      />
      <label
        className={`flex-grow ${
          props.data.completed ? "line-through text-gray-400" : ""
        }`}
      >
        {props.data.text}
      </label>
      <button
        className="hidden group-hover:block"
        tabIndex={-1}
        onClick={(event) => {
          event.stopPropagation();
          props.onDelete();
        }}
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
