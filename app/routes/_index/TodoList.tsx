import { TodoItem as TodoItemData } from "~/types/todo";
import TodoListItem from "./TodoListItem";

export type TodoProps = {
  todos: TodoItemData[];
  onEdit: (todoId: number, newText: string) => void;
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
            onEdit={(newText) => {
              props.onEdit(todo.id, newText);
            }}
            onToggleComplete={() => {
              props.onToggleComplete(todo.id);
            }}
            onDelete={() => {
              props.onDelete(todo.id);
            }}
          />
        </li>
      ))}
    </ul>
  );
}
