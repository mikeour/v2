#!/usr/bin/env npx tsx

/**
 * Scaffold a new craft post
 * Usage: pnpm new:craft "Title" [slug]
 */

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const args = process.argv.slice(2);
const rl = createInterface({ input: stdin, output: stdout });

async function prompt(
  question: string,
  defaultValue?: string
): Promise<string> {
  const answer = await rl.question(
    defaultValue ? `${question} (${defaultValue}): ` : `${question}: `
  );
  return answer.trim() || defaultValue || "";
}

function toSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function toPascalCase(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const craftsDir = join(__dirname, "../apps/www/src/app/crafts");

const today = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

async function main() {
  console.log("\n📝 New Craft Post\n");

  let title = args[0];
  let slug = args[1];

  if (title) {
    slug = slug || toSlug(title);
    console.log(`Title: ${title}`);
    console.log(`Slug: ${slug}`);
  } else {
    title = await prompt("Title");
    if (!title) {
      console.error("Title is required");
      process.exit(1);
    }
    const defaultSlug = toSlug(title);
    slug = await prompt("Slug", defaultSlug);
  }

  const componentName = `${toPascalCase(slug)}Demo`;
  const postDir = join(craftsDir, slug);
  const demosDir = join(postDir, "demos");
  const interactiveDir = join(demosDir, "interactive");

  // page.mdx - Main content file
  const pageMdx = `import { Alert } from "~/components/crafts/alert";
import { Demo } from "~/components/crafts/demo/server";
import { ${componentName} } from "./demos/interactive";

export const metadata = {
  title: "${title}",
  date: "${today}",
};

# ${title}

<time className="-mt-6 mb-8 block text-gray-400">${today}</time>

Introduction paragraph describing what this craft explores.

<Demo
  use={${componentName}}
  path="app/crafts/${slug}/demos/interactive"
  files={["preview.tsx"]}
/>

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

  // index.tsx - createDemo definition
  const indexTsx = `"use client";

import { createDemo } from "~/components/crafts/demo";
import Preview from "./preview";

export const ${componentName} = createDemo({
  path: import.meta.url,
  caption: "Interact with the demo to see the effect.",

  controls: [
    { type: "switch", name: "enabled", label: "Enabled", default: true },
  ] as const,

  preview: ({ controls }) => <Preview enabled={controls.enabled} />,
});
`;

  // preview.tsx - The actual preview component
  const previewTsx = `"use client";

type PreviewProps = {
  enabled?: boolean;
};

export default function Preview({ enabled = true }: PreviewProps) {
  return (
    <div className="p-8">
      <div className="flex h-40 items-center justify-center rounded-lg bg-zinc-200">
        <span className="text-zinc-500">Demo content here</span>
      </div>
      <p className="mt-4 text-center text-sm text-zinc-500">
        Enabled: {String(enabled)}
      </p>
    </div>
  );
}
`;

  try {
    await mkdir(interactiveDir, { recursive: true });
    await writeFile(join(postDir, "page.mdx"), pageMdx);
    await writeFile(join(interactiveDir, "index.tsx"), indexTsx);
    await writeFile(join(interactiveDir, "preview.tsx"), previewTsx);

    console.log(`\n✓ Created craft post: ${slug}`);
    console.log(`  ${postDir}/`);
    console.log(`  ├── page.mdx`);
    console.log(`  └── demos/`);
    console.log(`      └── interactive/`);
    console.log(`          ├── index.tsx`);
    console.log(`          └── preview.tsx`);
    console.log("\nNext steps:");
    console.log(`  1. Edit page.mdx and demos/interactive/*.tsx`);
    console.log(
      `  2. Run pnpm generate:craft-images (with dev server running)\n`
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Error creating craft:", message);
    process.exit(1);
  }

  rl.close();
}

main();
