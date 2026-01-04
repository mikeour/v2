"use client";

import type { ReactNode } from "react";

type CaptionProps = {
  children: ReactNode;
};

export function Caption({ children }: CaptionProps) {
  return (
    <figcaption
      className="flex items-center justify-center border-slate-700 border-t bg-slate-900/30 px-4 py-2.5 text-center text-slate-400 text-sm"
      data-slot="demo-caption"
    >
      {children}
    </figcaption>
  );
}
