import { TodoItem as TodoItemData } from "~/types/todo";
import TodoListItem from "./TodoListItem";

export type TodoProps = {
  todos: TodoItemData[];
  onToggleComplete: (todoId: number) => void;
  onDelete: (todoId: number) => void;
};

export default function TodoList(props: TodoProps) {
  return (
    <ul>
      {props.todos.map((todo) => (
        <li
          key={todo.id}
          className="[&:first-child]:border-t [&:not(:last-child)]:border-b"
        >
          <TodoListItem
            data={todo}
            onDelete={() => {
              props.onDelete(todo.id);
            }}
            onToggleComplete={() => {
              props.onToggleComplete(todo.id);
            }}
          />
        </li>
      ))}
    </ul>
  );
}
