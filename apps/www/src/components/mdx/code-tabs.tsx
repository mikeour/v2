"use client";

import { useState } from "react";
import { type HighlightedCode, Pre } from "codehike/code";
import { Check, Copy } from "lucide-react";

export function CodeTabs({ tabs }: { tabs: HighlightedCode[] }) {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(tabs[active].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <div className="group relative rounded-lg bg-zinc-800">
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
      <button
        aria-label="Copy to clipboard"
        className="absolute top-12 right-2 rounded p-1.5 text-zinc-400 opacity-0 transition-opacity hover:bg-zinc-700 hover:text-white group-hover:opacity-100"
        onClick={handleCopy}
        type="button"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
      <Pre
        className="my-0! bg-slate-800! p-4 text-sm"
        code={tabs[active]}
        style={tabs[active].style}
      />
    </div>
  );
}
