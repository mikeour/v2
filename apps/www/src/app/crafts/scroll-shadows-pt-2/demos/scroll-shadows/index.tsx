"use client";

import { createDemo } from "~/components/crafts/demo";
import ScrollShadowsPreview from "./preview";

export const ScrollShadowsDemo = createDemo({
  path: import.meta.url,
  caption: "Scroll the content and toggle shadows to see the effect.",

  controls: [
    {
      type: "switch",
      name: "showShadows",
      label: "Display Shadows",
      default: true,
    },
  ] as const,

  preview: ({ controls }) => (
    <ScrollShadowsPreview showShadows={controls.showShadows} />
  ),
});
