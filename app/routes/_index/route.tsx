import type { MetaFunction } from "@remix-run/node";
import {
  ClientActionFunctionArgs,
  useLoaderData,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import Fuse from "fuse.js";
import { useMemo } from "react";

import { Quote as QuoteData, TodoItem } from "~/types";
import Quote from "./Quote";
import TodoInput from "./TodoInput";
import TodoList from "./TodoList";
import TodoSearchBox from "./TodoSearchBox";

let lastTodoId = 0;
let todos: TodoItem[] = [];
let quote: QuoteData | null = null;

export const meta: MetaFunction = () => {
  return [{ title: "Todo App" }];
};

export const clientLoader = async () => {
  if (!quote) {
    quote = await fetch("https://api.quotable.io/quotes/random")
      .then((res) => res.json())
      .then((quotes) => quotes[0]);
  }

  return { todos, quote: quote! };
};

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const requestJson = await request.json();
  const intent = requestJson.intent;

  switch (intent) {
    case "add": {
      const newTodo = {
        id: ++lastTodoId,
        text: requestJson.text,
        completed: false,
      };
      todos = [...todos, newTodo];
      break;
    }
    case "toggle-complete": {
      const todoId = requestJson.todoId;
      const foundIndex = todos.findIndex((todo) => todo.id === todoId);
      if (foundIndex !== -1) {
        todos = [
          ...todos.slice(0, foundIndex),
          {
            ...todos[foundIndex],
            completed: !todos[foundIndex].completed,
          },
          ...todos.slice(foundIndex + 1),
        ];
      }
      break;
    }
    case "edit": {
      const todoId = requestJson.todoId;
      const foundIndex = todos.findIndex((todo) => todo.id === todoId);
      if (foundIndex !== -1) {
        todos = [
          ...todos.slice(0, foundIndex),
          {
            ...todos[foundIndex],
            text: requestJson.newText,
          },
          ...todos.slice(foundIndex + 1),
        ];
      }
      break;
    }
    case "delete": {
      const todoId = requestJson.todoId;
      const foundIndex = todos.findIndex((todo) => todo.id === todoId);
      if (foundIndex !== -1) {
        todos = [...todos.slice(0, foundIndex), ...todos.slice(foundIndex + 1)];
      }
      break;
    }
    default:
      break;
  }

  return null;
};

export default function Index() {
  const { quote, todos } = useLoaderData<typeof clientLoader>();
  const submit = useSubmit();

  const [searchParams, setSearchParams] = useSearchParams();
  const fuse = useMemo(() => new Fuse(todos, { keys: ["text"] }), [todos]);
  const searchKey = searchParams.get("q") ?? "";

  const displayedTodos = searchKey
    ? fuse.search(searchKey).map((result) => result.item)
    : todos;

  return (
    <main className="mx-auto max-w-lg p-9">
      <h1 className="text-center text-orange-700 text-7xl font-extralight tracking-tight mb-8">
        todos
      </h1>
      <div className="mb-8 bg-white rounded">
        <TodoInput
          className="border-b"
          onKeyDown={(event) => {
            if (event.code === "Enter") {
              submit(
                {
                  intent: "add",
                  text: event.currentTarget.value,
                },
                { method: "post", encType: "application/json" }
              );
              event.currentTarget.value = "";
              requestIdleCallback(() => {
                setSearchParams((prev) => {
                  prev.delete("q");
                  return prev;
                });
              });
            }
          }}
        />
        <TodoSearchBox
          value={searchKey ?? ""}
          onChange={(value) => {
            setSearchParams({ q: value });
          }}
        />
        <TodoList
          todos={displayedTodos}
          onEdit={(todoId, newText) => {
            submit(
              {
                intent: "edit",
                todoId,
                newText,
              },
              { method: "post", encType: "application/json" }
            );
          }}
          onToggleComplete={(todoId) => {
            submit(
              {
                intent: "toggle-complete",
                todoId,
              },
              { method: "post", encType: "application/json" }
            );
          }}
          onDelete={(todoId) => {
            submit(
              {
                intent: "delete",
                todoId,
              },
              { method: "post", encType: "application/json" }
            );
          }}
        />
      </div>
      <Quote {...quote} />
    </main>
  );
}
