import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { TodoItem as TodoItemData } from "~/types";
import TodoListItem from "./TodoListItem";

export type TodoProps = {
  todos: TodoItemData[];
  onEdit: (todoId: number, newText: string) => void;
  onToggleComplete: (todoId: number) => void;
  onDelete: (todoId: number) => void;
};

export default function TodoList(props: TodoProps) {
  return (
    <TransitionGroup component="ul">
      {props.todos.map((todo) => {
        const nodeRef = React.createRef<HTMLLIElement>();
        
        return (
          <CSSTransition
            key={todo.id}
            nodeRef={nodeRef}
            timeout={300}
            classNames={{
              exit: "h-12 opacity-100 transition-all duration-300",
              exitActive: "h-0 opacity-0",
            }}
            onExiting={() => {
              nodeRef.current?.classList.remove("h-12", "opacity-100");
            }}
          >
            <li
              ref={nodeRef}
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
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  );
}
