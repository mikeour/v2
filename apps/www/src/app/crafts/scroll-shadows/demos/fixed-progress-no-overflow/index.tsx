"use client";

import { createDemo } from "~/components/crafts/demo";
import FixedProgressNoOverflow from "./preview";

export const FixedProgressNoOverflowDemo = createDemo({
  path: import.meta.url,
  caption:
    "Without any overflow on our scrolling container, both shadows are correctly hidden.",
  mockBrowser: true,

  controls: [
    { type: "switch", name: "showShadows", label: "Shadows", default: true },
  ] as const,

  inspector: [
    { name: "startingOpacity", label: "Starting Opacity" },
    { name: "endingOpacity", label: "Ending Opacity" },
  ] as const,

  preview: ({ controls, inspector }) => (
    <FixedProgressNoOverflow
      showShadows={controls.showShadows}
      onOpacityChange={(start, end) => {
        inspector.startingOpacity.track(start, (v) => v.toFixed(2));
        inspector.endingOpacity.track(end, (v) => v.toFixed(2));
      }}
    />
  ),
});
