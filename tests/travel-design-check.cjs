const { chromium } = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_CHANNEL ? { channel: process.env.BROWSER_CHANNEL } : {}) });
  const artifacts = path.resolve(__dirname, '../artifacts');
  fs.mkdirSync(artifacts, { recursive: true });
  const url = process.env.SITE_URL || 'http://127.0.0.1:8000/';
  try {
    for (const width of [1440, 768, 390, 320]) {
      const page = await browser.newPage({ viewport: { width, height: 960 }, reducedMotion: 'reduce' });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.locator('.globe-stage.is-ready').waitFor();
      await page.locator('#travel-globe').scrollIntoViewIfNeeded();
      assert.equal(await page.locator('[data-travel-directory] button').count(), 28);
      assert.equal(await page.locator('#travel canvas').count(), 1);
      await page.locator('.travel-route [data-travel-stop="大理"]').click();
      assert.equal(await page.locator('[data-stop-name]').innerText(), '大理');
      assert.match(await page.locator('[data-stop-coordinates]').innerText(), /25.61°N.*100.27°E/);
      await page.waitForFunction(() => document.querySelector('#travel-globe').dataset.camera?.startsWith('25.610,100.270'));
      await page.locator('[data-stop-next]').click();
      assert.equal(await page.locator('[data-stop-name]').innerText(), '丽江');
      await page.locator('[data-stop-prev]').click();
      assert.equal(await page.locator('[data-stop-name]').innerText(), '大理');
      await page.locator('[data-random-stop]').click();
      assert.notEqual(await page.locator('[data-stop-name]').innerText(), '大理');
      await page.locator('.travel-directory summary').click();
      await page.locator('[data-travel-directory] [data-travel-stop="印度尼西亚"]').click();
      assert.match(await page.locator('[data-stop-coordinates]').innerText(), /3.00°S/);
      await page.locator('.travel-directory summary').click();
      await page.locator('#travel-globe').focus();
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('#travel-globe').getAttribute('data-selected-stop'), null);
      await page.waitForFunction(() => document.querySelector('#travel-globe').dataset.camera?.match(/(?:1.750|2.050)$/));
      await page.locator('[data-world-reset]').click();
      await page.locator('#travel').screenshot({ path: path.join(artifacts, `travel-art-${width}.png`), style: '.site-header,.living-index,.skip-link { visibility: hidden !important; }' });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, 'page overflows');
      const canvas = await page.locator('#travel-globe canvas').boundingBox();
      assert(canvas.width >= 260 && canvas.height >= 300);
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}px: one globe, 28 stops, camera flight, stepper, random, reset, bounds`);
      await page.close();
    }
    const fallback = await browser.newPage();
    await fallback.route('**/assets/maps/world-countries.geojson*', route => route.abort());
    await fallback.goto(url, { waitUntil: 'networkidle' });
    await fallback.locator('.globe-stage.has-error').waitFor();
    await fallback.locator('.travel-route [data-travel-stop="长沙"]').click();
    assert.equal(await fallback.locator('[data-stop-name]').innerText(), '长沙');
    console.log('PASS: coordinate browsing remains available if map data fails');
    await fallback.close();
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
