"use client";

import { createDemo } from "~/components/crafts/demo";
import BrokenProgressNoOverflow from "./preview";

export const BrokenProgressNoOverflowDemo = createDemo({
  path: import.meta.url,
  caption: "Toggle shadows ON — why is the top shadow visible?",
  mockBrowser: true,

  controls: [
    {
      type: "switch",
      name: "showShadows",
      label: "Shadows",
      description: "Toggle shadow visibility",
      default: true,
    },
  ],

  inspector: [
    {
      name: "startingOpacity",
      label: "Starting Opacity",
      description: "Top shadow (should be 0 here)",
    },
    {
      name: "endingOpacity",
      label: "Ending Opacity",
      description: "Bottom shadow (should be 0 here)",
    },
  ],

  preview: ({ controls, inspector }) => (
    <BrokenProgressNoOverflow
      showShadows={controls.showShadows}
      onOpacityChange={(start, end) => {
        inspector.startingOpacity.track(start, (v) => v.toFixed(2));
        inspector.endingOpacity.track(end, (v) => v.toFixed(2));
      }}
    />
  ),
});
