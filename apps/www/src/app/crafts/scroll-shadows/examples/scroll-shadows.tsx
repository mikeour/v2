"use client";

import type { ComponentProps } from "react";
import { createContext, useContext, useRef } from "react";
import { cn, mergeRefs } from "@mikeour/ui/utils";
import type { MotionValue } from "framer-motion";
import { motion } from "framer-motion";

import { useScrollShadows } from "./use-scroll-shadows";

const ScrollContext = createContext<ScrollContextType | null>(null);

type ScrollContextType = {
  startingShadowVisibility: MotionValue<number>;
  endingShadowVisibility: MotionValue<number>;
};

function useScrollContext() {
  const context = useContext(ScrollContext);
  if (context === null) {
    throw new Error("Missing context");
  }
  return context;
}

export function ScrollShadowRoot({
  axis,
  className,
  ref: forwardedRef,
  ...rest
}: ComponentProps<"div"> & { axis: "x" | "y" }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [startingShadowVisibility, endingShadowVisibility] = useScrollShadows({
    ref: scrollRef,
    axis,
  });

  return (
    <ScrollContext.Provider
      value={{ startingShadowVisibility, endingShadowVisibility }}
    >
      <div
        className={cn(
          "group relative flex",
          "data-[axis=x]:flex-row data-[axis=x]:overflow-x-auto",
          "data-[axis=y]:flex-col data-[axis=y]:overflow-y-auto",
          className
        )}
        data-axis={axis}
        ref={mergeRefs([scrollRef, forwardedRef])}
        {...rest}
      />
    </ScrollContext.Provider>
  );
}

export function ScrollShadowStart({
  className,
  style = {},
  ...rest
}: ComponentProps<typeof motion.div>) {
  const { startingShadowVisibility } = useScrollContext();

  return (
    <motion.div
      className={cn(
        "pointer-events-none sticky shrink-0 bg-blue-400/30",
        "group-data-[axis=x]:top-0 group-data-[axis=x]:bottom-0 group-data-[axis=x]:left-0 group-data-[axis=x]:-mr-(--size) group-data-[axis=x]:w-(--size)",
        "group-data-[axis=y]:top-0 group-data-[axis=y]:-mb-(--size) group-data-[axis=y]:h-(--size)",
        className
      )}
      style={{ ...style, opacity: startingShadowVisibility }}
      {...rest}
    />
  );
}

export function ScrollShadowEnd({
  className,
  style = {},
  ...rest
}: ComponentProps<typeof motion.div>) {
  const { endingShadowVisibility } = useScrollContext();

  return (
    <motion.div
      className={cn(
        "pointer-events-none sticky shrink-0 bg-blue-400/30",
        "group-data-[axis=x]:top-0 group-data-[axis=x]:right-0 group-data-[axis=x]:bottom-0 group-data-[axis=x]:-ml-(--size) group-data-[axis=x]:w-(--size)",
        "group-data-[axis=y]:bottom-0 group-data-[axis=y]:-mt-(--size) group-data-[axis=y]:h-(--size)",
        className
      )}
      style={{ ...style, opacity: endingShadowVisibility }}
      {...rest}
    />
  );
}
