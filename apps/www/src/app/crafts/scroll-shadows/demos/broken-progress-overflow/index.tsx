"use client";

import { createDemo } from "~/components/crafts/demo";
import { formatDecimal } from "../shared/hooks";
import BrokenProgressOverflow from "./preview";

export const BrokenProgressOverflowDemo = createDemo({
  path: import.meta.url,
  mockBrowser: true,

  inspector: [
    { name: "startingOpacity", label: "Starting Opacity" },
    { name: "endingOpacity", label: "Ending Opacity" },
  ] as const,

  preview: ({ inspector }) => (
    <BrokenProgressOverflow
      onStartChange={(start) =>
        inspector.startingOpacity.set(formatDecimal(start))
      }
      onEndChange={(end) => inspector.endingOpacity.set(formatDecimal(end))}
    />
  ),
});
