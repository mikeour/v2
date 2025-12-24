import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

export type Craft = {
  slug: string;
  title: string;
  date: string;
};

const craftsDir = join(process.cwd(), "src/app/crafts");
const METADATA_REGEX = /export\s+const\s+metadata\s*=\s*\{([^}]+)\}/;

export async function getCrafts(): Promise<Craft[]> {
  const entries = await readdir(craftsDir, { withFileTypes: true });
  const dirs = entries.filter(
    (e) => e.isDirectory() && !e.name.startsWith(".")
  );

  const crafts: Craft[] = [];

  for (const dir of dirs) {
    const mdxPath = join(craftsDir, dir.name, "page.mdx");
    try {
      const content = await readFile(mdxPath, "utf-8");
      const meta = parseMetadataExport(content);
      if (meta.title && meta.date) {
        crafts.push({
          slug: dir.name,
          title: meta.title,
          date: meta.date,
        });
      }
    } catch {
      // Skip directories without valid page.mdx
    }
  }

  // Sort by date descending
  return crafts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

function parseMetadataExport(content: string): Record<string, string> {
  const match = content.match(METADATA_REGEX);
  if (!match) {
    return {};
  }

  const meta: Record<string, string> = {};
  const body = match[1];

  // Extract key: "value" or key: 'value' pairs
  const pairs = body.matchAll(/(\w+)\s*:\s*["']([^"']+)["']/g);
  for (const [, key, value] of pairs) {
    meta[key] = value;
  }

  return meta;
}
