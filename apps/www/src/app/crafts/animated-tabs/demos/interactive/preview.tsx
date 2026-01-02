"use client";

import { useLayoutEffect, useRef, useState } from "react";

const tabs = [
  { id: "account", label: "Account" },
  { id: "password", label: "Password" },
  { id: "settings", label: "Settings" },
];

export default function AnimatedTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useLayoutEffect(() => {
    const el = tabRefs.current.get(activeTab);
    if (el) {
      setIndicatorStyle({ left: el.offsetLeft, width: el.offsetWidth });
    }
  }, [activeTab]);

  return (
    <div className="relative mx-auto flex w-fit gap-1 rounded-full bg-zinc-200 p-1">
      <span
        className="absolute top-1 bottom-1 rounded-full bg-white shadow-sm transition-all duration-300"
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
      />
      {tabs.map((tab) => (
        <button
          className="relative z-10 rounded-full px-3 py-1.5 font-medium text-sm text-zinc-600 transition-colors hover:text-zinc-900"
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          ref={(el) => {
            if (el) {
              tabRefs.current.set(tab.id, el);
            }
          }}
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
