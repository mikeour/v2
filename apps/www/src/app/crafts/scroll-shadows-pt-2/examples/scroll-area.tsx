"use client";

import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import { cn } from "@mikeour/ui/lib/utils";

interface ScrollAreaProps extends ScrollAreaPrimitive.Root.Props {
  orientation?: "horizontal" | "vertical" | "both";
  scrollShadow?: "vertical" | "horizontal" | "both" | "none";
}

function ScrollArea({
  className,
  orientation = "vertical",
  scrollShadow = "none",
  children,
  ...props
}: ScrollAreaProps) {
  return (
    <ScrollAreaPrimitive.Root className="min-h-0" {...props}>
      <ScrollAreaPrimitive.Viewport
        className={cn(
          "size-full overscroll-contain rounded-[inherit] outline-none",
          className
        )}
        data-slot="scroll-area-viewport"
      >
        <div
          className={cn(
            scrollShadow === "vertical" || scrollShadow === "both"
              ? "block"
              : "hidden",
            [
              "pointer-events-none absolute inset-0",
              "before:pointer-events-none before:absolute before:left-0 before:block before:w-full before:content-[''] after:pointer-events-none after:absolute after:left-0 after:block after:w-full after:content-['']",
              "before:rounded-md before:rounded-b-none after:rounded-md after:rounded-t-none",
              "before:transition-[height] before:duration-100 before:ease-out after:transition-[height] after:duration-100 after:ease-out",
              "before:[--scroll-area-overflow-y-start:inherit]",
              "after:[--scroll-area-overflow-y-end:inherit]",
              "[--bg:white] before:top-0 before:h-[min(40px,var(--scroll-area-overflow-y-start))] before:bg-[linear-gradient(to_bottom,var(--bg),transparent)] after:bottom-0 after:h-[min(40px,var(--scroll-area-overflow-y-end,40px))] after:bg-[linear-gradient(to_top,var(--bg),transparent)]",
            ]
          )}
          data-slot="scroll-area-vertical-shadow"
          style={
            {
              "--scroll-area-overflow-y-start": "inherit",
              "--scroll-area-overflow-y-end": "inherit",
            } as React.CSSProperties
          }
        />
        <div
          className={cn(
            scrollShadow === "horizontal" || scrollShadow === "both"
              ? "block"
              : "hidden",
            [
              "pointer-events-none absolute inset-0",
              "before:pointer-events-none before:absolute before:top-0 before:block before:h-full before:content-[''] after:pointer-events-none after:absolute after:top-0 after:block after:h-full after:content-['']",
              "before:rounded-md before:rounded-r-none after:rounded-md after:rounded-l-none",
              "before:transition-[width] before:duration-100 before:ease-out after:transition-[width] after:duration-100 after:ease-out",
              "before:[--scroll-area-overflow-x-start:inherit]",
              "after:[--scroll-area-overflow-x-end:inherit]",
              "[--bg:white] before:left-0 before:w-[min(40px,var(--scroll-area-overflow-x-start))] before:bg-[linear-gradient(to_right,var(--bg),transparent)] after:right-0 after:w-[min(40px,var(--scroll-area-overflow-x-end,40px))] after:bg-[linear-gradient(to_left,var(--bg),transparent)]",
            ]
          )}
          data-slot="scroll-area-horizontal-shadow"
          style={
            {
              "--scroll-area-overflow-x-start": "inherit",
              "--scroll-area-overflow-x-end": "inherit",
            } as React.CSSProperties
          }
        />
        {children}
      </ScrollAreaPrimitive.Viewport>
      {orientation === "both" ? (
        <>
          <ScrollBar orientation="vertical" />
          <ScrollBar orientation="horizontal" />
        </>
      ) : (
        <ScrollBar orientation={orientation} />
      )}
      <ScrollAreaPrimitive.Corner data-slot="scroll-area-corner" />
    </ScrollAreaPrimitive.Root>
  );
}

interface ScrollBarProps extends ScrollAreaPrimitive.Scrollbar.Props {}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollBarProps) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      className={cn(
        "m-1.5 flex rounded-full bg-slate-200 opacity-0 transition-opacity delay-200 data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5 data-[orientation=horizontal]:flex-col data-hovering:opacity-100 data-scrolling:opacity-100 data-hovering:delay-0 data-scrolling:delay-0 data-hovering:duration-100 data-scrolling:duration-100",
        className
      )}
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        className="relative flex-1 rounded-full bg-slate-400"
        data-slot="scroll-area-thumb"
      />
    </ScrollAreaPrimitive.Scrollbar>
  );
}

export { ScrollArea, ScrollArea as ScrollAreaWithShadows, ScrollBar };
