"use client";

import type { ReactNode } from "react";
import { cn } from "@mikeour/ui/lib/utils";

type RootProps = {
  children: ReactNode;
};

export function Root({ children }: RootProps) {
  return (
    <figure
      className={cn(
        "code-example not-prose overflow-hidden rounded-xl bg-slate-800 lg:mx-[calc(var(--gutter)*-1.75)]",
        "grid grid-cols-1",
        // toolbar only: toolbar(auto) content(auto)
        "has-data-[slot=demo-toolbar]:grid-rows-[auto_auto]",
        // caption only: content(auto) caption(auto)
        "has-data-[slot=demo-caption]:grid-rows-[auto_auto]",
        // toolbar + caption: toolbar(auto) content(auto) caption(auto)
        "has-data-[slot=demo-toolbar]:has-data-[slot=demo-caption]:grid-rows-[auto_auto_auto]",
        // toolbar + code: toolbar(auto) content(auto) code-toolbar(auto) code-content(auto)
        "has-data-[slot=demo-toolbar]:has-data-[slot=demo-code]:grid-rows-[auto_auto_auto_auto]",
        // toolbar + code + caption: toolbar(auto) content(auto) code-toolbar(auto) code-content(auto) caption(auto)
        "has-data-[slot=demo-toolbar]:has-data-[slot=demo-code]:has-data-[slot=demo-caption]:grid-rows-[auto_auto_auto_auto_auto]"
      )}
    >
      {children}
    </figure>
  );
}
