"use client";

import { createDemo } from "~/components/crafts/demo";
import ScrollShadowsInteractive from "./preview";

export const InteractiveDemo = createDemo({
  path: import.meta.url,
  caption:
    "Scroll the article — notice how shadows appear and disappear at the edges.",
  mockBrowser: true,

  preview: () => <ScrollShadowsInteractive />,
});
