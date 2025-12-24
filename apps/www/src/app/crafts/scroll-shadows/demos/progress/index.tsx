import { Demo } from "~/components/crafts/demo";
import Preview from "./preview";

export function ProgressDemo() {
  return (
    <Demo
      preview={Preview}
      caption="Scroll the article to see the value update in real-time."
      path="app/crafts/scroll-shadows/demos/progress"
      inspector={[
        {
          name: "Scroll Progress",
          prop: "onProgressChange",
          format: "decimal",
          defaultValue: "0.00",
        },
      ]}
      files={["preview.tsx"]}
      mockBrowser
    />
  );
}
