"use client";

import { cn } from "@mikeour/ui/lib/utils";

export function Article({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <article className={cn("bg-white p-4 sm:p-6 md:p-8", className)}>
      {/* Hero heading */}
      <div className="mb-2 space-y-2">
        <div className="h-7 w-4/5 rounded bg-zinc-300" />
        <div className="h-7 w-3/5 rounded bg-zinc-300" />
      </div>

      {/* Author byline */}
      <div className="my-4 flex items-center gap-2.5">
        <div className="size-9 rounded-full bg-linear-to-br from-violet-400 to-indigo-500" />
        <div className="flex flex-col gap-1">
          <div className="h-3.5 w-24 rounded bg-zinc-300" />
          <div className="h-3 w-16 rounded bg-zinc-200" />
        </div>
      </div>

      {/* Content */}
      <div className="mt-6 flex flex-col gap-4">
        {count > 0 && (
          <>
            <Paragraph widths={["full", "full", "full", "4/5"]} />
            <Paragraph widths={["full", "full", "3/5"]} />
            <Blockquote />
            <Paragraph widths={["full", "full", "full", "2/5"]} />
          </>
        )}

        {count > 1 && (
          <>
            <Subheading width="2/5" />
            <Paragraph widths={["full", "full", "full", "full", "3/4"]} />
            <ImageBlock />
            <Paragraph widths={["full", "full", "1/2"]} />
          </>
        )}

        {count > 2 && (
          <>
            <CodeBlock />
            <Paragraph widths={["full", "full", "full", "2/3"]} />
            <Paragraph widths={["full", "full", "4/5"]} />
          </>
        )}
      </div>
    </article>
  );
}

function Paragraph({ widths }: { widths: string[] }) {
  const widthClasses: Record<string, string> = {
    full: "w-full",
    "4/5": "w-4/5",
    "3/4": "w-3/4",
    "2/3": "w-2/3",
    "3/5": "w-3/5",
    "1/2": "w-1/2",
    "2/5": "w-2/5",
    "1/3": "w-1/3",
  };
  return (
    <div className="space-y-2">
      {widths.map((w, i) => (
        <div
          key={i}
          className={cn("h-3.5 rounded bg-zinc-200", widthClasses[w])}
        />
      ))}
    </div>
  );
}

function Subheading({ width }: { width: string }) {
  const widthClasses: Record<string, string> = {
    "2/5": "w-2/5",
    "1/3": "w-1/3",
    "1/2": "w-1/2",
  };
  return (
    <div
      className={cn(
        "@sm:mt-2 mt-1 @sm:h-6 h-5 rounded bg-zinc-700",
        widthClasses[width]
      )}
    />
  );
}

function Blockquote() {
  return (
    <div className="my-1 flex gap-2.5 rounded-r-lg border-indigo-400 border-l-4 bg-indigo-50 py-3 pr-3 pl-3">
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-full rounded bg-indigo-200/70" />
        <div className="h-3.5 w-full rounded bg-indigo-200/70" />
        <div className="h-3.5 w-3/5 rounded bg-indigo-200/70" />
      </div>
    </div>
  );
}

function CodeBlock() {
  return (
    <div className="my-1 space-y-2 rounded-lg bg-zinc-900 p-3">
      <div className="h-3 w-2/5 rounded bg-zinc-700" />
      <div className="h-3 w-4/5 rounded bg-zinc-700" />
      <div className="ml-3 h-3 w-3/5 rounded bg-zinc-600" />
      <div className="ml-3 h-3 w-2/5 rounded bg-zinc-600" />
      <div className="h-3 w-1/4 rounded bg-zinc-700" />
    </div>
  );
}

function ImageBlock() {
  return (
    <div className="my-1 overflow-hidden rounded-lg bg-linear-to-br from-zinc-100 to-zinc-200">
      <div className="flex aspect-video items-center justify-center">
        <div className="flex size-10 items-center justify-center rounded-full bg-zinc-300/80">
          <div className="size-0 border-y-5 border-y-transparent border-l-8 border-l-zinc-400" />
        </div>
      </div>
      <div className="bg-zinc-100 px-2.5 py-1.5">
        <div className="h-2.5 w-2/5 rounded bg-zinc-300" />
      </div>
    </div>
  );
}

export function Carousel({
  count = 10,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-6 p-6", className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          className="aspect-square size-44 rounded-xl bg-zinc-200"
          key={index}
        />
      ))}
    </div>
  );
}
