"use client";

import { useRef } from "react";
import { cn } from "@mikeour/ui/utils";
import { motion } from "framer-motion";

import { useBrokenScrollShadows } from "./use-scroll-shadows";

export function ScrollContainer({
  className,
  children,
}: React.PropsWithChildren<{
  className?: string;
}>) {
  const ref = useRef<HTMLDivElement>(null);
  const [start, end] = useBrokenScrollShadows({ ref });

  return (
    <div
      className={cn("group relative flex flex-col overflow-y-auto", className)}
      ref={ref}
    >
      <motion.div
        className="pointer-events-none sticky top-0 -mb-(--size) h-(--size) shrink-0 bg-blue-400/30"
        style={{ opacity: start }}
      />

      {children}

      <motion.div
        className="pointer-events-none sticky bottom-0 -mt-(--size) h-(--size) shrink-0 bg-blue-400/30"
        style={{ opacity: end }}
      />
    </div>
  );
}
