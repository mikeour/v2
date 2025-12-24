import { Demo } from "~/components/crafts/demo";
import Preview from "./preview";

export function InteractiveDemo() {
  return (
    <Demo
      preview={Preview}
      caption="Click the tabs to see the animated indicator."
      path="app/crafts/animated-tabs/demos/interactive"
    />
  );
}
