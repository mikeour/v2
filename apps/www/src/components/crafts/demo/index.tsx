import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ComponentType } from "react";
import { type HighlightedCode, highlight } from "codehike/code";

import theme from "~/themes/one-monokai.mjs";
import {
  DemoCaption,
  DemoCodeTabs,
  DemoPreview,
  DemoRoot,
  DemoToolbar,
} from "./renderer";

type Control =
  | { type: "switch"; name: string; label: string; defaultValue?: boolean }
  | {
      type: "slider";
      name: string;
      label: string;
      min: number;
      max: number;
      step?: number;
      defaultValue?: number;
      unit?: string;
    };

type Inspector = {
  name: string;
  label?: string;
  prop: string;
  format?: "decimal";
  defaultValue?: string;
};

export type DemoModule = {
  // biome-ignore lint/suspicious/noExplicitAny: Demo components have dynamic props
  default: ComponentType<any>;
};

type DemoProps = {
  /** The demo component module */
  demo: DemoModule;
  /** Path to demo directory relative to src/ */
  path: string;
  /** Additional implementation files to show in tabs */
  files?: string[];
  /** Control definitions */
  controls?: Control[];
  /** Inspector definitions - maps display name to callback prop */
  inspector?: Inspector[];
  /** Caption text */
  caption?: string;
  isolated?: boolean;
  className?: string;
};

const LANG_MAP: Record<string, string> = {
  ".tsx": "tsx",
  ".ts": "tsx",
  ".css": "css",
};

// Clean up implementation details for display
function cleanCodeForDisplay(code: string): string {
  return code.replace(/@mikeour\/ui\/lib\/utils/g, "~/lib/utils");
}

export async function Demo({
  demo,
  path,
  files,
  controls,
  inspector,
  caption,
  isolated,
  className,
}: DemoProps) {
  const Component = demo.default;

  const fullPath = join(process.cwd(), "src", path);

  let highlighted: HighlightedCode[] | undefined;
  if (files?.length) {
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
    highlighted = tabs;
  }

  return (
    <DemoRoot
      path={path}
      controls={controls}
      inspector={inspector}
      code={highlighted}
    >
      <DemoToolbar />
      <DemoPreview
        Component={Component}
        isolated={isolated}
        className={className}
      />
      <DemoCodeTabs />
      {caption && <DemoCaption>{caption}</DemoCaption>}
    </DemoRoot>
  );
}
