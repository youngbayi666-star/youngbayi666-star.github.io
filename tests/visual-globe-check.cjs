const path = require("node:path");
const fs = require("node:fs");
const { chromium } = require("playwright");

const root = path.resolve(__dirname, "..");
const artifacts = path.join(root, "artifacts");
fs.mkdirSync(artifacts, { recursive: true });

async function verifyPage(page, screenshotName) {
  const url = process.env.SITE_URL || "http://127.0.0.1:8765/";
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 60_000 });
      lastError = undefined;
      break;
    } catch (error) {
      lastError = error;
      await page.waitForTimeout(500);
    }
  }
  if (lastError) throw lastError;
  await page.locator("#travel-globe canvas").waitFor({ state: "visible", timeout: 45_000 });
  await page.locator("#china-map .china-province").first().waitFor({ state: "visible", timeout: 45_000 });
  await page.locator("#travel").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1_000);

  if (await page.locator(".book").count() !== 8) throw new Error("reading shelf does not contain 8 cards");
  if (await page.locator(".book__cover-frame img").count() !== 8) throw new Error("not all book cards use images");
  if (await page.locator(".city-index").count() !== 0) throw new Error("legacy city index remains");
  if (await page.locator("#china-map .china-destination").count() !== 27) throw new Error("China map does not contain 27 destinations");
  if (await page.locator("#travel-globe .scene-container").count() !== 1) throw new Error("country globe scene is missing");
  if (await page.locator("#travel-globe .globe-country-label").count() !== 2) throw new Error("HTML country labels are missing");
  const countryLabelText = await page.locator("#travel-globe .globe-country-label").allTextContents();
  if (!countryLabelText.some((text) => text.includes("中国")) || !countryLabelText.some((text) => text.includes("印度尼西亚"))) {
    throw new Error("Chinese country names are not rendered as text");
  }
  const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  if (hasOverflow) throw new Error("page has horizontal overflow");
  const loaded = await page.locator(".book__cover-frame img").evaluateAll(
    (images) => images.every((image) => image.complete && image.naturalWidth >= 200),
  );
  if (!loaded) throw new Error("one or more book covers failed to load");
  const firstBook = page.locator(".book").first();
  await firstBook.hover();
  const hoverFilter = await firstBook.locator("img").evaluate((image) => getComputedStyle(image).filter);
  if (!hoverFilter.includes("grayscale(0)")) throw new Error("book cover does not restore color on hover");

  const canvas = page.locator("#travel-globe canvas");
  const box = await canvas.boundingBox();
  if (!box || box.width < 300 || box.height < 300) throw new Error("globe canvas is undersized");
  const worldPanelBox = await page.locator(".travel-atlas__world").boundingBox();
  if (!worldPanelBox || box.width > worldPanelBox.width + 2) throw new Error("globe canvas overflows the world panel");
  await page.mouse.move(box.x + box.width * 0.65, box.y + box.height * 0.5);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width * 0.4, box.y + box.height * 0.5, { steps: 8 });
  await page.mouse.up();
  await page.screenshot({ path: path.join(artifacts, screenshotName), fullPage: true });
  if (screenshotName.includes("desktop")) {
    await page.locator("#travel").screenshot({ path: path.join(artifacts, "travel-atlas-desktop.png") });
  }
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const pageErrors = [];
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 1 });
  desktop.on("pageerror", (error) => pageErrors.push(String(error)));
  desktop.on("console", (message) => { if (message.type() === "error") pageErrors.push(message.text()); });
  await verifyPage(desktop, "travel-reading-desktop.png");
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  mobile.on("pageerror", (error) => pageErrors.push(String(error)));
  mobile.on("console", (message) => { if (message.type() === "error") pageErrors.push(message.text()); });
  await verifyPage(mobile, "travel-reading-mobile.png");
  await browser.close();
  if (pageErrors.length) throw new Error(`browser page errors: ${pageErrors.join(" | ")}`);
  console.log("PASS: globe interaction and reading covers rendered in desktop and mobile viewports");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
