import { Demo } from "~/components/crafts/demo";
import Preview from "./preview";

export function MarkupDemo() {
  return (
    <Demo
      preview={Preview}
      caption="Drag the slider to see how shadow size affects the layout."
      path="app/crafts/scroll-shadows/demos/markup"
      files={["preview.tsx"]}
      controls={[
        {
          type: "slider",
          prop: "size",
          label: "Shadow Size",
          min: 16,
          max: 64,
          step: 8,
          defaultValue: 32,
        },
      ]}
      mockBrowser
    />
  );
}
