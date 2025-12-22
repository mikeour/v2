#!/usr/bin/env node

/**
 * Scaffold a new craft post
 * Usage: node scripts/new-craft.mjs
 */

import { createInterface } from "node:readline/promises";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { stdin, stdout } from "node:process";

const args = process.argv.slice(2);
const rl = createInterface({ input: stdin, output: stdout });

async function prompt(question, defaultValue) {
  const answer = await rl.question(
    defaultValue ? `${question} (${defaultValue}): ` : `${question}: `
  );
  return answer.trim() || defaultValue;
}

function toSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const craftsDir = join(import.meta.dirname, "../apps/www/src/app/crafts");

const today = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

async function main() {
  console.log("\n📝 New Craft Post\n");

  // Support CLI args: pnpm new:craft "Title" [slug]
  let title = args[0];
  let slug = args[1];

  if (!title) {
    title = await prompt("Title");
    if (!title) {
      console.error("Title is required");
      process.exit(1);
    }
    const defaultSlug = toSlug(title);
    slug = await prompt("Slug", defaultSlug);
  } else {
    slug = slug || toSlug(title);
    console.log(`Title: ${title}`);
    console.log(`Slug: ${slug}`);
  }

  const postDir = join(craftsDir, slug);
  const examplesDir = join(postDir, "examples");
  const snippetsDir = join(examplesDir, "snippets");

  const pageMdx = `import { Alert } from "~/components/crafts/alert";
import { InteractiveDemo } from "./examples/demos";

export const metadata = {
  title: "${title}",
  date: "${today}",
  image: "${slug}.jpg",
};

# ${title}

<time className="-mt-6 mb-8 block text-gray-400">${today}</time>

Introduction paragraph describing what this craft explores.

<InteractiveDemo caption="Interact with the demo to see the effect." />

## Overview

Explain the concept and what we're building.

## Implementation

Walk through the implementation step by step.

\`\`\`tsx
// Example code
\`\`\`

<Alert variant="note">
  Add helpful notes and tips throughout.
</Alert>

## Conclusion

Wrap up with key takeaways.
`;

  const demosTsx = `"use client";

import { cn } from "@mikeour/ui/lib/utils";

import { ExampleContainer } from "~/components/crafts/example-container";

// =============================================================================
// Internal Components
// =============================================================================

function Placeholder() {
  return (
    <div className="flex h-40 items-center justify-center rounded-lg bg-zinc-200">
      <span className="text-zinc-500">Demo content here</span>
    </div>
  );
}

// =============================================================================
// Exported Demo Components
// =============================================================================

export function InteractiveDemo({ caption }: { caption?: string }) {
  return (
    <ExampleContainer
      caption={caption}
      className="w-full"
      controls={[
        {
          type: "switch",
          name: "enabled",
          label: "Enabled",
          defaultValue: true,
        },
      ]}
    >
      {({ values }) => (
        <div className="p-8">
          <Placeholder />
          <p className="mt-4 text-center text-sm text-zinc-500">
            Enabled: {String(values.enabled)}
          </p>
        </div>
      )}
    </ExampleContainer>
  );
}

export function StaticDemo({ caption }: { caption?: string }) {
  return (
    <ExampleContainer caption={caption} className="w-full" isolated>
      <div className="p-8">
        <Placeholder />
      </div>
    </ExampleContainer>
  );
}
`;

  try {
    await mkdir(snippetsDir, { recursive: true });
    await writeFile(join(postDir, "page.mdx"), pageMdx);
    await writeFile(join(examplesDir, "demos.tsx"), demosTsx);
    await writeFile(join(snippetsDir, ".gitkeep"), "");

    console.log(`\n✓ Created craft post: ${slug}`);
    console.log(`  ${postDir}/`);
    console.log(`  ├── page.mdx`);
    console.log(`  └── examples/`);
    console.log(`      ├── demos.tsx`);
    console.log(`      └── snippets/`);
    console.log("\nNext steps:");
    console.log(`  1. Add cover image: ${slug}/${slug}.jpg`);
    console.log(`  2. Update crafts/page.tsx to include in listing`);
    console.log(`  3. Edit page.mdx and demos.tsx\n`);
  } catch (err) {
    console.error("Error creating craft:", err);
    process.exit(1);
  }

  rl.close();
}

main();
