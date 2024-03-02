import TodoListItem from "./TodoListItem";
import { TodoItem as TodoItemData } from "~/types/todo";

export type TodoProps = {
  todos: TodoItemData[];
};

export default function TodoList({ todos }: TodoProps) {
  return (
    <ul className="bg-white rounded">
      {todos.map((todo) => (
        <li key={todo.id} className="[&:not(:last-child)]:border-b">
          <TodoListItem {...todo} />
        </li>
      ))}
    </ul>
  );
}
