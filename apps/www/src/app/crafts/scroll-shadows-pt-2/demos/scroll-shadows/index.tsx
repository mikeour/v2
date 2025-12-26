import { Demo } from "~/components/crafts/demo";
import Preview from "./preview";

export function ScrollShadowsDemo() {
  return (
    <Demo
      preview={Preview}
      caption="Scroll the content and toggle shadows to see the effect."
      controls={[
        {
          type: "switch",
          prop: "showShadows",
          label: "Display Shadows",
          defaultValue: true,
        },
      ]}
      path="app/crafts/scroll-shadows-pt-2/demos/scroll-shadows"
      files={["preview.tsx", "use-scroll-progress.ts", "scroll-shadows.tsx"]}
    />
  );
}
