"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";
import {
  useBrokenScrollShadows,
  useScrollShadows,
} from "./use-scroll-shadows";

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
      ref={ref}
      data-axis={axis}
      className={cn(
        "group relative flex",
        "data-[axis=x]:flex-row data-[axis=x]:overflow-x-auto",
        "data-[axis=y]:flex-col data-[axis=y]:overflow-y-auto",
        className
      )}
    >
      <motion.div
        style={{ opacity: start }}
        className={cn(
          "pointer-events-none sticky shrink-0 bg-blue-400/30",
          "group-data-[axis=x]:bottom-0 group-data-[axis=x]:left-0 group-data-[axis=x]:top-0 group-data-[axis=x]:-mr-[--size] group-data-[axis=x]:w-[--size]",
          "group-data-[axis=y]:top-0 group-data-[axis=y]:-mb-[--size] group-data-[axis=y]:h-[--size]"
        )}
      />

      {children}

      <motion.div
        style={{ opacity: end }}
        className={cn(
          "pointer-events-none sticky shrink-0 bg-blue-400/30",
          "group-data-[axis=x]:bottom-0 group-data-[axis=x]:right-0 group-data-[axis=x]:top-0 group-data-[axis=x]:-ml-[--size] group-data-[axis=x]:w-[--size]",
          "group-data-[axis=y]:bottom-0 group-data-[axis=y]:-mt-[--size] group-data-[axis=y]:h-[--size]"
        )}
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
      ref={ref}
      data-axis={axis}
      className={cn(
        "group relative flex",
        "data-[axis=x]:flex-row data-[axis=x]:overflow-x-auto",
        "data-[axis=y]:flex-col data-[axis=y]:overflow-y-auto",
        className
      )}
    >
      <motion.div
        style={{ opacity: start }}
        className={cn(
          "pointer-events-none sticky shrink-0 bg-blue-400/30",
          "group-data-[axis=x]:bottom-0 group-data-[axis=x]:left-0 group-data-[axis=x]:top-0 group-data-[axis=x]:-mr-[--size] group-data-[axis=x]:w-[--size]",
          "group-data-[axis=y]:top-0 group-data-[axis=y]:-mb-[--size] group-data-[axis=y]:h-[--size]"
        )}
      />

      {children}

      <motion.div
        style={{ opacity: end }}
        className={cn(
          "pointer-events-none sticky shrink-0 bg-blue-400/30",
          "group-data-[axis=x]:bottom-0 group-data-[axis=x]:right-0 group-data-[axis=x]:top-0 group-data-[axis=x]:-ml-[--size] group-data-[axis=x]:w-[--size]",
          "group-data-[axis=y]:bottom-0 group-data-[axis=y]:-mt-[--size] group-data-[axis=y]:h-[--size]"
        )}
      />
    </div>
  );
}
