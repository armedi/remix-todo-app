import type { MetaFunction } from "@remix-run/node";
import {
  ClientActionFunctionArgs,
  useLoaderData,
  useSubmit,
} from "@remix-run/react";

import TodoList from "~/routes/_index/TodoList";
import { Quote, TodoItem } from "~/types/todo";
import TodoInput from "./TodoInput";

export const meta: MetaFunction = () => {
  return [{ title: "Todo App" }];
};

const data: { todos: TodoItem[]; quote: Quote | null } = {
  todos: [
    { id: 1, text: "Eat", completed: true },
    { id: 2, text: "Sleep", completed: false },
    { id: 3, text: "Repeat", completed: false },
  ],
  quote: null,
};

export const clientLoader = async () => {
  if (!data.quote) {
    data.quote = await fetch("https://api.quotable.io/quotes/random")
      .then((res) => res.json())
      .then((quotes) => quotes[0]);
  }

  return { todos: data.todos, quote: data.quote! };
};

export const clientAction = async ({ request }: ClientActionFunctionArgs) => {
  const requestJson = await request.json();
  const intent = requestJson.intent;

  switch (intent) {
    case "toggle-complete": {
      const todoId = requestJson.todoId;
      const foundIndex = data.todos.findIndex((todo) => todo.id === todoId);
      if (foundIndex !== -1) {
        data.todos = [
          ...data.todos.slice(0, foundIndex),
          {
            ...data.todos[foundIndex],
            completed: !data.todos[foundIndex].completed,
          },
          ...data.todos.slice(foundIndex + 1),
        ];
      }
      break;
    }
    case "delete": {
      const todoId = requestJson.todoId;
      const foundIndex = data.todos.findIndex((todo) => todo.id === todoId);
      if (foundIndex !== -1) {
        data.todos = [
          ...data.todos.slice(0, foundIndex),
          ...data.todos.slice(foundIndex + 1),
        ];
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
        <TodoInput />
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
