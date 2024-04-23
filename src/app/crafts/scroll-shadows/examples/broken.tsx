"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";
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
      ref={ref}
      className={cn(
        "group relative flex flex-col overflow-y-auto",
        className
      )}
    >
      <motion.div
        style={{ opacity: start }}
        className="pointer-events-none sticky top-0 -mb-[--size] h-[--size] shrink-0 bg-blue-400/30"
      />

      {children}

      <motion.div
        style={{ opacity: end }}
        className="pointer-events-none sticky bottom-0 -mt-[--size] h-[--size] shrink-0 bg-blue-400/30"
      />
    </div>
  );
}
