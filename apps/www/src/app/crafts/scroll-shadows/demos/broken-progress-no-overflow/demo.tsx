"use client";

import { useRef } from "react";
import { type MotionValue, motion, useMotionValueEvent } from "framer-motion";

import { Article } from "../shared/components";
import { formatDecimal, useBrokenScrollShadows } from "../shared/hooks";

type DemoProps = {
  showShadows?: boolean;
  onStartChange?: (value: number) => void;
  onEndChange?: (value: number) => void;
};

export default function Demo({
  showShadows = true,
  onStartChange,
  onEndChange,
}: DemoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [start, end] = useBrokenScrollShadows({ ref });

  useMotionValueEvent(start, "change", (latest) => onStartChange?.(latest));
  useMotionValueEvent(end, "change", (latest) => onEndChange?.(latest));

  return (
    <div
      ref={ref}
      className="group flex h-75 grow flex-col overflow-y-auto [--size:36px]"
    >
      {showShadows && (
        <motion.div
          className="pointer-events-none sticky top-0 -mb-(--size) flex h-(--size) shrink-0 items-center justify-center bg-blue-400/30"
          style={{ opacity: start }}
        >
          <code className="text-sm">
            opacity: {formatDecimal((start as MotionValue<number>).get())}
          </code>
        </motion.div>
      )}
      <Article className="grow" count={0} />
      {showShadows && (
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
}
