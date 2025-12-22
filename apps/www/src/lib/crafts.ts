import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

export type Craft = {
  slug: string;
  title: string;
  date: string;
  image: string;
};

const craftsDir = join(process.cwd(), "src/app/crafts");

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
      if (meta.title && meta.date && meta.image) {
        crafts.push({
          slug: dir.name,
          title: meta.title,
          date: meta.date,
          image: meta.image,
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

export async function getCraftImage(slug: string, image: string) {
  const img = await import(`~/app/crafts/${slug}/${image}`);
  return img.default;
}

function parseMetadataExport(content: string): Record<string, string> {
  // Match: export const metadata = { ... }
  const match = content.match(
    /export\s+const\s+metadata\s*=\s*\{([^}]+)\}/
  );
  if (!match) return {};

  const meta: Record<string, string> = {};
  const body = match[1];

  // Extract key: "value" or key: 'value' pairs
  const pairs = body.matchAll(/(\w+)\s*:\s*["']([^"']+)["']/g);
  for (const [, key, value] of pairs) {
    meta[key] = value;
  }

  return meta;
}
