"use client";

import { useState } from "react";
import { type HighlightedCode, Pre } from "codehike/code";

export function CodeTabs({ tabs }: { tabs: HighlightedCode[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="rounded-lg bg-zinc-800">
      <div className="flex border-zinc-700 border-b">
        {tabs.map((tab, i) => (
          <button
            className={`px-4 py-2 text-sm ${
              active === i
                ? "border-blue-500 border-b-2 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
            key={tab.meta}
            onClick={() => setActive(i)}
            type="button"
          >
            {tab.meta}
          </button>
        ))}
      </div>
      <Pre
        className="my-0! bg-slate-800! p-4 text-sm"
        code={tabs[active]}
        style={tabs[active].style}
      />
    </div>
  );
}
