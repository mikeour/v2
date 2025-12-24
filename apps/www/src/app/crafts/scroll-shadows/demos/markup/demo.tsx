"use client";

import { Article } from "../shared/components";

export default function Demo({ size = 48 }: { size?: number }) {
  return (
    <div
      className="max-h-75 w-full overflow-y-auto"
      style={{ "--size": `${size}px` } as React.CSSProperties}
    >
      <div className="pointer-events-none sticky top-0 -mb-(--size) flex h-(--size) shrink-0 items-center justify-center bg-blue-400/30">
        <code className="text-xs/none md:text-sm/none">{`{ top: 0, height: ${size}px, marginBottom: -${size}px }`}</code>
      </div>
      <Article />
      <div className="pointer-events-none sticky bottom-0 -mt-(--size) flex h-(--size) shrink-0 items-center justify-center bg-blue-400/30">
        <code className="text-xs/none md:text-sm/none">{`{ bottom: 0, height: ${size}px, marginTop: -${size}px }`}</code>
      </div>
    </div>
  );
}
