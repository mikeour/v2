import type { MDXComponents } from "mdx/types";

import { Code } from "~/components/code";
import { CodeWithTabs } from "~/components/code-with-tabs";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Code,
    CodeWithTabs,
    ...components,
  };
}
