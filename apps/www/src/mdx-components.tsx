import type { MDXComponents } from "mdx/types";

import { Code } from "~/components/mdx/code";
import { CodeWithTabs } from "~/components/mdx/code-with-tabs";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    Code,
    CodeWithTabs,
    ...components,
  };
}
