import { Demo } from "~/components/crafts/demo";
import Preview from "./preview";

export function BrokenProgressNoOverflowDemo() {
  return (
    <Demo
      preview={Preview}
      caption="Toggle shadows ON — why is the top shadow visible?"
      path="app/crafts/scroll-shadows/demos/broken-progress-no-overflow"
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
          defaultValue: "1.00",
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
