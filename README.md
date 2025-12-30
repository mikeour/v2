# mikeour

Personal website and portfolio built with Next.js, deployed on Vercel.

## Structure

```
apps/
  www/                 # Next.js website (@mikeour/www)
  storybook/           # Component documentation (@mikeour/storybook)
packages/
  ui/                  # Shared UI components (@mikeour/ui)
  integrations/        # Third-party integrations (Spotify, Letterboxd, TMDB)
  typescript-config/   # Shared TypeScript configs (@mikeour/typescript-config)
```

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Scripts

| Command              | Description                                 |
| -------------------- | ------------------------------------------- |
| `pnpm dev`           | Start development server                    |
| `pnpm build`         | Build all packages and apps                 |
| `pnpm typecheck`     | Run TypeScript checks across all packages   |
| `pnpm check`         | Run Biome linting                           |
| `pnpm fix`           | Run Biome linting and auto-fix              |
| `pnpm lint:versions` | Check for dependency version mismatches     |
| `pnpm clean`         | Remove all build artifacts and node_modules |

## Tooling

### Turborepo

Orchestrates builds and caching across the monorepo. Config in `turbo.json`.

- Runs tasks in parallel where possible
- Caches build outputs to skip redundant work
- Defines task dependencies (e.g., `build` depends on `^build` of dependencies)

### pnpm Workspaces

Manages dependencies across packages. Config in `pnpm-workspace.yaml`.

- Local packages use `workspace:*` protocol to link to each other
- Hoists shared dependencies to root `node_modules`
- Lockfile at root ensures consistent installs

### Biome

Linting and formatting via [Ultracite](https://github.com/haydenbleasel/ultracite) presets. Config in `biome.jsonc`.

- `pnpm check` - lint without fixing
- `pnpm fix` - lint and auto-fix

### Syncpack

Ensures consistent dependency versions across all packages. Config in `syncpack.config.mjs`.

- Runs automatically on `pnpm install` (postinstall hook)
- Fails if the same dependency has different versions in different packages
- Ignores `@mikeour/*` workspace references (they use `workspace:*`)
- Fix mismatches: `npx syncpack fix-mismatches`

### Lefthook

Git hooks for pre-commit checks. Config in `lefthook.yml`.

- Runs Biome linting on staged files
- Runs TypeScript type checking
- Installs automatically via `prepare` script

## Tech Stack

- [Next.js 16](https://nextjs.org) - React framework
- [React 19](https://react.dev) - UI library
- [Turborepo](https://turbo.build) - Monorepo build system
- [pnpm](https://pnpm.io) - Package manager
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Biome](https://biomejs.dev) - Linting and formatting
- [Radix UI](https://radix-ui.com) - UI primitives
- [Code Hike](https://codehike.org) - Code blocks in MDX
- [Framer Motion](https://motion.dev) - Animations

## Adding Dependencies

```bash
# Add to a specific package
pnpm add <package> --filter @mikeour/www

# Add to root (dev tools only)
pnpm add -D -w <package>
```

After adding dependencies, syncpack will verify version consistency automatically.

## Crafts (Blog Posts)

Interactive technical blog posts live in `apps/www/src/app/crafts/`. Each craft has demos with live code examples.

### Creating a New Craft

```bash
pnpm new:craft "Post Title"
```

This scaffolds the folder structure, MDX template, and demo files.

### Generating Cover Images

```bash
pnpm generate:craft-images
```

Captures demo screenshots and composites them onto a consistent background. Images are saved to `public/images/crafts/{slug}.jpg`.

### Craft Structure

```
crafts/{slug}/
├── page.mdx           # Content with Demo components
└── demos/             # Self-contained demo directories
    └── {demo-name}/
        ├── index.tsx  # createDemo() definition (required)
        ├── preview.tsx # Preview component (required)
        ├── data.ts    # Mock data (optional)
        └── *.tsx      # Implementation files for code tabs
```

### Demo System

The demo system has two parts:

1. **`createDemo()`** - Client-side factory that defines controls, inspector, and preview
2. **`<Demo />`** - Server component that reads code files for display

```tsx
// demos/my-demo/index.tsx
"use client";
import { createDemo } from "~/components/crafts/demo";
import Preview from "./preview";

export const MyDemo = createDemo({
  path: import.meta.url,
  caption: "Description shown below",
  controls: [
    { type: "switch", name: "enabled", label: "Enable", default: true },
    { type: "slider", name: "size", label: "Size", min: 0, max: 100, default: 50 },
  ] as const,
  inspector: [
    { name: "progress", label: "Progress" },
  ] as const,
  preview: ({ controls, inspector }) => (
    <Preview
      enabled={controls.enabled}
      size={controls.size}
      onProgressChange={(v) => inspector.progress.set(v.toFixed(2))}
    />
  ),
});

// page.mdx
import { Demo } from "~/components/crafts/demo/server";
import { MyDemo } from "./demos/my-demo";

<Demo
  use={MyDemo}
  path="app/crafts/{slug}/demos/my-demo"
  files={["preview.tsx"]}
/>
```

See `apps/www/src/app/crafts/AGENTS.md` for complete conventions.

## Component Organization

```
apps/www/src/components/
├── crafts/            # Craft-specific components
│   ├── demo/          # Demo system (createDemo factory + server component)
│   ├── alert.tsx      # Callout boxes
│   └── craft-card.tsx # Listing cards
├── mdx/               # MDX rendering components
│   ├── code.tsx       # Code blocks
│   ├── code-tabs.tsx  # Tabbed code panels
│   └── copy-button.tsx
└── utility/           # Dev utilities (screen-size indicator)
```

## Path Aliases

| Alias | Path |
| ----- | ---- |
| `~/`  | `apps/www/src/` |
| `@mikeour/ui/*` | `packages/ui/src/*` |

## RSC Considerations

This project uses React Server Components. Key patterns:

- Use `"use client"` directive for interactive components
- Object property access (e.g., `Component.Sub`) doesn't work across RSC boundary - use named exports
- Functions can't be passed as props from server to client components
- The Demo system handles this by having `createDemo()` run client-side while `<Demo />` server component only passes serializable data (highlighted code)
- `process.env.NODE_ENV` checks work in client components for dev-only features
