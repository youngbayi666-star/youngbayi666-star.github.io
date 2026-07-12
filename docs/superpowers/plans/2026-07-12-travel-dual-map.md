# Travel Dual Map Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore book-cover color on hover and replace the single travel globe with a country-level globe beside an accurate China destination map.

**Architecture:** Keep Globe.gl for the world view, add pinned D3 for an SVG China projection, and share the existing destination data between the map renderers. Tests enforce two visited countries, 27 China points, direct image hover filtering, responsive layout, and browser rendering.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Globe.gl 2.46.1, D3 7.9.0, DataV China GeoJSON, Node audit, Playwright.

## Global Constraints

- Highlight only China and Indonesia on the globe.
- Render exactly 27 China destinations on the China map.
- Treat Hong Kong and Macau as China-map destinations.
- Preserve reduced-motion, keyboard focus, CDN failure states, and mobile stacking.

---

### Task 1: Book Cover Color Recovery

**Files:**
- Modify: `tests/site-audit.mjs`
- Modify: `styles.css`

- [ ] Add a failing assertion requiring `.book:hover .book__cover-frame img` to set grayscale to zero and restore saturation.
- [ ] Run `node tests/site-audit.mjs`; expect failure because the hover filter targets only the frame.
- [ ] Separate frame lift/shadow from image color/scale transitions; add reduced-motion override.
- [ ] Run `node tests/site-audit.mjs`; expect PASS.

### Task 2: Country Globe and China Destination Map

**Files:**
- Modify: `tests/site-audit.mjs`
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `script.js`
- Modify: `tests/visual-globe-check.cjs`

- [ ] Add failing assertions for `.travel-atlas`, `#china-map`, pinned D3, two visited countries, 27 China destinations, and removal of globe city points.
- [ ] Run `node tests/site-audit.mjs`; expect failures for the missing dual-map structure and data split.
- [ ] Replace the travel markup with `travel-atlas__world` and `travel-atlas__china` panels.
- [ ] Refactor globe rendering to color China and Indonesia polygons, show country labels, and use a brighter ocean/land palette.
- [ ] Render DataV province GeoJSON into a responsive SVG with 27 focusable city points, priority labels, tooltips, and a readable error state.
- [ ] Add 46/54 desktop grid, stacked mobile layout, earthlike color tokens, and restrained panel framing.
- [ ] Extend Playwright checks for both globe canvas and China SVG, no horizontal overflow, no page/console errors, and desktop/mobile screenshots.
- [ ] Run `node tests/site-audit.mjs`, `node --check script.js`, `node --check tests/visual-globe-check.cjs`, `git diff --check`, and the browser test; expect all PASS.
- [ ] Commit with `git commit -m "feat: add world and China travel atlas"`.

