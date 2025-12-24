import { readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CRAFTS_DIR = join(__dirname, "../apps/www/src/app/crafts");
const OUTPUT_DIR = join(__dirname, "../apps/www/public/images/crafts");
const BASE_URL = "http://localhost:3000";

const DEVICE_SCALE = 3;
const OUTPUT_WIDTH = 600 * DEVICE_SCALE;
const OUTPUT_HEIGHT = 400 * DEVICE_SCALE;

// Target component size range (in output pixels, accounting for scale)
const MIN_COMPONENT_WIDTH = 350 * DEVICE_SCALE;
const MAX_COMPONENT_WIDTH = 520 * DEVICE_SCALE;
const MAX_COMPONENT_HEIGHT = 320 * DEVICE_SCALE;

function createStripedBackground() {
  const tileSize = 72;

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

function calculateScale(width: number, height: number): number {
  let scale = 1;
  if (width < MIN_COMPONENT_WIDTH) {
    scale = MIN_COMPONENT_WIDTH / width;
  }
  if (width * scale > MAX_COMPONENT_WIDTH) {
    scale = MAX_COMPONENT_WIDTH / width;
  }
  if (height * scale > MAX_COMPONENT_HEIGHT) {
    scale = MAX_COMPONENT_HEIGHT / height;
  }
  return scale;
}

async function captureSlug(
  page: Awaited<
    ReturnType<typeof chromium.launch>
  >["newPage"] extends () => Promise<infer P>
    ? P
    : never,
  slug: string,
  stripedBg: Buffer
) {
  const url = `${BASE_URL}/crafts/${slug}`;
  console.log(`📸 Capturing ${slug}...`);

  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(500); // Wait for components to fully render

  // Check if mockBrowser is present - if so, capture the whole demo-content
  // Otherwise capture just the inner component to avoid background artifacts
  const demoContent = await page.$("[data-slot='demo-content']");
  if (!demoContent) {
    console.log(`   ⚠️  No component found for ${slug}, skipping`);
    return;
  }

  const hasMockBrowser = await demoContent.$("[data-slot='mock-browser']");
  const target = hasMockBrowser
    ? demoContent
    : (await demoContent.$(":scope > *")) || demoContent;

  let componentBuffer = await target.screenshot({ type: "png" });
  const componentMeta = await sharp(componentBuffer).metadata();

  let compWidth = componentMeta.width || 0;
  let compHeight = componentMeta.height || 0;
  const originalSize = `${compWidth}x${compHeight}`;

  const scale = calculateScale(compWidth, compHeight);

  if (scale !== 1) {
    compWidth = Math.round(compWidth * scale);
    compHeight = Math.round(compHeight * scale);
    componentBuffer = await sharp(componentBuffer)
      .resize(compWidth, compHeight)
      .toBuffer();
  }

  const left = Math.round((OUTPUT_WIDTH - compWidth) / 2);
  const top = Math.round((OUTPUT_HEIGHT - compHeight) / 2);

  const outputPath = join(OUTPUT_DIR, `${slug}.jpg`);

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
    `   ✓ Saved ${slug}.jpg (${originalSize} → ${compWidth}x${compHeight})`
  );
}

async function generateCraftImages() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1200, height: 900 },
    deviceScaleFactor: DEVICE_SCALE,
  });
  const page = await context.newPage();

  const stripedBg = await createStripedBackground();

  const entries = await readdir(CRAFTS_DIR, { withFileTypes: true });
  const crafts = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name);

  for (const slug of crafts) {
    try {
      await captureSlug(page, slug, stripedBg);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`   ✗ Failed: ${message}`);
    }
  }

  // Capture homepage preview - wait for images to refresh
  console.log(`\n📸 Capturing homepage preview...`);
  await page.goto(BASE_URL, { waitUntil: "networkidle" });
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(2000);
  await page.screenshot({
    path: join(OUTPUT_DIR, "_homepage-preview.png"),
    fullPage: true,
  });
  console.log(`   ✓ Saved _homepage-preview.png`);

  await browser.close();
  console.log("\n✅ Done!");
}

generateCraftImages();
