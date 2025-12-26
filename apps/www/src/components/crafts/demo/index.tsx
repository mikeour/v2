import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ComponentProps, ComponentType } from "react";
import { type HighlightedCode, highlight } from "codehike/code";

import theme from "~/themes/one-monokai.mjs";
import {
  DemoCaption,
  DemoCodeTabs,
  DemoPreview,
  DemoRoot,
  DemoToolbar,
} from "./renderer";

// =============================================================================
// Type utilities
// =============================================================================

// Extract keys where the value is assignable to T
type KeysMatching<Obj, T> = {
  [K in keyof Obj]: Obj[K] extends T ? K : never;
}[keyof Obj];

// Props that accept boolean (for switches)
type BooleanProps<P> = KeysMatching<P, boolean | undefined>;

// Props that accept number (for sliders)
type NumberProps<P> = KeysMatching<P, number | undefined>;

// Props that are callback functions (for inspector)
type CallbackProps<P> = KeysMatching<P, ((value: number) => void) | undefined>;

// =============================================================================
// Control & Inspector types (generic over component props)
// =============================================================================

type SwitchControl<P> = {
  type: "switch";
  prop: BooleanProps<P>;
  label: string;
  defaultValue?: boolean;
};

type SliderControl<P> = {
  type: "slider";
  prop: NumberProps<P>;
  label: string;
  min: number;
  max: number;
  step?: number;
  defaultValue?: number;
  unit?: string;
};

type Control<P> = SwitchControl<P> | SliderControl<P>;

type Inspector<P> = {
  name: string;
  label?: string;
  prop: CallbackProps<P>;
  format?: "decimal";
  defaultValue?: string;
};

// =============================================================================
// Demo props
// =============================================================================

type DemoProps<C extends ComponentType> = {
  /** The preview component */
  preview: C;
  /** Path to demo directory relative to src/ */
  path: string;
  /** Files to show in code tabs */
  files?: string[];
  /** Control definitions - props must match preview component */
  controls?: Control<ComponentProps<C>>[];
  /** Inspector definitions - props must be callbacks on preview component */
  inspector?: Inspector<ComponentProps<C>>[];
  /** Caption text */
  caption?: string;
  isolated?: boolean;
  className?: string;
  /** Show mock browser chrome */
  mockBrowser?: boolean;
};

// =============================================================================
// Implementation
// =============================================================================

const LANG_MAP: Record<string, string> = {
  ".tsx": "tsx",
  ".ts": "tsx",
  ".css": "css",
};

function cleanCodeForDisplay(code: string): string {
  return code.replace(/@mikeour\/ui\/lib\/utils/g, "~/lib/utils");
}

// Convert typed controls to renderer format (which uses `name` instead of `prop`)
function toRendererControls<P>(controls?: Control<P>[]) {
  return controls?.map((c) => ({ ...c, name: c.prop as string }));
}

function toRendererInspector<P>(inspector?: Inspector<P>[]) {
  return inspector?.map((i) => ({ ...i, prop: i.prop as string }));
}

export async function Demo<C extends ComponentType>({
  preview: Component,
  path,
  files,
  controls,
  inspector,
  caption,
  isolated,
  className,
  mockBrowser,
}: DemoProps<C>) {
  const fullPath = join(process.cwd(), "src", path);
  const cwd =
    process.env.NODE_ENV === "development" ? process.cwd() : undefined;

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
      cwd={cwd}
      controls={toRendererControls(controls)}
      inspector={toRendererInspector(inspector)}
      code={highlighted}
    >
      <DemoToolbar />
      <DemoPreview
        Component={Component}
        isolated={isolated}
        className={className}
        mockBrowser={mockBrowser}
      />
      <DemoCodeTabs />
      {caption && <DemoCaption>{caption}</DemoCaption>}
    </DemoRoot>
  );
}
