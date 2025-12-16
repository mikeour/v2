"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";

import { ExampleContainer } from "~/components/crafts/example-container";
import { Carousel } from "./carousel";
import { useBrokenScrollShadows } from "./use-scroll-shadows";

export function ProgressExample({ count }: { count?: number }) {
  const carouselRef = useRef(null);
  const { scrollXProgress } = useScroll({ container: carouselRef });

  return (
    <ExampleContainer
      className="w-full"
      inspector={[
        { name: "progress", label: "scrollXProgress", defaultValue: "0.0" },
      ]}
    >
      {({ setInspector }) => {
        scrollXProgress.on("change", (latest) => {
          setInspector("progress", formatDecimal(latest));
        });
        return (
          <div
            className="group relative flex w-full flex-row overflow-x-auto bg-white"
            ref={carouselRef}
          >
            <Carousel className="bg-white" count={count} />
          </div>
        );
      }}
    </ExampleContainer>
  );
}

export function BrokenProgressExample({ count }: { count?: number }) {
  const carouselRef = useRef(null);
  const [start, end] = useBrokenScrollShadows({ ref: carouselRef });

  return (
    <ExampleContainer
      className="w-full"
      inspector={[
        { name: "start", label: "startShadowVisibility", defaultValue: "0.0" },
        { name: "end", label: "endingShadowVisibility", defaultValue: "0.0" },
      ]}
    >
      {({ setInspector }) => {
        start.on("change", (latest) =>
          setInspector("start", formatDecimal(latest))
        );
        end.on("change", (latest) =>
          setInspector("end", formatDecimal(latest))
        );
        return (
          <div
            className="group relative flex w-full flex-row overflow-x-auto bg-white"
            ref={carouselRef}
          >
            <Carousel className="bg-white" count={count} />
          </div>
        );
      }}
    </ExampleContainer>
  );
}

function formatDecimal(num: number): string {
  return num.toFixed(1);
}
