"use client";

import type { ComponentProps } from "react";
import { Indicator, Root } from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";

import { cn } from "./utils";

function Checkbox({ className, ...props }: ComponentProps<typeof Root>) {
  return (
    <Root
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-blue-500 focus-within:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-500",
        className
      )}
      {...props}
    >
      <Indicator className={cn("flex items-center justify-center text-white")}>
        <Check className="h-4 w-4" />
      </Indicator>
    </Root>
  );
}

export { Checkbox };
