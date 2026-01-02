"use client";

import { createDemo } from "~/components/crafts/demo";
import HorizontalScrollShadows from "./preview";

export const CarouselDemo = createDemo({
  path: import.meta.url,
  preview: () => <HorizontalScrollShadows />,
});
