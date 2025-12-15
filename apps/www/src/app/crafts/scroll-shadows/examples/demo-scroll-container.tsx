"use client";

import { useRef } from "react";
import { cn } from "@mikeour/ui/utils";
import { motion } from "framer-motion";

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
      className={cn(
        "group relative flex",
        "data-[axis=x]:flex-row data-[axis=x]:overflow-x-auto",
        "data-[axis=y]:flex-col data-[axis=y]:overflow-y-auto",
        className
      )}
      data-axis={axis}
      ref={ref}
    >
      {!!isEnabled && (
        <motion.div
          className={cn(
            "pointer-events-none sticky shrink-0 origin-top",
            "group-data-[axis=x]:-mr-(--size) group-data-[axis=x]:top-0 group-data-[axis=x]:bottom-0 group-data-[axis=x]:left-0 group-data-[axis=x]:w-(--size)",
            "group-data-[axis=y]:-mb-(--size) group-data-[axis=y]:top-0 group-data-[axis=y]:h-(--size)",
            isRealistic
              ? "bg-linear-to-b from-slate-900/50 to-slate-50/0"
              : "bg-blue-400/35"
          )}
          style={{ opacity: start, scaleY: start }}
        />
      )}

      {children}

      {!!isEnabled && (
        <motion.div
          className={cn(
            "pointer-events-none sticky shrink-0 origin-bottom",
            "group-data-[axis=x]:-ml-(--size) group-data-[axis=x]:top-0 group-data-[axis=x]:right-0 group-data-[axis=x]:bottom-0 group-data-[axis=x]:w-(--size)",
            "group-data-[axis=y]:-mt-(--size) group-data-[axis=y]:bottom-0 group-data-[axis=y]:h-(--size)",
            isRealistic
              ? "bg-linear-to-t from-slate-900/50 to-slate-50/0"
              : "bg-blue-400/35"
          )}
          style={{ opacity: end, scaleY: end }}
        />
      )}
    </div>
  );
}
