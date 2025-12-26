import { Demo } from "~/components/crafts/demo";
import Preview from "./preview";

export function HorizontalDemo() {
  return (
    <Demo
      preview={Preview}
      caption="Horizontal scroll shadows using the same technique."
      controls={[
        {
          type: "switch",
          prop: "shadows",
          label: "Shadows",
          defaultValue: true,
        },
      ]}
      path="app/crafts/scroll-shadows-pt-2/demos/horizontal"
      files={["preview.tsx"]}
    />
  );
}
