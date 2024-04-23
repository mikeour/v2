"use client";

import { useRef, useState } from "react";
import { useScroll } from "framer-motion";
import { ExampleContainer } from "~/components/crafts/example-container";
import { Carousel } from "./carousel";
import { useBrokenScrollShadows } from "./use-scroll-shadows";

export function ProgressExample({ count }: { count?: number }) {
  const [progress, setProgress] = useState("0.0");
  const carouselRef = useRef(null);
  const { scrollXProgress } = useScroll({ container: carouselRef });

  scrollXProgress.on("change", (latest) => {
    setProgress(formatDecimal(latest));
  });

  return (
    <ExampleContainer
      className="w-full"
      controls={
        <p className="my-0 text-center tabular-nums">
          <code>scrollXProgress</code> is {progress}
        </p>
      }
    >
      <div
        ref={carouselRef}
        className="group relative flex w-full flex-row overflow-x-auto bg-white"
      >
        <Carousel count={count} className="bg-white" />
      </div>
    </ExampleContainer>
  );
}

export function BrokenProgressExample({ count }: { count?: number }) {
  const [starting, setStarting] = useState("0.0");
  const [ending, setEnding] = useState("0.0");
  const [progress, setProgress] = useState("0.0");
  const carouselRef = useRef(null);

  const [start, end, scrollXProgress] = useBrokenScrollShadows({
    ref: carouselRef,
  });

  start.on("change", (latest) => setStarting(formatDecimal(latest)));
  end.on("change", (latest) => setEnding(formatDecimal(latest)));
  scrollXProgress.on("change", (latest) =>
    setProgress(formatDecimal(latest))
  );

  return (
    <ExampleContainer
      className="w-full"
      mockBrowser
      controls={
        <div className="flex flex-col items-center justify-center gap-2 prose-p:my-0 md:flex-row md:justify-evenly">
          <p className="text-center tabular-nums">
            <code>startShadowVisibility</code> is {starting}
          </p>

          <p className="text-center tabular-nums">
            <code>endingShadowVisibility</code> is {ending}
          </p>
        </div>
      }
    >
      <div
        ref={carouselRef}
        className="group relative flex w-full flex-row overflow-x-auto bg-white"
      >
        <Carousel count={count} className="bg-white" />
      </div>
    </ExampleContainer>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="inline-flex items-center gap-2 overflow-hidden rounded bg-slate-800 pl-2 text-slate-50 shadow">
      <p className="text-base/none text-slate-50">{label}</p>

      <p className="bg-slate-50 py-2 pl-2 pr-2 text-base/none font-semibold tabular-nums text-slate-800">
        {value}
      </p>
    </div>
  );
}

function formatDecimal(num: number): string {
  return num.toFixed(1);
}
