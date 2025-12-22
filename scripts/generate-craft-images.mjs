import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const CRAFTS_DIR = join(import.meta.dirname, "../apps/www/src/app/crafts");
const BASE_URL = "http://localhost:3000";

const OUTPUT_WIDTH = 600;
const OUTPUT_HEIGHT = 400;

// Target component size range (will scale to fit within this)
const MIN_COMPONENT_WIDTH = 350;
const MAX_COMPONENT_WIDTH = 520;
const MAX_COMPONENT_HEIGHT = 320;

const IMAGE_REGEX = /image:\s*["']([^"']+)["']/;

async function getImageName(slug) {
  const mdxPath = join(CRAFTS_DIR, slug, "page.mdx");
  const content = await readFile(mdxPath, "utf-8");
  const match = content.match(IMAGE_REGEX);
  return match ? match[1] : `${slug}.jpg`;
}

function createStripedBackground() {
  // Create a small tile with diagonal stripes, then tile it
  const tileSize = 12;

  // Create SVG for diagonal stripe pattern
  const svg = `
    <svg width="${OUTPUT_WIDTH}" height="${OUTPUT_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="stripes" width="${tileSize}" height="${tileSize}" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <line x1="0" y1="0" x2="0" y2="${tileSize}" stroke="rgb(51,65,85)" stroke-width="1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="rgb(30,41,59)"/>
      <rect width="100%" height="100%" fill="url(#stripes)"/>
    </svg>
  `;

  return sharp(Buffer.from(svg)).png().toBuffer();
}

async function generateCraftImages() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1200, height: 900 });

  // Pre-generate the striped background
  const stripedBg = await createStripedBackground();

  const entries = await readdir(CRAFTS_DIR, { withFileTypes: true });
  const crafts = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name);

  for (const slug of crafts) {
    const url = `${BASE_URL}/crafts/${slug}`;
    console.log(`📸 Capturing ${slug}...`);

    try {
      await page.goto(url, { waitUntil: "networkidle" });

      // Get the actual component (first child inside the inner wrapper)
      const inner = await page.$("[data-slot='example-content-inner'] > *");
      if (!inner) {
        console.log(`   ⚠️  No component found for ${slug}, skipping`);
        continue;
      }

      // Screenshot just the component
      let componentBuffer = await inner.screenshot({ type: "png" });
      const componentMeta = await sharp(componentBuffer).metadata();

      let compWidth = componentMeta.width || 0;
      let compHeight = componentMeta.height || 0;
      const originalSize = `${compWidth}x${compHeight}`;

      // Calculate scale factor
      // Scale up if too small, scale down if too large
      let scale = 1;

      if (compWidth < MIN_COMPONENT_WIDTH) {
        scale = MIN_COMPONENT_WIDTH / compWidth;
      }
      if (compWidth * scale > MAX_COMPONENT_WIDTH) {
        scale = MAX_COMPONENT_WIDTH / compWidth;
      }
      if (compHeight * scale > MAX_COMPONENT_HEIGHT) {
        scale = MAX_COMPONENT_HEIGHT / compHeight;
      }

      if (scale !== 1) {
        compWidth = Math.round(compWidth * scale);
        compHeight = Math.round(compHeight * scale);
        componentBuffer = await sharp(componentBuffer)
          .resize(compWidth, compHeight)
          .toBuffer();
      }

      // Calculate position to center component on canvas
      const left = Math.round((OUTPUT_WIDTH - compWidth) / 2);
      const top = Math.round((OUTPUT_HEIGHT - compHeight) / 2);

      // Get the image filename from metadata
      const imageName = await getImageName(slug);
      const outputPath = join(CRAFTS_DIR, slug, imageName);

      // Composite component onto striped background
      await sharp(stripedBg)
        .composite([
          {
            input: componentBuffer,
            left: Math.max(0, left),
            top: Math.max(0, top),
          },
        ])
        .jpeg({ quality: 90 })
        .toFile(outputPath);

      console.log(
        `   ✓ Saved ${imageName} (${originalSize} → ${compWidth}x${compHeight})`
      );
    } catch (err) {
      console.error(`   ✗ Failed: ${err.message}`);
    }
  }

  await browser.close();
  console.log("\n✅ Done!");
}

generateCraftImages();
