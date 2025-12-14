"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

import { cn } from "~/utils";
import { useBrokenScrollShadows, useScrollShadows } from "./use-scroll-shadows";

export function ScrollContainer({
  axis = "y",
  className,
  children,
}: React.PropsWithChildren<{
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
      <motion.div
        className={cn(
          "pointer-events-none sticky shrink-0 bg-blue-400/30",
          "group-data-[axis=x]:-mr-[--size] group-data-[axis=x]:top-0 group-data-[axis=x]:bottom-0 group-data-[axis=x]:left-0 group-data-[axis=x]:w-[--size]",
          "group-data-[axis=y]:-mb-[--size] group-data-[axis=y]:top-0 group-data-[axis=y]:h-[--size]"
        )}
        style={{ opacity: start }}
      />

      {children}

      <motion.div
        className={cn(
          "pointer-events-none sticky shrink-0 bg-blue-400/30",
          "group-data-[axis=x]:-ml-[--size] group-data-[axis=x]:top-0 group-data-[axis=x]:right-0 group-data-[axis=x]:bottom-0 group-data-[axis=x]:w-[--size]",
          "group-data-[axis=y]:-mt-[--size] group-data-[axis=y]:bottom-0 group-data-[axis=y]:h-[--size]"
        )}
        style={{ opacity: end }}
      />
    </div>
  );
}

export function BrokenScrollContainer({
  axis = "y",
  className,
  children,
}: React.PropsWithChildren<{
  axis?: "x" | "y";
  className?: string;
}>) {
  const ref = useRef<HTMLDivElement>(null);
  const [start, end] = useBrokenScrollShadows({ ref });

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
      <motion.div
        className={cn(
          "pointer-events-none sticky shrink-0 bg-blue-400/30",
          "group-data-[axis=x]:-mr-[--size] group-data-[axis=x]:top-0 group-data-[axis=x]:bottom-0 group-data-[axis=x]:left-0 group-data-[axis=x]:w-[--size]",
          "group-data-[axis=y]:-mb-[--size] group-data-[axis=y]:top-0 group-data-[axis=y]:h-[--size]"
        )}
        style={{ opacity: start }}
      />

      {children}

      <motion.div
        className={cn(
          "pointer-events-none sticky shrink-0 bg-blue-400/30",
          "group-data-[axis=x]:-ml-[--size] group-data-[axis=x]:top-0 group-data-[axis=x]:right-0 group-data-[axis=x]:bottom-0 group-data-[axis=x]:w-[--size]",
          "group-data-[axis=y]:-mt-[--size] group-data-[axis=y]:bottom-0 group-data-[axis=y]:h-[--size]"
        )}
        style={{ opacity: end }}
      />
    </div>
  );
}
