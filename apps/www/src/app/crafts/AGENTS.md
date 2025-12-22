# Craft Post Conventions

This document defines conventions for craft blog posts. AI agents should follow these patterns when creating or modifying craft posts.

## Folder Structure

```
crafts/
└── {slug}/
    ├── page.mdx              # Main content (required)
    ├── {slug}.jpg            # Cover image for listing (required)
    └── examples/
        ├── demos.tsx         # All exported demo components (required)
        ├── {component}.tsx   # Reusable components for demos (optional)
        └── snippets/         # Code snippets for !from syntax (optional)
            └── {name}.tsx
```

### When to use separate component files

- `demos.tsx` - Always contains all exported demo components used in the MDX
- Additional `.tsx` files - Only for reusable components that:
  - Are imported by demos.tsx
  - Could potentially be extracted to a shared location later
  - Are complex enough to warrant separation (100+ lines)
  
Keep internal helpers, mock data, and simple components inside `demos.tsx`.

## File Naming

- **Folder slug**: kebab-case, e.g., `scroll-shadows`, `scroll-shadows-pt-2`
- **Cover image**: `{slug}.jpg` - matches folder name
- **Demos file**: Always `demos.tsx` - consolidates all exported demo components
- **Snippets**: Named descriptively, e.g., `added-progress.tsx`

## page.mdx Structure

```mdx
import { Alert } from "~/components/crafts/alert";
import { DemoA, DemoB } from "./examples/demos";

export const metadata = {
  title: "Post Title",
  date: "Month DD, YYYY",
  image: "slug.jpg",
};

# Title

<time className="-mt-6 mb-8 block text-gray-400">Month DD, YYYY</time>

Introduction paragraph...

<DemoA caption="Description of what to do." />

## Section Heading

Content...

### Inline Code Block
\`\`\`tsx
// Code here
\`\`\`

### External Code Snippet (typechecked)
\`\`\`tsx
!from ./examples/snippets/example.tsx
\`\`\`

<Alert variant="note">
  Callout content...
</Alert>
```

Note: The `metadata` export is used by the homepage and crafts listing to display post info. The `<time>` element should match the date in metadata.

## demos.tsx Structure

```tsx
"use client";

import { cn } from "@mikeour/ui/lib/utils";
import { ExampleContainer } from "~/components/crafts/example-container";

// =============================================================================
// Internal Components (not exported)
// =============================================================================

function InternalHelper() { ... }

// =============================================================================
// Exported Demo Components
// =============================================================================

export function InteractiveDemo({ caption }: { caption?: string }) {
  return (
    <ExampleContainer
      caption={caption}
      className="w-full"
      controls={[
        { type: "switch", name: "enabled", label: "Toggle", defaultValue: true },
      ]}
    >
      {({ values }) => (
        // Demo content using values.enabled
      )}
    </ExampleContainer>
  );
}

export function StaticDemo({ caption }: { caption?: string }) {
  return (
    <ExampleContainer caption={caption} className="w-full" isolated>
      {/* Static demo content */}
    </ExampleContainer>
  );
}
```

## ExampleContainer Props

- `caption?: string` - Description shown below the demo
- `className?: string` - Container styling
- `isolated?: boolean` - Renders without controls/inspector chrome
- `controls?: Control[]` - Interactive controls (switch, slider)
- `inspector?: Inspector[]` - Read-only value displays

### Control Types

```tsx
// Switch
{ type: "switch", name: "enabled", label: "Shadows", defaultValue: true }

// Slider
{ type: "slider", name: "size", label: "Size", min: 0, max: 100, step: 1, defaultValue: 50 }
```

### Inspector

```tsx
{ name: "value", label: "scrollProgress", defaultValue: "0.0" }
```

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
</Link>
```

## Checklist for New Post

- [ ] Create folder: `crafts/{slug}/`
- [ ] Create `page.mdx` with title, date, and content
- [ ] Create `examples/demos.tsx` with demo components
- [ ] Add cover image: `{slug}.jpg`
- [ ] Add snippets to `examples/snippets/` if using `!from` syntax
- [ ] Update `crafts/page.tsx` to include in listing
- [ ] Run `pnpm typecheck` to verify
- [ ] Run `pnpm check` for linting
