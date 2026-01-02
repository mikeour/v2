import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ComponentType } from "react";
import { type HighlightedCode, highlight } from "codehike/code";

import theme from "~/themes/one-monokai.mjs";
import type { DemoProps } from "./types";

// =============================================================================
// Code Processing
// =============================================================================

const LANG_MAP: Record<string, string> = {
  ".tsx": "tsx",
  ".ts": "tsx",
  ".css": "css",
  ".js": "js",
  ".jsx": "jsx",
};

/**
 * Clean code for display by removing demo-only markers and normalizing imports.
 */
function cleanCodeForDisplay(code: string): string {
  return (
    code
      // Normalize import paths
      .replace(/@mikeour\/ui\/lib\/utils/g, "~/lib/utils")
      // Strip block regions: // @demo-start ... // @demo-end
      .replace(/^\s*\/\/\s*@demo-start[\s\S]*?\/\/\s*@demo-end\s*\n?/gm, "")
      // Strip single lines ending with // @demo
      .replace(/^.*\/\/\s*@demo\s*$/gm, "")
      // Clean up multiple consecutive blank lines (max 2)
      .replace(/\n{3,}/g, "\n\n")
      // Remove empty import statements that might remain
      .replace(/^import\s*{\s*}\s*from\s*['"][^'"]+['"];\s*\n?/gm, "")
      .trim()
  );
}

/**
 * Read and highlight files for code display.
 */
async function readAndHighlightFiles(
  path: string,
  files: string[]
): Promise<HighlightedCode[]> {
  const fullPath = join(process.cwd(), "src", path);

  const tabs = await Promise.all(
    files.map((file) => {
      const code = cleanCodeForDisplay(
        readFileSync(join(fullPath, file), "utf-8")
      );
      const ext = file.slice(file.lastIndexOf("."));
      return highlight(
        { value: code, lang: LANG_MAP[ext] ?? "tsx", meta: file },
        theme
      );
    })
  );

  return tabs;
}

// =============================================================================
// Demo (Server Component)
// =============================================================================

type DemoServerProps = {
  /** Demo component created with createDemo() */
  use: ComponentType<DemoProps>;
  /** Path to demo directory relative to src/ */
  path?: string;
  /** Files to show in code tabs */
  files?: string[];
};

/**
 * Server component wrapper that reads code files and passes them to the demo.
 *
 * Use this in MDX files to display demos with code tabs:
 *
 * @example
 * ```mdx
 * import { Demo } from "~/components/crafts/demo/server";
 * import { ProgressDemo } from "./demos/progress";
 *
 * <Demo
 *   use={ProgressDemo}
 *   path="app/crafts/demos/progress"
 *   files={["preview.tsx"]}
 * />
 * ```
 */
export async function Demo({
  use: DemoComponent,
  path,
  files,
}: DemoServerProps) {
  let code: HighlightedCode[] | undefined;

  // Read and highlight code files if configured
  if (path && files?.length) {
    try {
      code = await readAndHighlightFiles(path, files);
    } catch (error) {
      console.error(`[Demo] Failed to read files for ${path}:`, error);
    }
  }

  return <DemoComponent code={code} />;
}
