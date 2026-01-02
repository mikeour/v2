"use client";

import { createDemo } from "~/components/crafts/demo";
import AnimatedTabs from "./preview";

export const InteractiveDemo = createDemo({
  path: import.meta.url,
  caption: "Click the tabs to see the animated indicator.",

  preview: () => <AnimatedTabs />,
});
