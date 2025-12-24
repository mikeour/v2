"use client";

import { cn } from "@mikeour/ui/lib/utils";

import { CAROUSEL_ITEMS } from "./data";
import { ScrollShadows } from "./scroll-shadows";

export default function Demo({ shadows = true }: { shadows?: boolean }) {
  return (
    <ScrollShadows
      axis="x"
      className="w-full rounded-lg bg-white"
      showShadows={shadows}
    >
      <div className="flex gap-4 p-4">
        {CAROUSEL_ITEMS.map((item) => (
          <div
            key={item.id}
            className={cn(
              "flex h-32 w-40 shrink-0 items-center justify-center rounded-lg font-bold text-2xl text-white",
              item.color
            )}
          >
            {item.id}
          </div>
        ))}
      </div>
    </ScrollShadows>
  );
}
