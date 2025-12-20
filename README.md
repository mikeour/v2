# mikeour

Personal website and portfolio built with Next.js, deployed on Vercel.

## Structure

```
apps/
  www/                 # Next.js website (@mikeour/www)
packages/
  ui/                  # Shared UI components (@mikeour/ui)
  integrations/        # Shared third-party integrations (Spotify, Letterboxd, etc)
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
