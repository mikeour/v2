"use client";

import { useRef } from "react";
import { motion, useMotionValueEvent } from "framer-motion";

import { Article } from "../shared/components";
import { useBrokenScrollShadows } from "../shared/hooks";

type BrokenProgressOverflowDemoProps = {
  onStartChange?: (value: number) => void;
  onEndChange?: (value: number) => void;
};

export default function BrokenProgressOverflowDemo({
  onStartChange,
  onEndChange,
}: BrokenProgressOverflowDemoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [start, end] = useBrokenScrollShadows({ ref });

  useMotionValueEvent(start, "change", (latest) => onStartChange?.(latest));
  useMotionValueEvent(end, "change", (latest) => onEndChange?.(latest));

  return (
    <div
      ref={ref}
      className="group flex h-75 w-full grow flex-col overflow-y-auto overscroll-none [--size:36px]"
      data-fill-width
    >
      <motion.div
        className="pointer-events-none sticky top-0 -mb-(--size) flex h-(--size) shrink-0 items-center justify-center bg-blue-400/30"
        style={{ opacity: start }}
      />

      <Article className="grow" count={3} />

      <motion.div
        className="pointer-events-none sticky bottom-0 -mt-(--size) flex h-(--size) shrink-0 items-center justify-center bg-blue-400/30"
        style={{ opacity: end }}
      />
    </div>
  );
}
