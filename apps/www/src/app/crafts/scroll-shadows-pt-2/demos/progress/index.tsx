import { Demo } from "~/components/crafts/demo";
import Preview from "./preview";

export function ProgressDemo() {
  return (
    <Demo
      preview={Preview}
      caption="Scroll to see the progress value update in real-time."
      inspector={[
        {
          name: "progress",
          label: "--scroll-progress",
          prop: "onProgressChange",
          format: "decimal",
          defaultValue: "0.00",
        },
      ]}
      path="app/crafts/scroll-shadows-pt-2/demos/progress"
    />
  );
}
