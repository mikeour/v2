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
        className={cn("scroll-shadow-root", className)}
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
      className={cn("scroll-shadow-start", className)}
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
      className={cn("scroll-shadow-end", className)}
      {...rest}
    />
  );
});
