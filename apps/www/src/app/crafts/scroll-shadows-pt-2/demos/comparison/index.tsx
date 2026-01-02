"use client";

import { createDemo } from "~/components/crafts/demo";
import ComparisonPreview from "./preview";

export const ComparisonDemo = createDemo({
  path: import.meta.url,
  caption: "Both approaches animate opacity — the visual result is identical.",

  preview: () => <ComparisonPreview />,
});
