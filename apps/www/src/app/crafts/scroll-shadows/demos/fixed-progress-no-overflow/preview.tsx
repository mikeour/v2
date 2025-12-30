"use client";

import { useEffect, useRef } from "react";
import { type MotionValue, motion } from "framer-motion";

import { Article } from "../shared/components";
import { formatDecimal, useFixedScrollShadows } from "../shared/hooks";

type FixedProgressNoOverflowProps = {
  showShadows?: boolean;
  onOpacityChange?: (
    start: MotionValue<number>,
    end: MotionValue<number>
  ) => void;
};

export default function FixedProgressNoOverflow({
  showShadows = true,
  onOpacityChange,
}: FixedProgressNoOverflowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [start, end] = useFixedScrollShadows({ ref });

  useEffect(() => {
    onOpacityChange?.(start, end);
  }, [start, end, onOpacityChange]);

  return (
    <div
      ref={ref}
      className="group flex h-75 w-full grow flex-col overflow-y-auto [--size:36px]"
      data-fill-width
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
