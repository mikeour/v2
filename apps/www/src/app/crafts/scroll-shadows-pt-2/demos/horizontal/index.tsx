"use client";

import { createDemo } from "~/components/crafts/demo";
import HorizontalScrollShadows from "./preview";

export const HorizontalDemo = createDemo({
  path: import.meta.url,
  caption: "Horizontal scroll shadows using the same technique.",

  controls: [
    {
      type: "switch",
      name: "shadows",
      label: "Shadows",
      default: true,
    },
  ] as const,

  preview: ({ controls }) => (
    <HorizontalScrollShadows shadows={controls.shadows} />
  ),
});
