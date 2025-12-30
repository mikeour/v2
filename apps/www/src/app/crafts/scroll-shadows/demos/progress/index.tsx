"use client";

import { createDemo } from "~/components/crafts/demo";
import ScrollProgress from "./preview";

export const ProgressDemo = createDemo({
  caption: "Scroll the article to see the value update in real-time.",
  mockBrowser: true,
  path: import.meta.url,
  inspector: [
    {
      name: "scrollProgress",
      label: "Scroll Progress",
      description: "Value from 0 (top) to 1 (bottom)",
    },
  ] as const,

  preview: ({ inspector }) => (
    <ScrollProgress
      onScrollProgressChange={(progress) => {
        inspector.scrollProgress.track(progress, (v) => v.toFixed(2));
      }}
    />
  ),
});
