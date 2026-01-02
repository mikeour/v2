"use client";

import { createDemo } from "~/components/crafts/demo";
import Preview from "./preview";

export const TypeInferenceDemo = createDemo({
  path: import.meta.url,
  caption:
    "Toggle the controls and watch the preview update with full type safety.",

  controls: [
    {
      type: "switch",
      name: "showBorder",
      label: "Show Border",
      default: true,
    },
    {
      type: "slider",
      name: "borderRadius",
      label: "Border Radius",
      min: 0,
      max: 24,
      default: 8,
      unit: "px",
    },
    {
      type: "select",
      name: "variant",
      label: "Variant",
      options: ["default", "primary", "secondary"],
      default: "default",
    },
  ] as const,

  codeOutput: {
    label: "Inferred Types",
    lang: "ts",
    generate: (controls) => `// TypeScript infers these types automatically:
type Controls = {
  showBorder: boolean;      // from "switch"
  borderRadius: number;     // from "slider"
  variant: string;          // from "select"
}

// Current values:
controls.showBorder    = ${controls.showBorder}
controls.borderRadius  = ${controls.borderRadius}
controls.variant       = "${controls.variant}"`,
  },

  preview: ({ controls }) => (
    <Preview
      showBorder={controls.showBorder}
      borderRadius={controls.borderRadius}
      variant={controls.variant}
    />
  ),
});
