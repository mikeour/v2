# mikeour

Personal website and portfolio built with Next.js, deployed on Vercel.

## Structure

```
apps/
  www/                 # Next.js website (@mikeour/www)
packages/
  ui/                  # Shared UI components (@mikeour/ui)
  tailwind-config/     # Shared Tailwind preset (@mikeour/tailwind-config)
  typescript-config/   # Shared TypeScript configs (@mikeour/typescript-config)
```

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Scripts

| Command          | Description                              |
| ---------------- | ---------------------------------------- |
| `pnpm dev`       | Start development server                 |
| `pnpm build`     | Build all packages and apps              |
| `pnpm typecheck` | Run TypeScript checks across all packages|
| `pnpm check`     | Run Biome linting                        |
| `pnpm fix`       | Run Biome linting and auto-fix           |
| `pnpm clean`     | Remove all build artifacts and node_modules |

## Tech Stack

- [Next.js](https://nextjs.org) - React framework
- [Turborepo](https://turbo.build) - Monorepo build system
- [pnpm](https://pnpm.io) - Package manager
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Biome](https://biomejs.dev) - Linting and formatting
- [Radix UI](https://radix-ui.com) - UI primitives
