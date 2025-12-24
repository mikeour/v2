"use client";

import { useRef } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";

import { Article } from "../shared/components";

export default function Demo({
  onProgressChange,
}: {
  onProgressChange?: (value: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: ref });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    onProgressChange?.(latest);
  });

  return (
    <div
      ref={ref}
      className="max-h-75 w-full overflow-y-auto overscroll-none"
      data-fill-width
    >
      <Article />
    </div>
  );
}
