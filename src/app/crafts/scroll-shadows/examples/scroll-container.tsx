"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useScrollShadows } from "./use-scroll-shadows";

export function ScrollContainer({ children }: React.PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null);
  const [top, bottom] = useScrollShadows(ref);

  return (
    <div
      ref={ref}
      className="relative overflow-y-auto [--height:65px] [--opacity:0.65]"
    >
      <motion.div
        className="pointer-events-none sticky top-0 -mb-[--height] h-[--height] w-full shrink-0"
        style={{
          opacity: top,
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, var(--opacity)) 0%, rgba(0, 0, 0, 0.00) 100%)",
        }}
      />

      {children}

      <motion.div
        className="pointer-events-none sticky bottom-0 -mt-[--height] h-[--height] w-full shrink-0"
        style={{
          opacity: bottom,
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, var(--opacity)) 100%)",
        }}
      />
    </div>
  );
}

export default ScrollContainer;
