"use client";

import { Fragment, useRef } from "react";
import { cn } from "@mikeour/ui/utils";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

import { ExampleContainer } from "~/components/crafts/example-container";
import { DemoScrollContainer } from "./demo-scroll-container";
import { ScrollContainer } from "./scroll-container";
import {
  useBrokenScrollShadows,
  useFixedScrollShadows,
} from "./use-scroll-shadows";

export function InteractiveArticleExample({ caption }: { caption?: string }) {
  return (
    <ExampleContainer
      caption={caption}
      className="w-full"
      controls={[
        {
          type: "switch",
          name: "enabled",
          label: "Shadows",
          defaultValue: true,
        },
      ]}
    >
      {({ values }) => (
        <DemoScrollContainer
          className="max-h-100 [--size:24px] md:[--size:36px]"
          isEnabled={values.enabled as boolean}
          isRealistic={false}
        >
          <Article />
        </DemoScrollContainer>
      )}
    </ExampleContainer>
  );
}

export function ArticleProgress({ caption }: { caption?: string }) {
  const articleRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: articleRef });

  return (
    <ExampleContainer
      caption={caption}
      className="max-h-75 w-full"
      inspector={[
        { name: "progress", label: "scrollYProgress", defaultValue: "0.0" },
      ]}
    >
      {({ setInspector }) => {
        scrollYProgress.on("change", (latest) => {
          setInspector("progress", formatDecimal(latest));
        });
        return (
          <div className="overflow-y-auto" ref={articleRef}>
            <Article />
          </div>
        );
      }}
    </ExampleContainer>
  );
}

export function BrokenArticleProgress({
  count,
  working = true,
  caption,
}: {
  count?: number;
  working?: boolean;
  caption?: string;
}) {
  const useShadows = working ? useFixedScrollShadows : useBrokenScrollShadows;
  const articleRef = useRef(null);
  const [start, end] = useShadows({ ref: articleRef });

  return (
    <ExampleContainer
      caption={caption}
      className="h-75 w-full items-stretch"
      controls={[
        {
          type: "switch",
          name: "showShadows",
          label: "Shadows",
          defaultValue: true,
        },
      ]}
      inspector={[
        { name: "start", label: "start", defaultValue: "0.0" },
        { name: "end", label: "end", defaultValue: "0.0" },
      ]}
    >
      {({ values, setInspector }) => {
        // biome-ignore lint/correctness/useHookAtTopLevel: render prop pattern
        useMotionValueEvent(start, "change", (latest) =>
          setInspector("start", formatDecimal(latest))
        );
        // biome-ignore lint/correctness/useHookAtTopLevel: render prop pattern
        useMotionValueEvent(end, "change", (latest) =>
          setInspector("end", formatDecimal(latest))
        );

        return (
          <div
            className="group flex grow flex-col overflow-y-auto [--size:36px]"
            ref={articleRef}
          >
            {values.showShadows && (
              <motion.div
                className="pointer-events-none sticky top-0 -mb-(--size) flex h-(--size) shrink-0 items-center justify-center bg-blue-400/30"
                style={{ opacity: start }}
              >
                <code className="text-sm">
                  opacity: {formatDecimal(start.get())}
                </code>
              </motion.div>
            )}

            <Article className="grow" count={count} />

            {values.showShadows && (
              <motion.div
                className="pointer-events-none sticky bottom-0 -mt-(--size) flex h-(--size) shrink-0 items-center justify-center bg-blue-400/30"
                style={{ opacity: end }}
              >
                <code className="text-sm">
                  opacity: {formatDecimal(end.get())}
                </code>
              </motion.div>
            )}
          </div>
        );
      }}
    </ExampleContainer>
  );
}

export function ArticleMarkupExample({ caption }: { caption?: string }) {
  return (
    <ExampleContainer
      caption={caption}
      className="max-h-75 w-full"
      controls={[
        {
          type: "slider",
          name: "size",
          label: "Size",
          min: 16,
          max: 64,
          step: 16,
          defaultValue: 48,
        },
      ]}
    >
      {({ values }) => (
        <div
          className="overflow-y-auto"
          style={{ "--size": `${values.size}px` } as React.CSSProperties}
        >
          <div className="pointer-events-none sticky top-0 -mb-(--size) flex h-(--size) shrink-0 items-center justify-center bg-blue-400/30">
            <code className="text-xs/none md:text-sm/none">{`{ top: 0, height: ${values.size}px, marginBottom: -${values.size}px }`}</code>
          </div>

          <Article />

          <div className="pointer-events-none sticky bottom-0 -mt-(--size) flex h-(--size) shrink-0 items-center justify-center bg-blue-400/30">
            <code className="text-xs/none md:text-sm/none">{`{ bottom: 0, height: ${values.size}px, marginTop: -${values.size}px }`}</code>
          </div>
        </div>
      )}
    </ExampleContainer>
  );
}

export function ArticleExample() {
  return (
    <ExampleContainer className="w-full" isolated>
      <ScrollContainer className="max-h-100 [--size:25px]">
        <Article />
      </ScrollContainer>
    </ExampleContainer>
  );
}

export function ArticleIframe() {
  return (
    <ExampleContainer className="w-full">
      <iframe
        className="h-full w-full"
        src="/examples/article"
        title="Article example"
      />
    </ExampleContainer>
  );
}

export function Article({
  count = 3,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <article className={cn("bg-white p-6 sm:px-10 sm:py-12", className)}>
      <Header />
      <Credits />
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

function Header() {
  return <p className="h-20 w-full rounded bg-zinc-200" />;
}

function Credits() {
  return (
    <div className="my-4 flex flex-row-reverse items-center gap-2 self-end">
      <div className="size-12 shrink-0 rounded-full bg-zinc-200" />
      <div className="flex w-1/3 flex-col gap-1">
        <p className="h-4 w-full rounded bg-zinc-200" />
        <p className="h-3 w-1/2 self-end rounded bg-zinc-200/90" />
      </div>
    </div>
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

function formatDecimal(num: number) {
  return num.toFixed(1);
}
