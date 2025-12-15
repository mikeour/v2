"use client";

import { useState } from "react";
import { type HighlightedCode, Pre } from "codehike/code";

export function CodeTabs({ tabs }: { tabs: HighlightedCode[] }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="rounded-lg bg-zinc-800">
      <div className="flex border-zinc-700 border-b">
        {tabs.map((tab, i) => (
          <button
            className={`px-4 py-2 text-sm ${
              activeTab === i
                ? "border-blue-500 border-b-2 text-white"
                : "text-zinc-400 hover:text-white"
            }`}
            key={tab.meta}
            onClick={() => setActiveTab(i)}
            type="button"
          >
            {tab.meta}
          </button>
        ))}
      </div>
      <Pre
        className="p-4 text-sm"
        code={tabs[activeTab]}
        style={tabs[activeTab].style}
      />
    </div>
  );
}
