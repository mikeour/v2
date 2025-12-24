"use client";

import { useEffect, useRef } from "react";

type Axis = "x" | "y";

export function useScrollProgress<T extends HTMLElement = HTMLDivElement>(
  axis: Axis = "y"
) {
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

      const [scrollPos, scrollSize, clientSize] =
        axis === "y"
          ? [element.scrollTop, element.scrollHeight, element.clientHeight]
          : [element.scrollLeft, element.scrollWidth, element.clientWidth];

      const maxScroll = scrollSize - clientSize;
      const hasOverflow = maxScroll > 0;
      const progress = hasOverflow ? scrollPos / maxScroll : 0;

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
  }, [axis]);

  return ref;
}
