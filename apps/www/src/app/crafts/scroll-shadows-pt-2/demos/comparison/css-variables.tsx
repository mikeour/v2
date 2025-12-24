"use client";

import { useEffect, useRef } from "react";
import { cn } from "@mikeour/ui/lib/utils";

function useScrollProgress<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    function updateProgress() {
      if (!element) {
        return;
      }
      const maxScroll = element.scrollHeight - element.clientHeight;
      const hasOverflow = maxScroll > 0;
      const progress = hasOverflow ? element.scrollTop / maxScroll : 0;

      element.style.setProperty("--scroll-progress", String(progress));
      element.style.setProperty("--has-overflow", hasOverflow ? "1" : "0");
    }

    updateProgress();
    element.addEventListener("scroll", updateProgress, { passive: true });

    const resizeObserver = new ResizeObserver(updateProgress);
    resizeObserver.observe(element);

    return () => {
      element.removeEventListener("scroll", updateProgress);
      resizeObserver.disconnect();
    };
  }, []);

  return ref;
}

type ScrollShadowsProps = {
  className?: string;
  children: React.ReactNode;
};

export function ScrollShadows({ className, children }: ScrollShadowsProps) {
  const ref = useScrollProgress();

  return (
    <div ref={ref} className={cn("relative overflow-y-auto", className)}>
      <div
        className="pointer-events-none sticky top-0 z-10 -mb-10 h-10 shrink-0 bg-linear-to-b from-white to-transparent"
        style={{ opacity: "var(--scroll-progress, 0)" }}
      />

      {children}

      <div
        className="pointer-events-none sticky bottom-0 z-10 -mt-10 h-10 shrink-0 bg-linear-to-t from-white to-transparent"
        style={{
          opacity:
            "calc((1 - var(--scroll-progress, 1)) * var(--has-overflow, 0))",
        }}
      />
    </div>
  );
}
