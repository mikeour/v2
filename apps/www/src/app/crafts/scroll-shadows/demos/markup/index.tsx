"use client";

import { createDemo } from "~/components/crafts/demo";
import ShadowMarkup from "./preview";

export const MarkupDemo = createDemo({
  path: import.meta.url,
  caption: "Drag the slider to see how shadow size affects the layout.",
  mockBrowser: true,

  controls: [
    {
      type: "slider",
      name: "size",
      label: "Shadow Size",
      description: "Height of the sticky shadow elements",
      min: 16,
      max: 64,
      step: 8,
      default: 32,
      unit: "px",
    },
  ] as const,

  codeOutput: {
    label: "Generated CSS",
    lang: "css",
    generate: (controls) => `.shadow-top {
  position: sticky;
  top: 0;
  height: ${controls.size}px;
  margin-bottom: -${controls.size}px;
}

.shadow-bottom {
  position: sticky;
  bottom: 0;
  height: ${controls.size}px;
  margin-top: -${controls.size}px;
}`,
  },

  preview: ({ controls }) => <ShadowMarkup size={controls.size} />,
});
