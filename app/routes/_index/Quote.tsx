import type { Quote as QuoteData } from "~/types";

export type QuoteProps = QuoteData;

export default function Quote(props: QuoteProps) {
  return (
    <blockquote className="p-4 border-s-4 border-gray-300 bg-white dark:border-gray-500 dark:bg-gray-800">
      <p className="italic font-medium leading-relaxed text-gray-900 dark:text-white">
        &quot;{props.content}&quot;
      </p>
      <cite className="block text-right text-gray-500 dark:text-gray-400">
        &mdash; {props.author}
      </cite>
    </blockquote>
  );
}
