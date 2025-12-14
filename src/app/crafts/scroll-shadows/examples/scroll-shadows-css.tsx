"use client";

import { createContext, forwardRef, useContext, useRef } from "react";
import type { MotionValue } from "framer-motion";
import { motion } from "framer-motion";

import { cn, mergeRefs } from "~/lib/utils";
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

export const ScrollShadowRoot = forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    axis: "x" | "y";
  }
>(function ScrollShadowRootInner(props, forwardedRef) {
  const { axis, className, ...rest } = props;

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
        className={cn("scroll-shadow-root", className)}
        data-axis={axis}
        ref={mergeRefs([scrollRef, forwardedRef])}
        {...rest}
      />
    </ScrollContext.Provider>
  );
});

export const ScrollShadowStart = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof motion.div>
>(function ScrollShadowStartInner(props, ref) {
  const { className, style = {}, ...rest } = props;
  const { startingShadowVisibility } = useScrollContext();

  return (
    <motion.div
      className={cn("scroll-shadow-start", className)}
      ref={ref}
      style={{ ...style, opacity: startingShadowVisibility }}
      {...rest}
    />
  );
});

export const ScrollShadowEnd = forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof motion.div>
>(function ScrollShadowEndInner(props, ref) {
  const { className, style = {}, ...rest } = props;
  const { endingShadowVisibility } = useScrollContext();

  return (
    <motion.div
      className={cn("scroll-shadow-end", className)}
      ref={ref}
      style={{ ...style, opacity: endingShadowVisibility }}
      {...rest}
    />
  );
});
