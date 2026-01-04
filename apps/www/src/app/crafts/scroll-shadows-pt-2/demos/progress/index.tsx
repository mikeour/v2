"use client";

import { createDemo } from "~/components/crafts/demo";
import ScrollProgress from "./preview";

export const ProgressDemo = createDemo({
  path: import.meta.url,
  caption: "Scroll to see the progress value update in real-time.",

  inspector: [
    {
      name: "progress",
      label: "Scroll Progress",
      description: "Value from 0 (top) to 1 (bottom)",
    },
  ] as const,

  preview: ({ inspector }) => (
    <ScrollProgress
      onProgressChange={(progress) => {
        inspector.progress.set(progress.toFixed(2));
      }}
    />
  ),
});
