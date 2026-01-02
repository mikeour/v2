# Craft Post Conventions

This document defines conventions for craft blog posts. AI agents should follow these patterns when creating or modifying craft posts.

## Folder Structure

```
crafts/
└── {slug}/
    ├── page.mdx              # Main content (required)
    ├── {slug}.jpg            # Cover image for listing (required)
    └── demos/                # Demo subdirectories
        └── {demo-name}/
            ├── index.tsx     # createDemo() definition (required)
            ├── preview.tsx   # The rendered preview component (required)
            ├── data.ts       # Mock data, constants (optional)
            └── *.tsx/*.ts    # Implementation files shown in code tabs (optional)
```

### Demo Directory Convention

Each demo is a self-contained subdirectory under `demos/`:

- `index.tsx` - Exports a named component created with `createDemo()`
- `preview.tsx` - The actual preview component that receives `{ controls, inspector }` props
- `data.ts` - Mock data and constants (keeps preview.tsx clean)
- Additional files - Implementation details shown in code tabs

Example structure:

```
demos/scroll-shadows/
├── index.tsx               # Exports ScrollShadowsDemo via createDemo()
├── preview.tsx             # Receives { controls, inspector } props
├── data.ts                 # NOTIFICATIONS array, ICON_COLORS
├── use-scroll-progress.ts  # Hook implementation
└── scroll-shadows.tsx      # Component implementation
```

## File Naming

- **Folder slug**: kebab-case, e.g., `scroll-shadows`, `scroll-shadows-pt-2`
- **Cover image**: `{slug}.jpg` - matches folder name
- **Demo folders**: kebab-case, descriptive names

## page.mdx Structure

```mdx
import { Demo } from "~/components/crafts/demo/server";
import { ScrollShadowsDemo } from "./demos/scroll-shadows";
import { ProgressDemo } from "./demos/progress";

export const metadata = {
  title: "Post Title",
  date: "Month DD, YYYY",
};

# Title

<time className="-mt-6 mb-8 block text-gray-400">Month DD, YYYY</time>

Introduction paragraph...

<Demo
  use={ScrollShadowsDemo}
  path="app/crafts/{slug}/demos/scroll-shadows"
  files={["preview.tsx", "scroll-shadows.tsx"]}
/>

## Section Heading

Content...

<Demo
  use={ProgressDemo}
  path="app/crafts/{slug}/demos/progress"
  files={["preview.tsx"]}
/>
```

**Key points:**
- Import `Demo` from `~/components/crafts/demo/server` (server component)
- The `use` prop receives the demo component created by `createDemo()`
- `path` is relative to `src/` and points to the demo directory
- `files` lists which files to show in code tabs

## Demo Architecture

The demo system has two parts:

1. **`createDemo()`** - Client-side factory that defines the demo UI, controls, and inspector
2. **`<Demo />`** - Server component that reads code files and injects them into the demo

### Demo index.tsx (createDemo)

```tsx
"use client";

import { createDemo } from "~/components/crafts/demo";
import Preview from "./preview";

export const ScrollShadowsDemo = createDemo({
  // Source link (VSCode in dev, GitHub in prod)
  path: import.meta.url,

  // Caption shown below the demo
  caption: "Scroll the content and toggle shadows.",

  // Show browser chrome around preview
  mockBrowser: true,

  // Interactive controls
  controls: [
    { type: "switch", name: "shadows", label: "Shadows", default: true },
    { type: "slider", name: "size", label: "Size", min: 16, max: 64, default: 32, unit: "px" },
  ] as const,

  // Read-only value displays
  inspector: [
    { name: "progress", label: "Scroll Progress", description: "Value from 0 to 1" },
  ] as const,

  // Preview component receives typed { controls, inspector } props
  preview: ({ controls, inspector }) => (
    <Preview
      shadows={controls.shadows}
      size={controls.size}
      onProgressChange={(p) => inspector.progress.set(p.toFixed(2))}
    />
  ),
});
```

**Important:** Use `as const` on `controls` and `inspector` arrays for full type inference.

### createDemo Config Options

| Option | Type | Description |
|--------|------|-------------|
| `path` | `string \| false` | `import.meta.url` for source link, or `false` to hide |
| `caption` | `string` | Text shown below the demo |
| `mockBrowser` | `boolean` | Show browser chrome around preview |
| `controls` | `ControlDef[]` | Interactive control definitions |
| `inspector` | `InspectorDef[]` | Read-only value display definitions |
| `codeOutput` | `CodeOutputDef` | Generated code panel (e.g., CSS from slider values) |
| `preview` | `ComponentType` | Component receiving `{ controls, inspector }` |

### Control Types

```tsx
// Switch - boolean toggle
{ type: "switch", name: "enabled", label: "Enabled", default: true }

// Slider - numeric range
{ type: "slider", name: "size", label: "Size", min: 0, max: 100, step: 1, default: 50, unit: "px" }

// Select - dropdown options
{ type: "select", name: "variant", label: "Variant", options: ["solid", "outline", "ghost"], default: "solid" }
```

### Inspector Definition

```tsx
inspector: [
  { name: "progress", label: "Scroll Progress", description: "0 to 1", default: "0.00" },
  { name: "velocity", label: "Velocity" },
] as const
```

### Inspector API

The preview component receives an `inspector` object with methods for each defined field:

```tsx
// Direct set - for event callbacks
inspector.progress.set("0.75");

// Track - for MotionValue or other Subscribable sources
inspector.progress.track(scrollYProgress, (v) => v.toFixed(2));
```

**Using `track()` with MotionValue:**

```tsx
import { useScroll } from "framer-motion";

preview: ({ inspector }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: ref });

  // Automatically subscribes and updates the inspector
  inspector.progress.track(scrollYProgress, (v) => v.toFixed(2));

  return <div ref={ref}>...</div>;
}
```

### Code Output (Generated Code Panel)

Show dynamically generated code based on control values:

```tsx
export const ShadowDemo = createDemo({
  controls: [
    { type: "slider", name: "size", label: "Size", min: 16, max: 64, default: 32, unit: "px" },
    { type: "slider", name: "opacity", label: "Opacity", min: 0, max: 1, step: 0.1, default: 0.5 },
  ] as const,

  codeOutput: {
    label: "Generated CSS",
    lang: "css",
    generate: (controls) => `.shadow {
  --shadow-size: ${controls.size}px;
  --shadow-opacity: ${controls.opacity};
}`,
  },

  preview: ({ controls }) => <Preview {...controls} />,
});
```

## preview.tsx Structure

Preview components receive typed props from `createDemo()`. They should be **copy-paste ready** for readers.

### Basic Preview (Controls Only)

```tsx
"use client";

import { ScrollShadows } from "./scroll-shadows";
import { NOTIFICATIONS } from "./data";

type PreviewProps = {
  shadows?: boolean;
  size?: number;
};

export default function Preview({ shadows = true, size = 32 }: PreviewProps) {
  return (
    <ScrollShadows showShadows={shadows} shadowSize={size}>
      {NOTIFICATIONS.map((n) => (
        <div key={n.id}>{n.title}</div>
      ))}
    </ScrollShadows>
  );
}
```

### Preview with Inspector Callbacks

```tsx
"use client";

import { useRef } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";

type PreviewProps = {
  onProgressChange?: (value: number) => void;
};

export default function Preview({ onProgressChange }: PreviewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: ref });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    onProgressChange?.(latest);
  });

  return <div ref={ref}>{/* Content */}</div>;
}
```

**Key principle**: Preview code is shown to users who will copy it. Keep it clean and focused on the concept being taught.

## Server Component Usage

In `page.mdx`, use the `<Demo />` server component to render demos with code tabs:

```mdx
import { Demo } from "~/components/crafts/demo/server";
import { ProgressDemo } from "./demos/progress";

<Demo
  use={ProgressDemo}
  path="app/crafts/scroll-shadows/demos/progress"
  files={["preview.tsx", "use-scroll-progress.ts"]}
/>
```

| Prop | Type | Description |
|------|------|-------------|
| `use` | `ComponentType` | Demo component from `createDemo()` |
| `path` | `string` | Path to demo directory (relative to `src/`) |
| `files` | `string[]` | Files to show in code tabs |

**File display behavior:**
- No `files` prop or empty `[]` → No code tabs, no toggle button
- `files={["preview.tsx"]}` → Single code tab
- `files={["preview.tsx", "hook.ts"]}` → Multiple tabs in order

## data.ts Structure

Keep mock data separate from preview logic:

```ts
export const NOTIFICATIONS = [
  { id: 1, title: "Message from Alex", time: "2m ago" },
  // ...
];

export const ICON_COLORS: Record<string, string> = {
  message: "bg-blue-500",
  // ...
};
```

## Code Display Notes

- Import `@mikeour/ui/lib/utils` is automatically displayed as `~/lib/utils`
- Lines with `// @demo` comment are stripped from display
- Block regions `// @demo-start` to `// @demo-end` are stripped
- Code tabs support word wrap for long lines

## Alert Variants

```tsx
<Alert variant="note">Info callout</Alert>
<Alert variant="tip">Helpful tip</Alert>
<Alert variant="warning">Warning message</Alert>
<Alert variant="caution">Caution message</Alert>
<Alert variant="important">Important info</Alert>
```

## Cover Image

- Format: JPG
- Aspect ratio: 4:3 (matches listing grid)
- Recommended size: 800x600px or larger
- Name must match folder slug: `{slug}.jpg`

## Checklist for New Post

- [ ] Create folder: `crafts/{slug}/`
- [ ] Create `page.mdx` with metadata and content
- [ ] Create `demos/{demo-name}/` directories with:
  - [ ] `index.tsx` - `createDemo()` definition
  - [ ] `preview.tsx` - preview component
  - [ ] `data.ts` - mock data (if needed)
  - [ ] Implementation files (if showing code)
- [ ] Add cover image: `{slug}.jpg`
- [ ] Run `pnpm typecheck` to verify
- [ ] Run `pnpm check` for linting
