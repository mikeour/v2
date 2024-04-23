"use client";

import { createContext, forwardRef, useContext, useRef } from "react";
import { motion } from "framer-motion";
import { cn, mergeRefs } from "~/lib/utils";
import { useScrollShadows } from "./use-scroll-shadows";

import type { MotionValue } from "framer-motion";

const ScrollContext = createContext<ScrollContextType | null>(null);

type ScrollContextType = {
  startingShadowVisibility: MotionValue<number>;
  endingShadowVisibility: MotionValue<number>;
};

function useScrollContext() {
  const context = useContext(ScrollContext);
  if (context === null) throw new Error("Missing context");
  return context;
}

export const ScrollShadowRoot = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    axis: "x" | "y";
  }
>(function ScrollShadowRoot(props, forwardedRef) {
  const { axis, className, ...rest } = props;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [startingShadowVisibility, endingShadowVisibility] =
    useScrollShadows({ ref: scrollRef, axis });

  return (
    <ScrollContext.Provider
      value={{ startingShadowVisibility, endingShadowVisibility }}
    >
      <div
        ref={mergeRefs([scrollRef, forwardedRef])}
        data-axis={axis}
        className={cn(
          "group relative flex",
          "data-[axis=x]:flex-row data-[axis=x]:overflow-x-auto",
          "data-[axis=y]:flex-col data-[axis=y]:overflow-y-auto",
          className
        )}
        {...rest}
      />
    </ScrollContext.Provider>
  );
});

export const ScrollShadowStart = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof motion.div>
>(function ScrollShadowStart(props, ref) {
  const { className, style = {}, ...rest } = props;
  const { startingShadowVisibility } = useScrollContext();

  return (
    <motion.div
      ref={ref}
      style={{ ...style, opacity: startingShadowVisibility }}
      className={cn(
        "pointer-events-none sticky shrink-0 bg-blue-400/30",
        "group-data-[axis=x]:bottom-0 group-data-[axis=x]:left-0 group-data-[axis=x]:top-0 group-data-[axis=x]:-mr-[--size] group-data-[axis=x]:w-[--size]",
        "group-data-[axis=y]:top-0 group-data-[axis=y]:-mb-[--size] group-data-[axis=y]:h-[--size]",
        className
      )}
      {...rest}
    />
  );
});

export const ScrollShadowEnd = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof motion.div>
>(function ScrollShadowEnd(props, ref) {
  const { className, style = {}, ...rest } = props;
  const { endingShadowVisibility } = useScrollContext();

  return (
    <motion.div
      ref={ref}
      style={{ ...style, opacity: endingShadowVisibility }}
      className={cn(
        "pointer-events-none sticky shrink-0 bg-blue-400/30",
        "group-data-[axis=x]:bottom-0 group-data-[axis=x]:right-0 group-data-[axis=x]:top-0 group-data-[axis=x]:-ml-[--size] group-data-[axis=x]:w-[--size]",
        "group-data-[axis=y]:bottom-0 group-data-[axis=y]:-mt-[--size] group-data-[axis=y]:h-[--size]",
        className
      )}
      {...rest}
    />
  );
});
