"use client";

import { useRef, useState } from "react";
import { cn } from "@mikeour/ui/lib/utils";

type PreviewProps = {
  onMouseMove?: (x: number, y: number) => void;
  onHoverChange?: (hovering: boolean) => void;
};

export default function Preview({ onMouseMove, onHoverChange }: PreviewProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!boxRef.current) {
      return;
    }
    const rect = boxRef.current.getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);
    onMouseMove?.(x, y);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    onHoverChange?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    onHoverChange?.(false);
  };

  return (
    // biome-ignore lint/a11y/noNoninteractiveElementInteractions: Demo region for mouse tracking visualization
    <section
      ref={boxRef}
      aria-label="Mouse tracking demo area"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "flex h-48 w-64 cursor-crosshair items-center justify-center rounded-lg border-2 border-dashed transition-colors",
        isHovering
          ? "border-blue-500 bg-blue-50 text-blue-700"
          : "border-zinc-300 bg-zinc-50 text-zinc-500"
      )}
    >
      <span className="pointer-events-none select-none text-sm">
        {isHovering ? "Tracking mouse..." : "Hover over me"}
      </span>
    </section>
  );
}
