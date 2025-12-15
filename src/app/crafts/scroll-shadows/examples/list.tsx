"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { ExampleContainer } from "~/components/crafts/example-container";
import { cn } from "~/utils";
import { ScrollContainer } from "./scroll-container";

export function ListExample() {
  return (
    <ExampleContainer className="w-full sm:max-w-[420px]" isolated mockBrowser>
      <ScrollContainer className="max-h-[400px] bg-white [--size:25px]">
        <List />
      </ScrollContainer>
    </ExampleContainer>
  );
}

export function BasicListExample() {
  return (
    <ExampleContainer className="w-full sm:max-w-[420px]" isolated mockBrowser>
      <div
        className={cn(
          "relative flex max-h-[400px] flex-col overflow-y-auto [--size:48px]"
        )}
      >
        <div className="-mb-[--size] pointer-events-none sticky top-0 flex h-[--size] shrink-0 items-center justify-center bg-blue-400/30">
          <code className="text-sm/none">{"{ top: 0 }"}</code>
        </div>

        <List />

        <div className="-mt-[--size] pointer-events-none sticky bottom-0 flex h-[--size] shrink-0 items-center justify-center bg-blue-400/30">
          <code className="text-sm/none">{"{ bottom: 0 }"}</code>
        </div>
      </div>
    </ExampleContainer>
  );
}

export function List() {
  return (
    <ul className="divide-y divide-zinc-200 bg-white">
      {Array.from({ length: 30 }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static content
        <li className="flex gap-4 p-5" key={index}>
          <span className="size-4 rounded bg-zinc-200" />
          <p
            className={cn(
              "h-4 rounded bg-zinc-200",
              index % 0 === 0 && "w-3/4",
              index % 1 === 0 && "w-2/4",
              index % 2 === 0 && "w-1/4",
              index % 3 === 0 && "w-full"
            )}
          />
        </li>
      ))}
    </ul>
  );
}

export function PlainList() {
  const ref = useRef(null);
  const [start, end] = useScrollProgress({ ref });

  return (
    <ExampleContainer className="w-full" isolated mockBrowser>
      <div
        className={cn(
          "relative flex max-h-[400px] flex-col overflow-y-auto [--size:48px]"
        )}
        ref={ref}
      >
        <div
          className="-mb-[--size] pointer-events-none sticky top-0 flex h-[--size] shrink-0 items-center justify-center bg-blue-400/30"
          style={{ opacity: start }}
        >
          <code>{`{ start: ${start.toFixed(1)} }`}</code>
        </div>

        <List />

        <div
          className="-mt-[--size] pointer-events-none sticky bottom-0 flex h-[--size] shrink-0 items-center justify-center bg-blue-400/30"
          style={{ opacity: end }}
        >
          <code>{`{ end: ${end.toFixed(1)} }`}</code>
        </div>
      </div>
    </ExampleContainer>
  );
}

function useScrollProgress({ ref }: { ref: React.RefObject<HTMLElement> }) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isOverflowing, setIsOverflowing] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    function handleScroll() {
      if (element) {
        const { scrollTop, scrollHeight, clientHeight } = element;
        const maxScroll = scrollHeight - clientHeight;
        const currentScroll = Math.min(scrollTop / maxScroll, 1);

        setScrollProgress(roundToDecimal(currentScroll, 1));
      }
    }

    element.addEventListener("scroll", handleScroll);

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [ref]);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) {
      return;
    }

    function checkOverflow() {
      if (element) {
        setIsOverflowing(element.offsetHeight < element.scrollHeight);
      }
    }

    checkOverflow();

    window.addEventListener("resize", checkOverflow);

    return () => {
      window.removeEventListener("resize", checkOverflow);
    };
  }, [ref]);

  if (isOverflowing) {
    return [format(scrollProgress), format(1 - scrollProgress)];
  }

  return [0, 0];
}

function format(number: number) {
  return Number.parseFloat(number.toFixed(1));
}

function roundToDecimal(number: number, decimals: number) {
  const powerOfTen = 10 ** decimals;
  return Math.round(number * powerOfTen) / powerOfTen;
}
