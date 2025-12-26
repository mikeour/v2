"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

import { Carousel } from "../shared/components";
import { useScrollShadows } from "../shared/hooks";

export default function Demo() {
  const ref = useRef<HTMLDivElement>(null);
  const [start, end] = useScrollShadows({ ref, axis: "x" });

  return (
    <div
      ref={ref}
      className="group relative flex max-h-100 w-full flex-row overflow-x-auto overscroll-none bg-white [--size:25px]"
    >
      <motion.div
        className="pointer-events-none sticky top-0 bottom-0 left-0 -mr-(--size) w-(--size) shrink-0 bg-blue-400/30"
        style={{ opacity: start }}
      />
      <Carousel />
      <motion.div
        className="pointer-events-none sticky top-0 right-0 bottom-0 -ml-(--size) w-(--size) shrink-0 bg-blue-400/30"
        style={{ opacity: end }}
      />
    </div>
  );
}
