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
            ├── demo.tsx      # The rendered component (required)
            ├── data.ts       # Mock data, constants (optional)
            └── *.tsx/*.ts    # Implementation files shown in code tabs (optional)
```

### Demo Directory Convention

Each demo is a self-contained subdirectory under `demos/`:

- `demo.tsx` - The component that gets rendered. Props match control names.
- `data.ts` - Mock data and constants (keeps demo.tsx clean)
- Additional files - Implementation details shown in code tabs

Example structure:

```
demos/scroll-shadows/
├── demo.tsx              # Uses ScrollShadows, receives { shadows } prop
├── data.ts               # NOTIFICATIONS array, ICON_COLORS
├── use-scroll-progress.ts  # Hook implementation
└── scroll-shadows.tsx      # Component implementation
```

## File Naming

- **Folder slug**: kebab-case, e.g., `scroll-shadows`, `scroll-shadows-pt-2`
- **Cover image**: `{slug}.jpg` - matches folder name
- **Demo folders**: kebab-case, descriptive names

## page.mdx Structure

```mdx
import { Alert } from "~/components/crafts/alert";
import { Demo } from "~/components/crafts/demo";
import * as ScrollShadowsDemo from "./demos/scroll-shadows/demo";
import * as ProgressDemo from "./demos/progress/demo";

export const metadata = {
  title: "Post Title",
  date: "Month DD, YYYY",
  image: "slug.jpg",
};

# Title

<time className="-mt-6 mb-8 block text-gray-400">Month DD, YYYY</time>

Introduction paragraph...

<Demo
  demo={ScrollShadowsDemo}
  caption="Scroll the content and toggle shadows."
  controls={[
    { type: "switch", name: "shadows", label: "Shadows", defaultValue: true },
  ]}
  path="app/crafts/{slug}/demos/scroll-shadows"
  files={["demo.tsx", "use-scroll-progress.ts", "scroll-shadows.tsx"]}
/>

## Section Heading

Content...

<Demo
  demo={ProgressDemo}
  caption="Scroll to see the progress value."
  inspector={[
    { name: "progress", label: "--scroll-progress", defaultValue: "0" },
  ]}
  path="app/crafts/{slug}/demos/progress"
/>

<Alert variant="note">Callout content...</Alert>
```

## Demo Component Props

```tsx
<Demo
  demo={DemoModule}           // Required: import * as DemoModule from "./demos/xxx/demo"
  path="app/crafts/.../demos/xxx"  // Required: path to demo directory (relative to src/)
  caption="Description"       // Optional: shown below demo
  controls={[...]}            // Optional: interactive controls in toolbar
  inspector={[...]}           // Optional: read-only value displays in toolbar
  files={["demo.tsx", ...]}   // Optional: files to show in code tabs (order = tab order)
  className="w-full"          // Optional: container styling
  isolated={true}             // Optional: default true, adds padding
/>
```

### files Prop Behavior

- Not provided or empty `[]` → No code tabs, no code toggle button
- `files={["demo.tsx"]}` → Shows just the demo code
- `files={["demo.tsx", "hook.ts", "component.tsx"]}` → Multiple tabs in order

### Control Types

```tsx
// Switch - boolean control
{ type: "switch", name: "shadows", label: "Shadows", defaultValue: true }

// Slider - numeric control
{ type: "slider", name: "size", label: "Size", min: 0, max: 100, step: 1, defaultValue: 50, unit: "px" }
```

### Inspector

Maps callback props to read-only value displays in the toolbar:

```tsx
// name: display label, prop: callback prop name, format: "decimal" or omit, defaultValue: initial display
{ name: "progress", prop: "onProgressChange", format: "decimal", defaultValue: "0.00" }
{ name: "start", prop: "onStartChange", format: "decimal", defaultValue: "0.00" }
```

## demo.tsx Structure

Demo components should be **copy-paste ready** for readers. Avoid internal implementation details like `setInspector` - instead use clean, idiomatic callback props.

```tsx
"use client";

import { cn } from "@mikeour/ui/lib/utils";
import { ScrollShadows } from "./scroll-shadows";
import { NOTIFICATIONS, ICON_COLORS } from "./data";

// Props match control names from the Demo component
export default function Demo({ shadows = true }: { shadows?: boolean }) {
  return (
    <ScrollShadows showShadows={shadows}>{/* Demo content */}</ScrollShadows>
  );
}
```

### With Inspector (callback props)

When a demo needs to report values to the inspector, use **clean callback props** that readers would naturally use:

```tsx
export default function Demo({
  onProgressChange,
}: {
  onProgressChange?: (value: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: ref });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    onProgressChange?.(latest);
  });

  return <div ref={ref}>{/* Content */}</div>;
}
```

The `<Demo>` component maps these callbacks to inspector displays via the `inspector` prop:

```tsx
<Demo
  demo={ProgressDemo}
  inspector={[
    { name: "progress", prop: "onProgressChange", format: "decimal", defaultValue: "0.00" }
  ]}
/>
```

**Key principle**: Demo code is shown to users who will copy it. Keep it clean and focused on the concept being taught, not internal wiring.

## data.ts Structure

Keep mock data separate from demo logic:

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
- Code tabs support word wrap for long lines
- Expand/collapse toggle at bottom of code panel

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

## Adding to Crafts Listing

Update `apps/www/src/app/crafts/page.tsx`:

```tsx
import imgNewPost from "./{slug}/{slug}.jpg";

// In the grid:
<Link href="/crafts/{slug}">
  <Image src={imgNewPost} alt="" />
  <p>Post Title</p>
</Link>;
```

## Checklist for New Post

- [ ] Create folder: `crafts/{slug}/`
- [ ] Create `page.mdx` with metadata and content
- [ ] Create `demos/{demo-name}/` directories with:
  - [ ] `demo.tsx` - rendered component
  - [ ] `data.ts` - mock data (if needed)
  - [ ] Implementation files (if showing code)
- [ ] Add cover image: `{slug}.jpg`
- [ ] Update `crafts/page.tsx` to include in listing
- [ ] Run `pnpm typecheck` to verify
- [ ] Run `pnpm check` for linting
