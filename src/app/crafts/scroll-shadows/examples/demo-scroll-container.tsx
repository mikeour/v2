"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";
import { useScrollShadows } from "./use-scroll-shadows";

export function DemoScrollContainer({
  isEnabled,
  isRealistic,
  axis = "y",
  className,
  children,
}: React.PropsWithChildren<{
  isEnabled: boolean;
  isRealistic: boolean;
  axis?: "x" | "y";
  className?: string;
}>) {
  const ref = useRef<HTMLDivElement>(null);
  const [start, end] = useScrollShadows({ ref, axis });

  return (
    <div
      ref={ref}
      data-axis={axis}
      className={cn(
        "group relative flex",
        "data-[axis=x]:flex-row data-[axis=x]:overflow-x-auto",
        "data-[axis=y]:flex-col data-[axis=y]:overflow-y-auto",
        className
      )}
    >
      {isEnabled && (
        <motion.div
          style={{ opacity: start, scaleY: start }}
          className={cn(
            "pointer-events-none sticky shrink-0 origin-top ",
            "group-data-[axis=x]:bottom-0 group-data-[axis=x]:left-0 group-data-[axis=x]:top-0 group-data-[axis=x]:-mr-[--size] group-data-[axis=x]:w-[--size]",
            "group-data-[axis=y]:top-0 group-data-[axis=y]:-mb-[--size] group-data-[axis=y]:h-[--size]",
            isEnabled && isRealistic
              ? "bg-gradient-to-b from-slate-900/50 to-slate-50/0"
              : "bg-blue-400/35"
          )}
        />
      )}

      {children}

      {isEnabled && (
        <motion.div
          style={{ opacity: end, scaleY: end }}
          className={cn(
            "pointer-events-none sticky shrink-0 origin-bottom",
            "group-data-[axis=x]:bottom-0 group-data-[axis=x]:right-0 group-data-[axis=x]:top-0 group-data-[axis=x]:-ml-[--size] group-data-[axis=x]:w-[--size]",
            "group-data-[axis=y]:bottom-0 group-data-[axis=y]:-mt-[--size] group-data-[axis=y]:h-[--size]",
            isEnabled && isRealistic
              ? "bg-gradient-to-t from-slate-900/50 to-slate-50/0"
              : "bg-blue-400/35"
          )}
        />
      )}
    </div>
  );
}
