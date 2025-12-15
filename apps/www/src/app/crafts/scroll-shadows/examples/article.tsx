"use client";

import { Fragment, useRef, useState } from "react";
import { Slider } from "@mikeour/ui/slider";
import { Switch } from "@mikeour/ui/switch";
import { cn } from "@mikeour/ui/utils";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";

import { ExampleContainer } from "~/components/crafts/example-container";
import { DemoScrollContainer } from "./demo-scroll-container";
import { ScrollContainer } from "./scroll-container";
import {
  useBrokenScrollShadows,
  useFixedScrollShadows,
} from "./use-scroll-shadows";

export function InteractiveArticleExample() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isRealistic, _setIsRealistic] = useState(false);

  return (
    <ExampleContainer
      className="w-full"
      controls={
        <div className="relative flex select-none flex-col items-center gap-3 text-white md:flex-row md:justify-evenly">
          <div className="flex items-center gap-3">
            <Switch
              checked={isEnabled}
              className=""
              id="enabled"
              onCheckedChange={(val) => {
                if (typeof val === "boolean") {
                  setIsEnabled(val);
                }
              }}
            />

            <label className="text-base/none text-white" htmlFor="enabled">
              Toggle Shadows
            </label>
          </div>

          {/* <div className="flex items-center gap-3">
            <Switch
              id="realistic"
              checked={isRealistic}
              onCheckedChange={(val) => {
                if (typeof val === "boolean") {
                  setIsRealistic(val);
                }
              }}
            />
            <label
              htmlFor="realistic"
              className="text-base/none text-white"
            >
              Realistic Shadows
            </label>
          </div> */}
        </div>
      }
      mockBrowser
    >
      <DemoScrollContainer
        className="max-h-[400px] [--size:24px] md:[--size:36px]"
        isEnabled={isEnabled}
        isRealistic={isRealistic}
      >
        <Article />
      </DemoScrollContainer>
    </ExampleContainer>
  );
}

export function ArticleProgress() {
  const [progress, setProgress] = useState("0.0");
  const articleRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: articleRef });

  scrollYProgress.on("change", (latest) => {
    setProgress(formatDecimal(latest));
  });

  return (
    <ExampleContainer
      className="max-h-[300px] w-full"
      controls={
        <p className="my-0 flex items-center justify-center gap-2 text-center text-base/none tabular-nums">
          <code>
            scrollYProgress:
            <span className="!text-white"> {progress}</span>
          </code>
        </p>
      }
      mockBrowser
    >
      <div className="overflow-y-auto" ref={articleRef}>
        <Article />
      </div>
    </ExampleContainer>
  );
}

export function BrokenArticleProgress({
  count,
  working = true,
}: {
  count?: number;
  working?: boolean;
}) {
  const [showingShadows, setIsEnabled] = useState(false);

  const useShadows = working ? useFixedScrollShadows : useBrokenScrollShadows;

  const articleRef = useRef(null);
  const [start, end] = useShadows({ ref: articleRef });

  const [starting, setStarting] = useState(formatDecimal(start.get()));
  const [ending, setEnding] = useState(formatDecimal(end.get()));

  useMotionValueEvent(start, "change", (latest) =>
    setStarting(formatDecimal(latest))
  );
  useMotionValueEvent(end, "change", (latest) =>
    setEnding(formatDecimal(latest))
  );

  const shadowsId = `broken-enabled-shadows-${count}-${working ? 1 : 0}`;

  return (
    <ExampleContainer
      className="h-[300px] w-full items-stretch"
      controls={
        <div className="prose-p:my-0 flex flex-col items-center justify-center gap-6 prose-strong:text-white md:flex-row md:justify-between md:gap-4">
          <div className="flex items-center gap-3">
            <Switch
              checked={showingShadows}
              className=""
              id={shadowsId}
              onCheckedChange={(val) => {
                if (typeof val === "boolean") {
                  setIsEnabled(val);
                }
              }}
            />

            <label className="text-base/none text-white" htmlFor={shadowsId}>
              Toggle Shadows
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6">
            <p className="flex items-center gap-2 text-center text-base/none tabular-nums">
              <code>
                startingShadowVisibility:
                <span className="!text-white"> {starting}</span>
              </code>
            </p>

            <p className="flex items-center gap-2 text-center text-base/none tabular-nums">
              <code>
                endingShadowVisibility:
                <span className="!text-white"> {ending}</span>
              </code>
            </p>
          </div>
        </div>
      }
      mockBrowser
    >
      <div
        className="group flex grow flex-col overflow-y-auto [--size:36px]"
        ref={articleRef}
      >
        {!!showingShadows && (
          <motion.div
            className="-mb-[--size] pointer-events-none sticky top-0 flex h-[--size] shrink-0 items-center justify-center bg-blue-400/30"
            style={{ opacity: start }}
          >
            <code className="text-sm">opacity: {starting}</code>
          </motion.div>
        )}

        <Article className="grow" count={count} />

        {!!showingShadows && (
          <motion.div
            className="-mt-[--size] pointer-events-none sticky bottom-0 flex h-[--size] shrink-0 items-center justify-center bg-blue-400/30"
            style={{ opacity: end }}
          >
            <code className="text-sm">opacity: {ending}</code>
          </motion.div>
        )}
      </div>
    </ExampleContainer>
  );
}

export function ArticleMarkupExample() {
  const [size, setSize] = useState([48]);
  const articleRef = useRef(null);

  return (
    <ExampleContainer
      className="max-h-[300px] w-full"
      controls={
        <p className="my-0 flex items-center justify-center gap-4 text-center text-base/none tabular-nums">
          <code>size:</code>

          <Slider
            className="w-40"
            max={64}
            min={16}
            onValueChange={setSize}
            step={16}
            value={size}
          />

          <code>{size}px</code>
        </p>
      }
      mockBrowser
    >
      <div
        className="overflow-y-auto"
        ref={articleRef}
        style={{ "--size": `${size}px` } as React.CSSProperties}
      >
        <div className="-mb-[--size] pointer-events-none sticky top-0 flex h-[--size] shrink-0 items-center justify-center bg-blue-400/30">
          <code className="text-xs/none md:text-sm/none">{`{ top: 0, height: ${size}px, marginBottom: -${size}px }`}</code>
        </div>

        <Article />

        <div className="-mt-[--size] pointer-events-none sticky bottom-0 flex h-[--size] shrink-0 items-center justify-center bg-blue-400/30">
          <code className="text-xs/none md:text-sm/none">{`{ bottom: 0, height: ${size}px, marginTop: -${size}px }`}</code>
        </div>
      </div>
    </ExampleContainer>
  );
}

export function ArticleExample() {
  return (
    <ExampleContainer className="w-full" isolated mockBrowser>
      <ScrollContainer className="max-h-[400px] [--size:25px]">
        <Article />
      </ScrollContainer>
    </ExampleContainer>
  );
}

export function ArticleIframe() {
  return (
    <ExampleContainer className="w-full" mockBrowser>
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
          // biome-ignore lint/suspicious/noArrayIndexKey: static content
          <Fragment key={`block-a-${index}`}>
            <TextBlockA />
            <TextBlockB />
          </Fragment>
        ))}

        {count > 2 && <ImageBlock />}

        {Array.from({ length: count }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static content
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
      <div className="aspect-[7/3] w-full rounded bg-zinc-200" />
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
