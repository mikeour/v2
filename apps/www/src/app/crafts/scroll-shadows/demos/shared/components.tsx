"use client";

import { Fragment } from "react";
import { cn } from "@mikeour/ui/lib/utils";

export function Article({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <article className={cn("bg-white p-6 sm:px-10 sm:py-12", className)}>
      <p className="h-20 w-full rounded bg-zinc-200" />
      <div className="my-4 flex flex-row-reverse items-center gap-2 self-end">
        <div className="size-12 shrink-0 rounded-full bg-zinc-200" />
        <div className="flex w-1/3 flex-col gap-1">
          <p className="h-4 w-full rounded bg-zinc-200" />
          <p className="h-3 w-1/2 self-end rounded bg-zinc-200/90" />
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center gap-6">
        {Array.from({ length: count }).map((_, index) => (
          <Fragment key={`block-a-${index}`}>
            <TextBlockA />
            <TextBlockB />
          </Fragment>
        ))}
        {count > 2 && <ImageBlock />}
        {Array.from({ length: count }).map((_, index) => (
          <Fragment key={`block-b-${index}`}>
            <TextBlockA />
            <TextBlockB />
          </Fragment>
        ))}
        {count > 2 && (
          <>
            <ImageBlock />
            <TextBlockA />
          </>
        )}
      </div>
    </article>
  );
}

function ImageBlock() {
  return (
    <div className="my-4 flex w-8/12 flex-col gap-2">
      <div className="aspect-7/3 w-full rounded bg-zinc-200" />
      <p className="h-4 w-2/6 self-end rounded bg-zinc-200" />
    </div>
  );
}

function TextBlockA() {
  return (
    <div className="space-y-2 self-stretch text-sm">
      <p className="h-4 w-full rounded bg-zinc-200" />
      <p className="h-4 w-full rounded bg-zinc-200" />
      <p className="h-4 w-full rounded bg-zinc-200" />
      <p className="h-4 w-full rounded bg-zinc-200" />
      <p className="h-4 w-2/6 rounded bg-zinc-200" />
    </div>
  );
}

function TextBlockB() {
  return (
    <div className="space-y-2 self-stretch text-sm">
      <p className="h-4 w-full rounded bg-zinc-200" />
      <p className="h-4 w-full rounded bg-zinc-200" />
      <p className="h-4 w-full rounded bg-zinc-200" />
      <p className="h-4 w-4/6 rounded bg-zinc-200" />
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
