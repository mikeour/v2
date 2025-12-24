"use client";

import { cn } from "@mikeour/ui/lib/utils";

import { useScrollProgress } from "./use-scroll-progress";

type Axis = "x" | "y";

interface ScrollShadowsProps extends React.HTMLAttributes<HTMLDivElement> {
  axis?: Axis;
  showShadows?: boolean;
}

export function ScrollShadows({
  axis = "y",
  showShadows = true,
  className,
  children,
  ...props
}: ScrollShadowsProps) {
  const ref = useScrollProgress<HTMLDivElement>(axis);
  const isVertical = axis === "y";

  return (
    <div
      className={cn(
        "relative",
        isVertical ? "overflow-y-auto" : "flex overflow-x-auto",
        className
      )}
      ref={ref}
      {...props}
    >
      {showShadows && (
        <div
          className={cn(
            "pointer-events-none sticky z-10 shrink-0 from-white to-transparent",
            isVertical
              ? "top-0 -mb-10 h-10 bg-linear-to-b"
              : "left-0 -mr-10 w-10 self-stretch bg-linear-to-r"
          )}
          style={{ opacity: "var(--scroll-progress, 0)" }}
        />
      )}

      {children}

      {showShadows && (
        <div
          className={cn(
            "pointer-events-none sticky z-10 shrink-0 from-white to-transparent",
            isVertical
              ? "bottom-0 -mt-10 h-10 bg-linear-to-t"
              : "right-0 -ml-10 w-10 self-stretch bg-linear-to-l"
          )}
          style={{
            opacity:
              "calc((1 - var(--scroll-progress, 1)) * var(--has-overflow, 0))",
          }}
        />
      )}
    </div>
  );
}
