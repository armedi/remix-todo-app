import { XMarkIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";

import { TodoItem as TodoItemData } from "~/types/todo";
import TodoInput from "./TodoInput";

export type TodoListItemProps = {
  data: TodoItemData;
  onEdit: (newText: string) => void;
  onToggleComplete: () => void;
  onDelete: () => void;
};

export default function TodoListItem(props: TodoListItemProps) {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const inputElementRef = useRef<HTMLInputElement>(null);

  const toggleMode = () => {
    setMode((prevMode) => {
      const nextMode = prevMode === "view" ? "edit" : "view";
      if (nextMode === "edit") {
        requestIdleCallback(() => {
          inputElementRef.current?.focus();
        });
      }
      return nextMode;
    });
  };

  if (mode === "edit") {
    return (
      <TodoInput
        ref={inputElementRef}
        defaultValue={props.data.text}
        onKeyDown={(event) => {
          if (event.code === "Enter") {
            props.onEdit(event.currentTarget.value);
            toggleMode();
          } else if (event.code === "Escape") {
            toggleMode();
          }
        }}
        onBlur={toggleMode}
      />
    );
  }

  return (
    <div
      className="flex items-center gap-3 p-3 group"
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.code === "Space") {
          props.onToggleComplete();
        } else if (event.code === "Enter") {
          toggleMode();
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
          toggleMode();
        }}
      >
        <PencilIcon className="h-4 w-4" />
      </button>
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
