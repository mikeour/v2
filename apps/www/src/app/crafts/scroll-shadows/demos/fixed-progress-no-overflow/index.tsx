import { Demo } from "~/components/crafts/demo";
import Preview from "./preview";

export function FixedProgressNoOverflowDemo() {
  return (
    <Demo
      preview={Preview}
      caption="Without any overflow on our scrolling container, both shadows are correctly hidden."
      path="app/crafts/scroll-shadows/demos/fixed-progress-no-overflow"
      controls={[
        {
          type: "switch",
          prop: "showShadows",
          label: "Shadows",
          defaultValue: true,
        },
      ]}
      inspector={[
        {
          name: "Starting Opacity",
          prop: "onStartChange",
          format: "decimal",
          defaultValue: "0.00",
        },
        {
          name: "Ending Opacity",
          prop: "onEndChange",
          format: "decimal",
          defaultValue: "0.00",
        },
      ]}
      mockBrowser
    />
  );
}
