import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Todo App" }];
};

export default function Index() {
  return (
    <div>
      <h1 className="text-3xl font-bold">
        Welcome to Remix (SPA Mode)
      </h1>
    </div>
  );
}
