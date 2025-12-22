"use client";

import { Fragment, useRef } from "react";
import { cn } from "@mikeour/ui/lib/utils";
import {
  type MotionValue,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";

import { ExampleContainer } from "~/components/crafts/example-container";

// =============================================================================
// Hooks
// =============================================================================

type AxisType = "x" | "y";

function useScrollShadows({
  ref,
  axis,
}: {
  ref: React.RefObject<HTMLElement | null>;
  axis: AxisType;
}) {
  const { scrollXProgress, scrollYProgress } = useScroll({ container: ref });
  const scrollProgress = axis === "x" ? scrollXProgress : scrollYProgress;

  const isOverflowing = (element: HTMLElement) =>
    axis === "x"
      ? element.scrollWidth > element.clientWidth
      : element.scrollHeight > element.clientHeight;

  const startingShadowVisibility = useTransform(scrollProgress, (latest) => {
    const element = ref.current;
    if (element === null) {
      return latest;
    }
    return isOverflowing(element) ? latest : 0;
  });

  const endingShadowVisibility = useTransform(
    scrollProgress,
    (latest) => 1 - latest
  );

  return [startingShadowVisibility, endingShadowVisibility] as const;
}

function useBrokenScrollShadows<T extends HTMLElement>({
  ref,
}: {
  ref: React.RefObject<T | null>;
}) {
  const { scrollYProgress } = useScroll({ container: ref });
  const endingShadowVisibility = useTransform(
    scrollYProgress,
    (latest) => 1 - latest
  );
  return [scrollYProgress, endingShadowVisibility, scrollYProgress] as const;
}

function useFixedScrollShadows<T extends HTMLElement>({
  ref,
}: {
  ref: React.RefObject<T | null>;
}) {
  const { scrollYProgress } = useScroll({ container: ref });

  const startingShadowVisibility = useTransform(scrollYProgress, (latest) => {
    const element = ref.current;
    if (element === null) {
      return latest;
    }
    const isOverflowing = element.scrollHeight > element.clientHeight;
    return isOverflowing ? latest : 0;
  });

  const endingShadowVisibility = useTransform(scrollYProgress, (latest) => {
    const element = ref.current;
    if (element === null) {
      return latest;
    }
    const isOverflowing = element.scrollHeight > element.clientHeight;
    return isOverflowing ? 1 - latest : 0;
  });

  return [
    startingShadowVisibility,
    endingShadowVisibility,
    scrollYProgress,
  ] as const;
}

// =============================================================================
// Internal Components
// =============================================================================

function ScrollContainer({
  axis = "y",
  className,
  children,
}: React.PropsWithChildren<{
  axis?: "x" | "y";
  className?: string;
}>) {
  const ref = useRef<HTMLDivElement>(null);
  const [start, end] = useScrollShadows({ ref, axis });

  return (
    <div
      className={cn(
        "group relative flex",
        "data-[axis=x]:flex-row data-[axis=x]:overflow-x-auto",
        "data-[axis=y]:flex-col data-[axis=y]:overflow-y-auto",
        className
      )}
      data-axis={axis}
      ref={ref}
    >
      <motion.div
        className={cn(
          "pointer-events-none sticky shrink-0 bg-blue-400/30",
          "group-data-[axis=x]:top-0 group-data-[axis=x]:bottom-0 group-data-[axis=x]:left-0 group-data-[axis=x]:-mr-(--size) group-data-[axis=x]:w-(--size)",
          "group-data-[axis=y]:top-0 group-data-[axis=y]:-mb-(--size) group-data-[axis=y]:h-(--size)"
        )}
        style={{ opacity: start }}
      />
      {children}
      <motion.div
        className={cn(
          "pointer-events-none sticky shrink-0 bg-blue-400/30",
          "group-data-[axis=x]:top-0 group-data-[axis=x]:right-0 group-data-[axis=x]:bottom-0 group-data-[axis=x]:-ml-(--size) group-data-[axis=x]:w-(--size)",
          "group-data-[axis=y]:bottom-0 group-data-[axis=y]:-mt-(--size) group-data-[axis=y]:h-(--size)"
        )}
        style={{ opacity: end }}
      />
    </div>
  );
}

function DemoScrollContainer({
  isEnabled,
  isRealistic,
  axis = "y",
  className,
  children,
}: React.PropsWithChildren<{
  isEnabled: boolean;
  isRealistic: boolean;
  axis?: "x" | "y";
  className?: string;
}>) {
  const ref = useRef<HTMLDivElement>(null);
  const [start, end] = useScrollShadows({ ref, axis });

  return (
    <div
      className={cn(
        "group relative flex",
        "data-[axis=x]:flex-row data-[axis=x]:overflow-x-auto",
        "data-[axis=y]:flex-col data-[axis=y]:overflow-y-auto",
        className
      )}
      data-axis={axis}
      ref={ref}
    >
      {!!isEnabled && (
        <motion.div
          className={cn(
            "pointer-events-none sticky shrink-0 origin-top",
            "group-data-[axis=x]:top-0 group-data-[axis=x]:bottom-0 group-data-[axis=x]:left-0 group-data-[axis=x]:-mr-(--size) group-data-[axis=x]:w-(--size)",
            "group-data-[axis=y]:top-0 group-data-[axis=y]:-mb-(--size) group-data-[axis=y]:h-(--size)",
            isRealistic
              ? "bg-linear-to-b from-slate-900/50 to-slate-50/0"
              : "bg-blue-400/35"
          )}
          style={{ opacity: start, scaleY: start }}
        />
      )}

      {children}

      {!!isEnabled && (
        <motion.div
          className={cn(
            "pointer-events-none sticky shrink-0 origin-bottom",
            "group-data-[axis=x]:top-0 group-data-[axis=x]:right-0 group-data-[axis=x]:bottom-0 group-data-[axis=x]:-ml-(--size) group-data-[axis=x]:w-(--size)",
            "group-data-[axis=y]:bottom-0 group-data-[axis=y]:-mt-(--size) group-data-[axis=y]:h-(--size)",
            isRealistic
              ? "bg-linear-to-t from-slate-900/50 to-slate-50/0"
              : "bg-blue-400/35"
          )}
          style={{ opacity: end, scaleY: end }}
        />
      )}
    </div>
  );
}

function Article({
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

function Carousel({
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

function formatDecimal(num: number) {
  return num.toFixed(1);
}

// =============================================================================
// Exported Demo Components
// =============================================================================

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
      isolated
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
      isolated
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
                  opacity: {formatDecimal((start as MotionValue<number>).get())}
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
                  opacity: {formatDecimal((end as MotionValue<number>).get())}
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

export function CarouselExample({ count }: { count?: number }) {
  return (
    <ExampleContainer className="w-full" isolated>
      <ScrollContainer
        axis="x"
        className="max-h-100 w-full bg-white [--size:25px]"
      >
        <Carousel count={count} />
      </ScrollContainer>
    </ExampleContainer>
  );
}
