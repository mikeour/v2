"use client";

import { useEffect, useRef } from "react";
import { type MotionValue, useScroll } from "framer-motion";

import { Article } from "../shared/components";

type ScrollProgressProps = {
  /** Called when scroll progress changes */
  onScrollProgressChange?: (progress: MotionValue<number>) => void;
};

export default function ScrollProgress({
  onScrollProgressChange,
}: ScrollProgressProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: ref });

  useEffect(() => {
    onScrollProgressChange?.(scrollYProgress);
  }, [scrollYProgress, onScrollProgressChange]);

  return (
    <div ref={ref} className="max-h-75 w-full overflow-y-auto overscroll-none">
      <Article />
    </div>
  );
}
