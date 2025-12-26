import { Demo } from "~/components/crafts/demo";
import Preview from "./preview";

export function ComparisonDemo() {
  return (
    <Demo
      preview={Preview}
      caption="Both approaches animate opacity — the visual result is identical."
      path="app/crafts/scroll-shadows-pt-2/demos/comparison"
      files={["preview.tsx", "framer-motion.tsx", "css-variables.tsx"]}
    />
  );
}
