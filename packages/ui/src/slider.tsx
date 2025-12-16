"use client";

import type { ComponentProps } from "react";
// biome-ignore lint/performance/noNamespaceImport: Radix UI convention
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "./utils";

function Slider({
  className,
  ...props
}: ComponentProps<typeof SliderPrimitive.Root>) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-slate-100">
        <SliderPrimitive.Range className="absolute h-full bg-blue-400" />
      </SliderPrimitive.Track>

      <SliderPrimitive.Thumb className="block h-4 w-4 cursor-grab rounded-full bg-blue-400 outline-none transition-colors active:cursor-grabbing disabled:pointer-events-none disabled:opacity-50" />
    </SliderPrimitive.Root>
  );
}

export { Slider };
