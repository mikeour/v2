import { Demo } from "~/components/crafts/demo";
import Preview from "./preview";

export function BrokenProgressOverflowDemo() {
  return (
    <Demo
      preview={Preview}
      path="app/crafts/scroll-shadows/demos/broken-progress-overflow"
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
          defaultValue: "1.00",
        },
      ]}
      mockBrowser
    />
  );
}
