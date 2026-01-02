# Demo System

Interactive demo components for craft blog posts. Think of it like a **theater production**: the server is the backstage crew preparing props (code files), while the client is the stage where the performance happens (user interaction).

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                           page.mdx                                   │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  <Demo use={MyDemo} path="..." files={[...]} />               │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     server.tsx (Server Component)                    │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  1. Read files from disk (node:fs)                          │    │
│  │  2. Syntax highlight with CodeHike                          │    │
│  │  3. Pass highlighted code as prop to client component       │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ { code: HighlightedCode[] }
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     create.tsx (Client Component)                    │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  createDemo() factory returns a component that:             │    │
│  │  - Manages state (controls, inspector, showCode)            │    │
│  │  - Renders toolbar, panels, preview, code tabs              │    │
│  │  - Handles user interaction                                 │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

## Why Two Components?

The split exists because of **React Server Components (RSC)**:

| Concern | Server (`server.tsx`) | Client (`create.tsx`) |
|---------|----------------------|----------------------|
| File system access | ✅ Can read files | ❌ No `node:fs` |
| Syntax highlighting | ✅ At build time | ❌ Would bloat bundle |
| User interaction | ❌ No state/events | ✅ useState, onClick |
| Bundle size | Not shipped to browser | Shipped to browser |

## Module Reference

### Entry Points

| File | Purpose |
|------|---------|
| `index.ts` | Public API exports for consumers |
| `server.tsx` | Server component that reads code files |
| `create.tsx` | Factory function that creates demo components |
| `types.ts` | TypeScript definitions and inference utilities |

### Components (`components/`)

```
components/
├── root.tsx             # Outer container with consistent styling
├── toolbar.tsx          # Code toggle, reset, source link buttons
├── panels.tsx           # Desktop/mobile layouts for controls + inspector
├── control-input.tsx    # Renders switch/slider/select based on type
├── preview-container.tsx # Wraps preview, provides inspector API
├── code-tabs.tsx        # Tabbed code display with syntax highlighting
├── code-output.tsx      # Generated code panel (e.g., CSS from sliders)
└── caption.tsx          # Caption text below demo
```

### Hooks (`hooks/`)

| File | Purpose |
|------|---------|
| `use-demo-store.ts` | Zustand store managing controls, inspector, and UI state |

## Data Flow

```
┌──────────────────┐
│  createDemo()    │  Configuration: controls, inspector, preview
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  useDemoStore()  │  State: control values, inspector values, showCode
└────────┬─────────┘
         │
    ┌────┴────┬──────────────┐
    ▼         ▼              ▼
┌───────┐ ┌───────┐  ┌──────────────┐
│Toolbar│ │Panels │  │PreviewContainer│
└───────┘ └───────┘  └──────┬───────┘
                            │
                            ▼
                     ┌─────────────┐
                     │   Preview   │  Your demo component
                     │ (controls,  │  receives typed props
                     │  inspector) │
                     └─────────────┘
```

**Controls flow down**: `useDemoStore` → `Panels` → `ControlInput` (user changes value) → `useDemoStore.setControl`

**Inspector flows up**: `Preview` calls `inspector.field.set()` → `useDemoStore.setInspector` → `Panels` displays value

## Step-by-Step: What Happens When a Demo Renders

1. **MDX imports the demo**
   ```tsx
   import { Demo } from "~/components/crafts/demo/server";
   import { MyDemo } from "./demos/my-demo";
   ```

2. **Server component reads files** (`server.tsx`)
   - Reads `preview.tsx` and other files from disk
   - Highlights syntax using CodeHike
   - Passes `code` prop to the client component

3. **Client component hydrates** (`create.tsx`)
   - `useDemoStore` initializes state from control defaults
   - Toolbar, panels, and preview render

4. **User interacts**
   - Toggles a switch → `setControl("shadows", false)`
   - Store updates → `controls.shadows` changes
   - Preview re-renders with new prop value

5. **Preview reports values**
   - Scroll event fires → `inspector.progress.set("0.75")`
   - Store updates → inspector panel shows new value

## Common Gotcha: The RSC Boundary

**Problem**: You try to import `Demo` from `~/components/crafts/demo` instead of `~/components/crafts/demo/server` and get a bundler error about `node:fs`.

```tsx
// ❌ WRONG - This imports the client-side index.ts which re-exports server code
import { Demo } from "~/components/crafts/demo";

// ✅ CORRECT - Import server component directly
import { Demo } from "~/components/crafts/demo/server";
```

**Why?** The `index.ts` only exports client-safe code (`createDemo`, types). The server component must be imported from its own file to keep `node:fs` out of the client bundle.

## Type Inference

The `as const` assertion is critical for type safety:

```tsx
// ❌ Without `as const` - controls.shadows is `boolean | number | string`
controls: [
  { type: "switch", name: "shadows", default: true },
]

// ✅ With `as const` - controls.shadows is `boolean`
controls: [
  { type: "switch", name: "shadows", default: true },
] as const
```

This works because `as const` preserves the literal types (`"switch"`, `"shadows"`), allowing TypeScript to infer the exact shape of the controls object.
