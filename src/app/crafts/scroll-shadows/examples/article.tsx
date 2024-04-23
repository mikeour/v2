"use client";

import { forwardRef, Fragment, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { ExampleContainer } from "~/components/crafts/example-container";
import { Slider } from "~/components/ui/slider";
import { Switch } from "~/components/ui/switch";
import { cn } from "~/lib/utils";
import { DemoScrollContainer } from "./demo-scroll-container";
import { ScrollContainer } from "./scroll-container";
import {
  useBrokenScrollShadows,
  useFixedScrollShadows,
} from "./use-scroll-shadows";

export function InteractiveArticleExample() {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isRealistic, setIsRealistic] = useState(false);

  return (
    <ExampleContainer
      mockBrowser
      className="w-full"
      controls={
        <div className="relative flex select-none flex-col items-center gap-3 text-white md:flex-row md:justify-evenly">
          <div className="flex items-center gap-3">
            <Switch
              id="enabled"
              checked={isEnabled}
              onCheckedChange={(val) => {
                if (typeof val === "boolean") {
                  setIsEnabled(val);
                }
              }}
              className=""
            />

            <label
              htmlFor="enabled"
              className="text-base/none text-white"
            >
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
    >
      <DemoScrollContainer
        isEnabled={isEnabled}
        isRealistic={isRealistic}
        className="max-h-[400px] [--size:24px] md:[--size:36px]"
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
      mockBrowser
      controls={
        <p className="my-0 flex items-center justify-center gap-2 text-center text-base/none tabular-nums">
          <code>
            scrollYProgress:
            <span className="!text-white"> {progress}</span>
          </code>
        </p>
      }
    >
      <div ref={articleRef} className="overflow-y-auto">
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

  const useShadows = working
    ? useFixedScrollShadows
    : useBrokenScrollShadows;

  const articleRef = useRef(null);
  const [start, end] = useShadows({ ref: articleRef });

  const [starting, setStarting] = useState(
    formatDecimal(start.get())
  );
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
      mockBrowser
      controls={
        <div className="flex flex-col items-center justify-center gap-6 prose-p:my-0 prose-strong:text-white md:flex-row md:justify-between md:gap-4">
          <div className="flex items-center gap-3">
            <Switch
              id={shadowsId}
              checked={showingShadows}
              onCheckedChange={(val) => {
                if (typeof val === "boolean") {
                  setIsEnabled(val);
                }
              }}
              className=""
            />

            <label
              htmlFor={shadowsId}
              className="text-base/none text-white"
            >
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
    >
      <div
        ref={articleRef}
        className="group flex grow flex-col overflow-y-auto [--size:36px]"
      >
        {showingShadows && (
          <motion.div
            style={{ opacity: start }}
            className="pointer-events-none sticky top-0 -mb-[--size] flex h-[--size] shrink-0 items-center justify-center bg-blue-400/30"
          >
            <code className="text-sm">opacity: {starting}</code>
          </motion.div>
        )}

        <Article count={count} className="grow" />

        {showingShadows && (
          <motion.div
            style={{ opacity: end }}
            className="pointer-events-none sticky bottom-0 -mt-[--size] flex h-[--size] shrink-0 items-center justify-center bg-blue-400/30"
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
  const { scrollYProgress } = useScroll({ container: articleRef });

  return (
    <ExampleContainer
      className="max-h-[300px] w-full"
      mockBrowser
      controls={
        <p className="my-0 flex items-center justify-center gap-4 text-center text-base/none tabular-nums">
          <code>size:</code>

          <Slider
            value={size}
            onValueChange={setSize}
            max={64}
            min={16}
            step={16}
            className="w-40"
          />

          <code>{size}px</code>
        </p>
      }
    >
      <div
        ref={articleRef}
        className="overflow-y-auto"
        style={{ ["--size"]: `${size}px` } as any}
      >
        <div className="pointer-events-none sticky top-0 -mb-[--size] flex h-[--size] shrink-0 items-center justify-center bg-blue-400/30">
          <code className="text-xs/none md:text-sm/none">{`{ top: 0, height: ${size}px, marginBottom: -${size}px }`}</code>
        </div>

        <Article />

        <div className="pointer-events-none sticky bottom-0 -mt-[--size] flex h-[--size] shrink-0 items-center justify-center bg-blue-400/30">
          <code className="text-xs/none md:text-sm/none">{`{ bottom: 0, height: ${size}px, marginTop: -${size}px }`}</code>
        </div>
      </div>
    </ExampleContainer>
  );
}

export function ArticleExample() {
  return (
    <ExampleContainer mockBrowser isolated className="w-full">
      <ScrollContainer className="max-h-[400px] [--size:25px]">
        <Article />
      </ScrollContainer>
    </ExampleContainer>
  );
}

export function ArticleIframe() {
  return (
    <ExampleContainer mockBrowser className="w-full">
      <iframe src="/examples/article" className="h-full w-full" />
    </ExampleContainer>
  );
}

export const Article = forwardRef<
  HTMLDivElement,
  { count?: number; className?: string }
>(function Article(props, ref) {
  const { count = 3, className } = props;

  return (
    <article
      ref={ref}
      className={cn("bg-white p-6 sm:px-10 sm:py-12", className)}
    >
      <Header />

      <Credits />

      <div className="mt-6 flex flex-col items-center gap-6">
        {Array.from({ length: count }).map((_, index) => {
          return (
            <Fragment key={index}>
              <TextBlockA />
              <TextBlockB />
            </Fragment>
          );
        })}

        {count > 2 && <ImageBlock />}

        {Array.from({ length: count }).map((_, index) => {
          return (
            <Fragment key={index}>
              <TextBlockA />
              <TextBlockB />
            </Fragment>
          );
        })}

        {count > 2 && (
          <>
            <ImageBlock />
            <TextBlockA />
          </>
        )}
      </div>
    </article>
  );
});

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
      <p className="h-4 w-2/6 self-end rounded bg-zinc-200"></p>
    </div>
  );
}

function TextBlockA() {
  return (
    <div className="space-y-2 self-stretch text-sm">
      <p className="h-4 w-full rounded bg-zinc-200"></p>
      <p className="h-4 w-full rounded bg-zinc-200"></p>
      <p className="h-4 w-full rounded bg-zinc-200"></p>
      <p className="h-4 w-full rounded bg-zinc-200"></p>
      <p className="h-4 w-2/6 rounded bg-zinc-200"></p>
    </div>
  );
}

function TextBlockB() {
  return (
    <div className="space-y-2 self-stretch text-sm">
      <p className="h-4 w-full rounded bg-zinc-200"></p>
      <p className="h-4 w-full rounded bg-zinc-200"></p>
      <p className="h-4 w-full rounded bg-zinc-200"></p>
      <p className="h-4 w-4/6 rounded bg-zinc-200"></p>
    </div>
  );
}

function formatDecimal(num: number) {
  return num.toFixed(1);
}
