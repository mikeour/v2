import { ExampleContainer } from "~/components/crafts/example-container";
import { List } from "./list";
import {
  ScrollShadowEnd,
  ScrollShadowRoot,
  ScrollShadowStart,
} from "./scroll-shadows-css";

export function FlexibleExample() {
  return (
    <ExampleContainer
      mockBrowser
      isolated
      className="w-full max-w-[400px]"
    >
      <ScrollShadowRoot
        axis="y"
        className="max-h-[400px] [--size:45px]"
      >
        <ScrollShadowStart className="bg-blue-400/50" />

        <List />

        <ScrollShadowEnd className="bg-blue-400/50" />
      </ScrollShadowRoot>
    </ExampleContainer>
  );
}
