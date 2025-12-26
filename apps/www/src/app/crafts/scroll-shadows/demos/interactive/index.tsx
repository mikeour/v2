import { Demo } from "~/components/crafts/demo";
import Preview from "./preview";

export function InteractiveDemo() {
  return (
    <Demo
      preview={Preview}
      caption="Scroll the article — notice how shadows appear and disappear at the edges."
      path="app/crafts/scroll-shadows/demos/interactive"
      mockBrowser
    />
  );
}
