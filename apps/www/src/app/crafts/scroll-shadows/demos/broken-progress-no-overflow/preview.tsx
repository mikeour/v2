"use client";

import { useEffect, useRef } from "react";
import { type MotionValue, motion } from "framer-motion";

import { Article } from "../shared/components";
import { useBrokenScrollShadows } from "../shared/hooks";

type BrokenProgressNoOverflowProps = {
  showShadows?: boolean;
  onOpacityChange?: (
    start: MotionValue<number>,
    end: MotionValue<number>
  ) => void;
};

export default function BrokenProgressNoOverflow({
  showShadows = true,
  onOpacityChange,
}: BrokenProgressNoOverflowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [start, end] = useBrokenScrollShadows({ ref });

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
        />
      )}

      <Article className="grow" count={0} />

      {showShadows && (
        <motion.div
          className="pointer-events-none sticky bottom-0 -mt-(--size) flex h-(--size) shrink-0 items-center justify-center bg-blue-400/30"
          style={{ opacity: end }}
        />
      )}
    </div>
  );
}
