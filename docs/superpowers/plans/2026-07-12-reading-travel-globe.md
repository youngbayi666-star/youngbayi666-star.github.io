# Reading Covers and Travel Globe Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace five typographic book placeholders with real covers and replace the static travel map plus city list with an interactive Globe.gl world globe containing 28 visited places.

**Architecture:** Keep the static HTML/CSS/JS site dependency-free at build time. Load Globe.gl and world GeoJSON at runtime from pinned CDN URLs; keep visited-place data and globe setup in `script.js`, while book covers remain optimized local assets.

**Tech Stack:** HTML5, CSS, vanilla JavaScript, Globe.gl via CDN, Node site audit, Playwright visual checks.

## Global Constraints

- Keep exactly 8 reading cards and 28 travel destinations.
- Every book card uses a local raster `<img>` cover with intrinsic dimensions, lazy loading, async decoding, and a text fallback.
- Remove `.city-index`, `.map-scroll`, `.travel-map`, and all `data-map-node` markup.
- Stop automatic rotation for `prefers-reduced-motion: reduce`.
- Preserve the existing `#246BFD` blue and `#FF4D8D` pink accent system.

---

### Task 1: Real Book Covers

**Files:**
- Modify: `tests/site-audit.mjs`
- Create: `assets/books/python-machine-learning.jpg`
- Create: `assets/books/r-in-action.jpg`
- Create: `assets/books/embedded-in-the-system.jpg`
- Create: `assets/books/money-games.jpg`
- Create: `assets/books/influence.jpg`
- Modify: `index.html`
- Modify: `styles.css`

**Interfaces:**
- Consumes: existing `.book` card structure.
- Produces: eight `.book__cover-frame` elements, each containing a local `<img>` and `.book__cover-fallback`.

- [ ] **Step 1: Tighten the reading audit first**

Require all eight cards to contain an `<img>`, a local `assets/books/` source, a fallback element, and an image width of at least 200.

- [ ] **Step 2: Run the audit and verify RED**

Run: `node tests/site-audit.mjs`
Expected: FAIL because five cards still use `.book-cover` typographic artwork.

- [ ] **Step 3: Acquire and optimize the five missing covers**

Download cover images from stable public book metadata sources, verify each title visually, resize to approximately 500×720, and keep each referenced file below 300 KB.

- [ ] **Step 4: Replace typographic covers with resilient image frames**

Use this contract for every card:

```html
<div class="book__cover-frame">
  <span class="book__cover-fallback" aria-hidden="true">书名</span>
  <img src="assets/books/file.jpg" width="500" height="720" loading="lazy" decoding="async" alt="《书名》封面" onerror="this.hidden=true;this.parentElement.classList.add('is-missing')">
</div>
```

- [ ] **Step 5: Run the audit and verify GREEN**

Run: `node tests/site-audit.mjs`
Expected: PASS for all reading-cover assertions.

- [ ] **Step 6: Commit**

```powershell
git add index.html styles.css tests/site-audit.mjs assets/books
git commit -m "fix: replace reading placeholders with real covers"
```

### Task 2: Interactive Night-Flight Globe

**Files:**
- Modify: `tests/site-audit.mjs`
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `script.js`

**Interfaces:**
- Produces: `VISITED_PLACES` with 28 `{name, region, lat, lng, accent}` records.
- Produces: `initTravelGlobe(container)` which initializes Globe.gl or exposes `.globe-fallback` on failure.

- [ ] **Step 1: Write globe structure assertions first**

Require `#travel-globe`, a loading/fallback status, a pinned Globe.gl CDN script, exactly 28 place records, reduced-motion handling, and absence of the legacy city list/map classes.

- [ ] **Step 2: Run the audit and verify RED**

Run: `node tests/site-audit.mjs`
Expected: FAIL because the page still contains the old SVG map and city index.

- [ ] **Step 3: Replace travel markup**

Create `.globe-stage`, `#travel-globe`, `.globe-status`, `.globe-orbit`, and a concise drag instruction. Remove the old SVG and `<ul class="city-index">` entirely.

- [ ] **Step 4: Implement globe behavior**

Initialize Globe.gl with transparent background, dark atmosphere, polygon world data, luminous points, hover labels, click-to-focus, bounded zoom, resize handling, slow autorotation, user-interaction pause, and a visible failure state.

- [ ] **Step 5: Style responsive night-flight composition**

Give the stage a circular glow and orbital lines; cap desktop globe width near 900px and use fluid sizing below 768px. Add visible keyboard focus and reduced-motion rules.

- [ ] **Step 6: Run static checks and verify GREEN**

Run: `node tests/site-audit.mjs` and `node --check script.js`
Expected: both exit 0.

- [ ] **Step 7: Commit**

```powershell
git add index.html styles.css script.js tests/site-audit.mjs
git commit -m "feat: replace travel index with interactive globe"
```

### Task 3: Browser and Visual Verification

**Files:**
- Create: `tests/visual-globe-check.py`
- Create: `artifacts/travel-reading-desktop.png`
- Create: `artifacts/travel-reading-mobile.png`

**Interfaces:**
- Consumes: local HTTP server at port 8000.
- Produces: desktop/mobile screenshots and assertions for canvas rendering, cover loading, legacy-list absence, and console errors.

- [ ] **Step 1: Write the Playwright verification**

Open the local page, wait for network idle and `#travel-globe canvas`, assert 8 loaded cover images, assert no `.city-index`, capture 1440×1100 and 390×844 screenshots, drag the globe, and fail on uncaught page errors.

- [ ] **Step 2: Run the browser verification**

Run the local static server and `python tests/visual-globe-check.py`.
Expected: PASS with both screenshots written.

- [ ] **Step 3: Inspect screenshots and remove one unnecessary decorative detail if visual density is excessive**

Check globe centering, point visibility, cover cropping, mobile touch space, text overflow, and section transitions.

- [ ] **Step 4: Run the full verification suite**

Run: `node tests/site-audit.mjs`, `node --check script.js`, `git diff --check`, and the Playwright check.
Expected: all commands exit 0 and browser console has no errors.

- [ ] **Step 5: Commit**

```powershell
git add tests/visual-globe-check.py artifacts
git commit -m "test: verify globe and reading layouts"
```

