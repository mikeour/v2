"use client";

import { Article } from "../shared/components";

type ShadowMarkupProps = {
  size?: number;
};

export default function ShadowMarkup({ size = 32 }: ShadowMarkupProps) {
  return (
    <div
      className="max-h-75 w-full overflow-y-auto overscroll-none"
      style={{ "--size": `${size}px` } as React.CSSProperties}
      data-fill-width
    >
      <div className="pointer-events-none sticky top-0 -mb-(--size) h-(--size) shrink-0 bg-blue-400/30" />

      <Article />

      <div className="pointer-events-none sticky bottom-0 -mt-(--size) h-(--size) shrink-0 bg-blue-400/30" />
    </div>
  );
}
