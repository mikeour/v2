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
            ├── index.tsx     # Exports composed Demo component (required)
            ├── preview.tsx   # The rendered preview component (required)
            ├── data.ts       # Mock data, constants (optional)
            └── *.tsx/*.ts    # Implementation files shown in code tabs (optional)
```

### Demo Directory Convention

Each demo is a self-contained subdirectory under `demos/`:

- `index.tsx` - Exports a named component that composes `<Demo>` with all configuration
- `preview.tsx` - The actual preview component. Props match control names.
- `data.ts` - Mock data and constants (keeps preview.tsx clean)
- Additional files - Implementation details shown in code tabs

Example structure:

```
demos/scroll-shadows/
├── index.tsx               # Exports ScrollShadowsDemo
├── preview.tsx             # Uses ScrollShadows, receives { shadows } prop
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
import { Alert } from "~/components/crafts/alert";
import { ScrollShadowsDemo } from "./demos/scroll-shadows";
import { ProgressDemo } from "./demos/progress";

export const metadata = {
  title: "Post Title",
  date: "Month DD, YYYY",
  image: "slug.jpg",
};

# Title

<time className="-mt-6 mb-8 block text-gray-400">Month DD, YYYY</time>

Introduction paragraph...

<ScrollShadowsDemo />

## Section Heading

Content...

<ProgressDemo />

<Alert variant="note">Callout content...</Alert>
```

## Demo index.tsx Structure

The index.tsx file exports a named component that composes the Demo with all configuration:

```tsx
import { Demo } from "~/components/crafts/demo";
import Preview from "./preview";

export function ScrollShadowsDemo() {
  return (
    <Demo
      preview={Preview}
      caption="Scroll the content and toggle shadows."
      controls={[
        {
          type: "switch",
          name: "shadows",
          label: "Shadows",
          defaultValue: true,
        },
      ]}
      path="app/crafts/{slug}/demos/scroll-shadows"
      files={["preview.tsx", "use-scroll-progress.ts", "scroll-shadows.tsx"]}
    />
  );
}
```

### Demo Props

```tsx
<Demo
  preview={PreviewComponent}      // Required: the preview component
  path="app/crafts/.../demos/xxx" // Required: path to demo directory (relative to src/)
  caption="Description"           // Optional: shown below demo
  controls={[...]}                // Optional: interactive controls
  inspector={[...]}               // Optional: read-only value displays
  files={["preview.tsx", ...]}    // Optional: files to show in code tabs
  className="w-full"              // Optional: container styling
  isolated={true}                 // Optional: default true, adds padding
  mockBrowser                     // Optional: show browser chrome
/>
```

### files Prop Behavior

- Not provided or empty `[]` → No code tabs, no code toggle button
- `files={["preview.tsx"]}` → Shows just the preview code
- `files={["preview.tsx", "hook.ts", "component.tsx"]}` → Multiple tabs in order

### Control Types

```tsx
// Switch - boolean control
{ type: "switch", name: "shadows", label: "Shadows", defaultValue: true }

// Slider - numeric control
{ type: "slider", name: "size", label: "Size", min: 0, max: 100, step: 1, defaultValue: 50, unit: "px" }
```

### Inspector

Maps callback props to read-only value displays:

```tsx
inspector={[
  { name: "progress", prop: "onProgressChange", format: "decimal", defaultValue: "0.00" },
  { name: "start", prop: "onStartChange", format: "decimal", defaultValue: "0.00" },
]}
```

## Demo Components

### Inspector Component

The Inspector is a composable component for displaying read-only values in the demo UI. It follows the shadcn composition pattern with namespaced sub-components.

**Location**: `~/components/crafts/demo/inspector`

**Components**:
- `Inspector.Root` - Outer container (`flex flex-col gap-0.5`)
- `Inspector.Header` - Row container for name/value (`flex items-center justify-between gap-2`)
- `Inspector.Name` - Label text (slate-400, text-sm)
- `Inspector.Value` - Monospace value display (badge style with tabular-nums)
- `Inspector.Description` - Optional description (slate-500, text-xs)

**Usage**:

```tsx
import { Inspector } from "~/components/crafts/demo/inspector";

<Inspector.Root>
  <Inspector.Header>
    <Inspector.Name>Progress</Inspector.Name>
    <Inspector.Value>0.75</Inspector.Value>
  </Inspector.Header>
  <Inspector.Description>Current scroll progress</Inspector.Description>
</Inspector.Root>
```

**All components accept `className`** for style overrides via the `cn()` utility.

**Pattern**: When creating new demo UI components, follow this composition pattern:
1. Create a new directory under `~/components/crafts/demo/`
2. Export namespaced components that accept `className` and `children`
3. Use `cn()` to compose base styles with custom className
4. Each component handles one specific piece of UI

### Control Component

The Control is a context-based composable component for rendering interactive controls (switches, sliders, etc.). It automatically handles ID generation, type-aware rendering, and value management through React Context.

**Location**: `~/components/crafts/demo/control`

**Architecture**: Control.Root creates a context containing the control type, value, onChange handler, and configuration. Child components read from this context to render appropriately.

**Components**:
- `Control.Root` - Provider component that accepts control configuration and creates context
- `Control.Input` - Type-aware input renderer (automatically renders Switch or Slider based on type)
- `Control.Label` - Auto-wired label (automatically gets `htmlFor` from context)
- `Control.Value` - Auto-wired value display (only renders for slider type, reads value/unit from context)
- `Control.Description` - Optional description text
- `Control.Row` - Layout helper for horizontal arrangements

**Key Features**:
- ✅ Automatic ID generation using React's `useId()`
- ✅ Type-safe props based on control type (switch vs slider)
- ✅ No manual prop passing between Label, Input, and Value
- ✅ Control.Input dynamically renders the correct component based on type
- ✅ Switch and Slider components imported directly (no prop drilling)

**Usage Examples**:

```tsx
import { Control } from "~/components/crafts/demo/control";

// Switch control
<Control.Root type="switch" value={enabled} onChange={setEnabled}>
  <Control.Row className="flex-row-reverse justify-end">
    <Control.Label>Enable Shadows</Control.Label>
    <Control.Input />
  </Control.Row>
  <Control.Description>Toggle shadows on/off</Control.Description>
</Control.Root>

// Slider control
<Control.Root
  type="slider"
  value={size}
  onChange={setSize}
  min={16}
  max={64}
  step={8}
  unit="px"
>
  <Control.Label>Shadow Size</Control.Label>
  <Control.Row>
    <Control.Input className="w-full" />
    <Control.Value />
  </Control.Row>
  <Control.Description>Adjust the shadow size</Control.Description>
</Control.Root>
```

**All components accept `className`** for style overrides via the `cn()` utility.

**Extensibility**: To add new control types (e.g., color picker, select):
1. Extend the `ControlConfig` union type in `control/index.tsx`
2. Import the new component at the top of the file
3. Add a new `case` to the exhaustive switch in `Control.Input`
4. Add a new `case` to the exhaustive switch in `ControlRenderer` (in `renderer.tsx`)

**Type Safety**: Both `Control.Input` and `ControlRenderer` use exhaustive switch statements with `never` checks:
```tsx
switch (control.type) {
  case "switch":
    return <Switch ... />;
  case "slider":
    return <Slider ... />;
  default: {
    const _exhaustive: never = control;
    throw new Error(`Unhandled control type: ${JSON.stringify(_exhaustive)}`);
  }
}
```
This ensures TypeScript will error at compile-time if a new control type is added to `ControlConfig` but not handled in the switch. The `never` type proves all cases are covered.

**Example**: If you add a new type to `ControlConfig`:
```tsx
type ControlConfig =
  | SwitchConfig
  | SliderConfig
  | { type: "color-picker"; value: string; onChange: (v: string) => void }; // New type!
```
TypeScript will immediately error in both `Control.Input` and `ControlRenderer` at the `default` case:
```
Type 'ColorPickerConfig' is not assignable to type 'never'
```
This forces you to handle the new case, preventing runtime errors.

## preview.tsx Structure

Preview components should be **copy-paste ready** for readers. Props match control names.

```tsx
"use client";

import { cn } from "@mikeour/ui/lib/utils";
import { ScrollShadows } from "./scroll-shadows";
import { NOTIFICATIONS, ICON_COLORS } from "./data";

// Props match control names from the Demo component
export default function Preview({ shadows = true }: { shadows?: boolean }) {
  return (
    <ScrollShadows showShadows={shadows}>{/* Demo content */}</ScrollShadows>
  );
}
```

### With Inspector (callback props)

When a preview needs to report values to the inspector, use clean callback props:

```tsx
export default function Preview({
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

**Key principle**: Preview code is shown to users who will copy it. Keep it clean and focused on the concept being taught.

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
  - [ ] `index.tsx` - exports composed Demo component
  - [ ] `preview.tsx` - rendered preview component
  - [ ] `data.ts` - mock data (if needed)
  - [ ] Implementation files (if showing code)
- [ ] Add cover image: `{slug}.jpg`
- [ ] Update `crafts/page.tsx` to include in listing
- [ ] Run `pnpm typecheck` to verify
- [ ] Run `pnpm check` for linting
