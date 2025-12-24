import { Block, CodeBlock, parseProps } from "codehike/blocks";
import { highlight, type RawCode } from "codehike/code";
import { z } from "zod";

import theme from "~/themes/one-monokai.mjs";
import { CodeTabs } from "./code-tabs";

const Schema = Block.extend({ tabs: z.array(CodeBlock) });

export async function CodeWithTabs(props: unknown) {
  const { tabs } = parseProps(props, Schema) as { tabs: RawCode[] };
  const highlighted = await Promise.all(
    tabs.map((tab) => highlight(tab, theme))
  );
  return <CodeTabs tabs={highlighted} />;
}
