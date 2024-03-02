import type { MetaFunction } from "@remix-run/node";
import {
  ClientActionFunctionArgs,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";

import TodoList from "~/routes/_index/TodoList";
import { Quote, TodoItem } from "~/types/todo";
import TodoInput from "./TodoInput";

let lastTodoId = 0;
let todos: TodoItem[] = [];
let quote: Quote | null = null;

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

  return (
    <main className="mx-auto max-w-lg p-9">
      <h1 className="text-center text-orange-700 text-7xl font-extralight tracking-tight mb-8">
        todos
      </h1>
      <div className="mb-8 bg-white rounded">
        <TodoInput
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
            }
          }}
        />
        <TodoList
          todos={todos}
          onDelete={(todoId) => {
            submit(
              {
                intent: "delete",
                todoId,
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
        />
      </div>
      <blockquote className="p-4 border-s-4 border-gray-300 bg-white dark:border-gray-500 dark:bg-gray-800">
        <p className="italic font-medium leading-relaxed text-gray-900 dark:text-white">
          &quot;{quote.content}&quot;
        </p>
        <cite className="block text-right text-gray-500 dark:text-gray-400">
          &mdash; {quote.author}
        </cite>
      </blockquote>
    </main>
  );
}
