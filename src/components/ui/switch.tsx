"use client";

import { forwardRef } from "react";
// biome-ignore lint/performance/noNamespaceImport: Radix UI convention
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "~/utils";

const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-[20px] w-[32px] shrink-0 cursor-pointer items-center rounded-full border-2 border-[transparent] bg-white radix-state-checked:bg-blue-400 radix-state-unchecked:bg-gray-300 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    ref={ref}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-[16px] w-[16px] radix-state-checked:translate-x-[12px] rounded-full bg-white shadow-lg ring-0 transition-transform"
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
