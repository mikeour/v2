"use client";

import { createDemo } from "~/components/crafts/demo";
import Preview from "./preview";

export const InspectorFlowDemo = createDemo({
  path: import.meta.url,
  caption:
    "Move your mouse over the box to see the inspector update in real-time.",

  inspector: [
    {
      name: "mouseX",
      label: "Mouse X",
      description: "Horizontal position",
    },
    {
      name: "mouseY",
      label: "Mouse Y",
      description: "Vertical position",
    },
    {
      name: "isHovering",
      label: "Hovering",
      description: "Is mouse over the box?",
    },
  ] as const,

  preview: ({ inspector }) => (
    <Preview
      onMouseMove={(x, y) => {
        inspector.mouseX.set(`${x}px`);
        inspector.mouseY.set(`${y}px`);
      }}
      onHoverChange={(hovering) => {
        inspector.isHovering.set(hovering ? "Yes" : "No");
      }}
    />
  ),
});
