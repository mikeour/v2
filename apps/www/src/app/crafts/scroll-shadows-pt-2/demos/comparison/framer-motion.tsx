"use client";

import { useRef } from "react";
import { cn } from "@mikeour/ui/lib/utils";
import { motion, useScroll, useTransform } from "framer-motion";

type ScrollShadowsProps = {
  className?: string;
  children: React.ReactNode;
};

export function ScrollShadows({ className, children }: ScrollShadowsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: ref });

  const startOpacity = useTransform(scrollYProgress, (v) => {
    const el = ref.current;
    if (!el) {
      return v;
    }
    return el.scrollHeight > el.clientHeight ? v : 0;
  });

  const endOpacity = useTransform(scrollYProgress, (v) => {
    const el = ref.current;
    if (!el) {
      return 1 - v;
    }
    return el.scrollHeight > el.clientHeight ? 1 - v : 0;
  });

  return (
    <div ref={ref} className={cn("relative overflow-y-auto", className)}>
      <motion.div
        className="pointer-events-none sticky top-0 z-10 -mb-10 h-10 shrink-0 bg-linear-to-b from-white to-transparent"
        style={{ opacity: startOpacity }}
      />

      {children}

      <motion.div
        className="pointer-events-none sticky bottom-0 z-10 -mt-10 h-10 shrink-0 bg-linear-to-t from-white to-transparent"
        style={{ opacity: endOpacity }}
      />
    </div>
  );
}
