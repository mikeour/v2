"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

import { Article } from "../shared/components";
import { useScrollShadows } from "../shared/hooks";

export default function ScrollShadowsInteractive() {
  const ref = useRef<HTMLDivElement>(null);
  const [start, end] = useScrollShadows({ ref, axis: "y" });

  return (
    <div
      ref={ref}
      className="group relative flex max-h-100 w-full flex-col overflow-y-auto overscroll-none [--size:24px] md:[--size:36px]"
      data-fill-width
    >
      <motion.div
        className="pointer-events-none sticky top-0 -mb-(--size) h-(--size) shrink-0 origin-top bg-linear-to-b from-slate-900/50 to-slate-50/0"
        style={{ opacity: start, scaleY: start }}
      />
      <Article />
      <motion.div
        className="pointer-events-none sticky bottom-0 -mt-(--size) h-(--size) shrink-0 origin-bottom bg-linear-to-t from-slate-900/50 to-slate-50/0"
        style={{ opacity: end, scaleY: end }}
      />
    </div>
  );
}
