const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
  const artifacts = path.resolve(__dirname, '../artifacts');
  fs.mkdirSync(artifacts, { recursive: true });
  try {
    for (const width of [1440, 768, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 960 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(process.env.SITE_URL || 'http://127.0.0.1:8000/', { waitUntil: 'networkidle' });
      await page.locator('.globe-stage.is-ready').waitFor();
      await page.locator('.china-map-stage.is-ready').waitFor({ state: 'attached' });
      assert.equal(await page.locator('#atlas-china').isVisible(), false);
      await page.locator('[data-atlas-enter]').click();
      assert.equal(await page.locator('#atlas-world').isVisible(), false);
      assert.equal(await page.locator('#atlas-tab-china').getAttribute('aria-selected'), 'true');
      assert.equal(await page.locator('.china-destination').count(), 27);
      assert.equal(await page.locator('#destination-select option').count(), 27);
      await page.locator('#destination-select').selectOption('大理');
      assert.match(await page.locator('#destination-detail').innerText(), /大理.*25.61°N, 100.27°E/);
      assert.match(await page.locator('.china-destination.is-selected').getAttribute('aria-label'), /大理/);
      const beijing = page.locator('.china-destination').filter({ has: page.locator('text', { hasText: '北京' }) });
      await beijing.focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('#destination-select').inputValue(), '北京');
      await page.locator('#destination-select').selectOption('深圳');
      await page.locator('#travel').screenshot({ path: path.join(artifacts, `travel-journal-china-${width}.png`), style: '.site-header,.living-index,.skip-link { visibility: hidden !important; }' });
      await page.locator('#atlas-tab-china').focus();
      await page.keyboard.press('ArrowLeft');
      assert.equal(await page.locator('#atlas-tab-world').getAttribute('aria-selected'), 'true');
      await page.locator('[data-globe-country="Indonesia"]').click();
      assert.equal(await page.locator('[data-globe-country="Indonesia"]').getAttribute('aria-pressed'), 'true');
      await page.locator('#travel-globe').focus();
      await page.keyboard.press('ArrowLeft');
      assert.equal(await page.locator('[data-globe-country="Indonesia"]').getAttribute('aria-pressed'), 'false');
      await page.locator('[data-globe-country="China"]').click();
      await page.locator('#travel').screenshot({ path: path.join(artifacts, `travel-journal-${width}.png`), style: '.site-header,.living-index,.skip-link { visibility: hidden !important; }' });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'page overflows');
      const canvas = await page.locator('#travel-globe canvas').boundingBox();
      const panel = await page.locator('.travel-atlas__world').boundingBox();
      assert(canvas.width > 200 && canvas.height > 200, 'canvas too small');
      assert(canvas.x >= panel.x && canvas.x + canvas.width <= panel.x + panel.width, 'canvas exceeds panel');
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}px: atlas views, maps, selection, keyboard, country controls, canvas bounds`);
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
