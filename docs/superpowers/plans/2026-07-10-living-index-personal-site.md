# Living Index Personal Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the existing static personal site as a responsive, accessible Living Index that presents Junyi Yang's identity, education, selected work, achievements, travel map, reading profile, current focus, and contact information.

**Architecture:** Keep a zero-build GitHub Pages site with semantic content in `index.html`, a single design system in `styles.css`, and progressive enhancement in `script.js`. Reuse verified local portraits and institution logos, store WeRead covers locally, and implement the travel visualization as accessible inline SVG so the core page remains readable without JavaScript.

**Tech Stack:** HTML5, CSS custom properties and media queries, vanilla JavaScript, inline SVG, Node.js built-in modules for structural tests, Python static server, headless Microsoft Edge for visual verification.

## Global Constraints

- Preserve zero-build GitHub Pages deployment; do not add npm dependencies or a frontend framework.
- Page order is Hero, About, Education, Work, Achievements, Travel, Reading, Now, Contact.
- Work includes only PKU Changsha Institute and ByteDance.
- Achievements show outcomes only; no filters, fabricated descriptions, or fake links.
- Travel uses the approved 28 destinations and no stock travel photographs.
- Reading publicly shows only 144 books, 522 days, 2434 notes, and the approved eight books.
- Public contact data is limited to the two supplied emails, GitHub, and WeChat copy text.
- Color tokens are `#F3F6FA`, `#101318`, `#246BFD`, `#FF4D8D`, and `#D8E1EC`.
- All core content must remain readable when JavaScript is disabled.
- Respect `prefers-reduced-motion`; interactive controls require visible keyboard focus.
- No horizontal overflow at 1440px, 768px, or 390px viewport widths.

---

### Task 1: Establish an executable site audit

**Files:**
- Create: `tests/site-audit.mjs`
- Modify: none

**Interfaces:**
- Consumes: `index.html`, `styles.css`, `script.js`, and files below `assets/`.
- Produces: a zero-dependency command `node tests/site-audit.mjs` that exits non-zero when required structure, content, accessibility hooks, or local assets are missing.

- [ ] **Step 1: Write the failing structural audit**

Create `tests/site-audit.mjs` with Node built-ins. It must read the three site files, assert that every required section id exists, assert that the approved signature and contacts exist, reject empty links and remote image sources, check that every referenced local image exists, and require reduced-motion CSS.

```js
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = read("index.html");
const css = read("styles.css");
const scriptPath = path.join(root, "script.js");
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

for (const id of ["about", "education", "work", "achievements", "travel", "reading", "now", "contact"]) {
  expect(new RegExp(`id=["']${id}["']`).test(html), `missing section #${id}`);
}
for (const text of ["往前走，别回头", "youngbayia@foxmail.com", "youngbayi666@gmail.com", "youngbayi666-star", "youngbayia1129"]) {
  expect(html.includes(text), `missing public content: ${text}`);
}
expect(fs.existsSync(scriptPath), "missing script.js");
expect(/prefers-reduced-motion/.test(css), "missing reduced motion support");
expect(!/href=["']\s*["']/.test(html), "empty href found");
expect(!/<img[^>]+src=["']https?:\/\//i.test(html), "remote image source found");
for (const match of html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
  expect(fs.existsSync(path.join(root, match[1])), `missing image: ${match[1]}`);
}
if (failures.length) {
  console.error(failures.map((item) => `FAIL: ${item}`).join("\n"));
  process.exit(1);
}
console.log("PASS: site structure and assets are valid");
```

- [ ] **Step 2: Run the audit and verify it fails against the current site**

Run: `node tests/site-audit.mjs`

Expected: non-zero exit with missing sections including `#education`, `#work`, `#achievements`, `#travel`, `#reading`, and `#now`, plus missing `script.js`.

- [ ] **Step 3: Commit the failing audit**

```bash
git add tests/site-audit.mjs
git commit -m "test: define living index site requirements"
```

### Task 2: Prepare verified local visual assets

**Files:**
- Create: `assets/portrait/portrait-cutout.png`
- Create: `assets/logos/logo-hnu.png`
- Create: `assets/logos/logo-cuhksz.png`
- Create: `assets/logos/logo-pku-institute.png`
- Create: `assets/logos/logo-bytedance.png`
- Create: `assets/books/python-machine-learning.jpg`
- Create: `assets/books/r-in-action.jpg`
- Create: `assets/books/embedded-in-china.jpg`
- Create: `assets/books/money-game.jpg`
- Create: `assets/books/influence.jpg`
- Create: `assets/books/evolutionary-psychology.jpg`
- Create: `assets/books/the-world-i-see.jpg`
- Create: `assets/books/life-is-a-sea.jpg`
- Modify: `tests/site-audit.mjs`

**Interfaces:**
- Consumes: existing verified files in `assets/` and WeRead cover URLs returned for the approved books.
- Produces: stable local image paths used by `index.html`; no image hotlinks.

- [ ] **Step 1: Extend the audit with the exact asset manifest**

Add an `assetManifest` array and existence checks:

```js
const assetManifest = [
  "assets/portrait/portrait-cutout.png",
  "assets/logos/logo-hnu.png",
  "assets/logos/logo-cuhksz.png",
  "assets/logos/logo-pku-institute.png",
  "assets/logos/logo-bytedance.png",
  "assets/books/python-machine-learning.jpg",
  "assets/books/r-in-action.jpg",
  "assets/books/embedded-in-china.jpg",
  "assets/books/money-game.jpg",
  "assets/books/influence.jpg",
  "assets/books/evolutionary-psychology.jpg",
  "assets/books/the-world-i-see.jpg",
  "assets/books/life-is-a-sea.jpg",
];
for (const asset of assetManifest) expect(fs.existsSync(path.join(root, asset)), `missing manifest asset: ${asset}`);
```

- [ ] **Step 2: Run the audit and verify the asset assertions fail**

Run: `node tests/site-audit.mjs`

Expected: non-zero exit listing the manifest paths that do not yet exist.

- [ ] **Step 3: Create focused asset folders and reuse verified local originals**

Copy the existing portrait and institution files without recompressing them:

```powershell
New-Item -ItemType Directory -Force assets\portrait,assets\logos,assets\books
Copy-Item assets\portrait-cutout.png assets\portrait\portrait-cutout.png
Copy-Item assets\logo-hnu.png assets\logos\logo-hnu.png
Copy-Item assets\logo-cuhksz.png assets\logos\logo-cuhksz.png
Copy-Item assets\logo-pku.png assets\logos\logo-pku-institute.png
Copy-Item assets\logo-bytedance.png assets\logos\logo-bytedance.png
```

- [ ] **Step 4: Download the eight approved covers and verify image responses before saving**

Use these exact WeRead responses and save them to the mapped manifest paths:

```text
https://wfqqreader-1252317822.image.myqcloud.com/cover/841/26211841/s_26211841.jpg -> assets/books/python-machine-learning.jpg
https://cdn.weread.qq.com/weread/cover/14/YueWen_26211859/s_YueWen_26211859.jpg -> assets/books/r-in-action.jpg
https://cdn.weread.qq.com/weread/cover/52/YueWen_40055543/s_YueWen_40055543.jpg -> assets/books/embedded-in-china.jpg
https://cdn.weread.qq.com/weread/cover/96/YueWen_44026161/s_YueWen_44026161.jpg -> assets/books/money-game.jpg
https://cdn.weread.qq.com/weread/cover/41/YueWen_41504771/s_YueWen_41504771.jpg -> assets/books/influence.jpg
https://cdn.weread.qq.com/weread/cover/20/cpplatform_qqjsdvzbgvmq32q3pfepta/t6_cpplatform_qqjsdvzbgvmq32q3pfepta1762152333.jpg -> assets/books/evolutionary-psychology.jpg
https://cdn.weread.qq.com/weread/cover/28/cpplatform_kg3xhzvscqeh1fgafdx7m1/t6_cpplatform_kg3xhzvscqeh1fgafdx7m11745725507.jpg -> assets/books/the-world-i-see.jpg
https://cdn.weread.qq.com/weread/cover/97/YueWen_25131764/t6_YueWen_25131764.jpg -> assets/books/life-is-a-sea.jpg
```

For every request, reject the response unless `Content-Type` starts with `image/`. Do not embed the API key in files or commands that print it.

- [ ] **Step 5: Run the audit to verify only page-structure failures remain**

Run: `node tests/site-audit.mjs`

Expected: asset failures are absent; section and script failures remain.

- [ ] **Step 6: Commit the prepared assets and manifest test**

```bash
git add assets/portrait assets/logos assets/books tests/site-audit.mjs
git commit -m "assets: add verified living index visuals"
```

### Task 3: Replace the page with semantic Living Index content

**Files:**
- Modify: `index.html`
- Create: `script.js`
- Modify: `tests/site-audit.mjs`

**Interfaces:**
- Consumes: the asset paths from Task 2 and the approved design copy.
- Produces: semantic sections with stable ids; navigation and controls targeted by `script.js` using `[data-menu-toggle]`, `[data-copy]`, and `[data-map-node]`.

- [ ] **Step 1: Extend the audit with content and semantic-control assertions**

```js
for (const text of [
  "我在鄱阳湖边的一座小镇长大",
  "湖南大学",
  "香港中文大学（深圳）",
  "北京大学长沙计算与数字经济研究院",
  "字节跳动",
  "28 destinations",
  "144 本",
  "522 天",
  "2434 条笔记",
]) expect(html.includes(text), `missing approved copy: ${text}`);
expect(/data-menu-toggle/.test(html), "missing mobile menu control");
expect(/data-copy=["']youngbayia1129["']/.test(html), "missing WeChat copy control");
expect(/<svg[^>]+aria-labelledby=/s.test(html), "travel map lacks accessible name");
```

- [ ] **Step 2: Run the audit and verify the new assertions fail**

Run: `node tests/site-audit.mjs`

Expected: missing approved copy, menu control, copy control, and accessible SVG failures.

- [ ] **Step 3: Rewrite `index.html` with the approved section order**

Use semantic `header`, `nav`, `main`, `section`, `article`, `time`, `address`, and inline `svg` elements. Include all approved education, work, achievement, travel, reading, Now, and contact content. Every image must use a local path and meaningful `alt`; decorative graphics use empty `alt` or `aria-hidden="true"`.

- [ ] **Step 4: Add minimal progressive enhancement in `script.js`**

Implement menu state, current-section highlighting, and clipboard behavior with safe fallbacks:

```js
const menuButton = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-site-nav]");
menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  nav?.toggleAttribute("data-open", open);
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    try {
      await navigator.clipboard.writeText(value);
      button.querySelector("[data-copy-status]").textContent = "已复制";
    } catch {
      button.querySelector("[data-copy-status]").textContent = value;
    }
  });
});
```

- [ ] **Step 5: Run the audit and verify semantic requirements pass except CSS-specific checks**

Run: `node tests/site-audit.mjs`

Expected: no missing section, copy, contact, local image, menu, or SVG failures.

- [ ] **Step 6: Commit semantic content and progressive enhancement**

```bash
git add index.html script.js tests/site-audit.mjs
git commit -m "feat: build semantic living index content"
```

### Task 4: Implement the unified visual system and responsive layouts

**Files:**
- Modify: `styles.css`
- Modify: `tests/site-audit.mjs`

**Interfaces:**
- Consumes: classes, data attributes, and section ids established in Task 3.
- Produces: the approved token system, desktop Living Index rail, responsive tablet/mobile layouts, visible focus, logo/cover treatment, and reduced-motion behavior.

- [ ] **Step 1: Extend the audit with exact token and responsive requirements**

```js
for (const token of ["#F3F6FA", "#101318", "#246BFD", "#FF4D8D", "#D8E1EC"]) {
  expect(css.toUpperCase().includes(token), `missing color token ${token}`);
}
expect(/@media\s*\([^)]*max-width:\s*768px/.test(css), "missing tablet/mobile breakpoint");
expect(/:focus-visible/.test(css), "missing visible keyboard focus");
expect(/overflow-x:\s*(clip|hidden)/.test(css), "missing page overflow guard");
```

- [ ] **Step 2: Run the audit and verify visual-system assertions fail**

Run: `node tests/site-audit.mjs`

Expected: missing token, breakpoint, focus, and overflow-guard failures.

- [ ] **Step 3: Replace `styles.css` with the approved design system**

Define the exact color variables, typography roles, 12-column desktop grid, sticky navigation, Hero composition, section rhythm, education trajectory, two-chapter work layout, achievement wall, dark travel map, editorial reading shelf, Now panel, and contact footer. Use one signature motion language based on the forward index line.

- [ ] **Step 4: Add responsive behavior at 1024px, 768px, and 520px**

At 768px and below, collapse to a single column, make navigation a real overlay panel, cap display headings with `clamp()`, keep the portrait inside the viewport, and allow only the map viewport—not the page—to scroll horizontally.

- [ ] **Step 5: Add accessibility and reduced-motion CSS**

```css
:focus-visible {
  outline: 3px solid var(--forward-blue);
  outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 6: Run the audit and verify it passes**

Run: `node tests/site-audit.mjs`

Expected: `PASS: site structure and assets are valid`.

- [ ] **Step 7: Commit the visual system**

```bash
git add styles.css tests/site-audit.mjs
git commit -m "feat: apply living index visual system"
```

### Task 5: Complete interaction behavior and map accessibility

**Files:**
- Modify: `script.js`
- Modify: `index.html`
- Modify: `tests/site-audit.mjs`

**Interfaces:**
- Consumes: section ids, map nodes, menu, and copy controls from Task 3.
- Produces: `IntersectionObserver`-based section state, accessible node descriptions, Escape-to-close menu behavior, and durable copy feedback.

- [ ] **Step 1: Add static assertions for interaction contracts**

```js
const js = read("script.js");
expect(/IntersectionObserver/.test(js), "missing section observer");
expect(/Escape/.test(js), "missing Escape menu handling");
expect(/navigator\.clipboard/.test(js), "missing clipboard enhancement");
expect((html.match(/data-map-node/g) ?? []).length === 28, "travel map must contain 28 nodes");
```

- [ ] **Step 2: Run the audit and verify the interaction assertions fail**

Run: `node tests/site-audit.mjs`

Expected: observer, Escape handling, or 28-node failures until implemented.

- [ ] **Step 3: Implement section observation and menu lifecycle**

Observe each main section with a `rootMargin` centered on the viewport, set `data-active-section` on `body`, update the matching nav link's `aria-current`, close the menu after navigation, and close it on Escape while returning focus to the toggle.

- [ ] **Step 4: Implement map-node focus behavior**

Each node must be focusable with `tabindex="0"`, reference a tooltip with `aria-describedby`, and expose the same label on hover and focus. JavaScript may add active styling but must not hide the labels from non-JavaScript users.

- [ ] **Step 5: Run the audit and verify it passes**

Run: `node tests/site-audit.mjs`

Expected: `PASS: site structure and assets are valid`.

- [ ] **Step 6: Commit interaction completion**

```bash
git add index.html script.js tests/site-audit.mjs
git commit -m "feat: complete navigation and map interactions"
```

### Task 6: Verify browser rendering, metadata, and handoff documentation

**Files:**
- Modify: `index.html`
- Modify: `README.md`
- Create: `assets/icons/favicon.svg`
- Modify: `tests/site-audit.mjs`

**Interfaces:**
- Consumes: the complete site from Tasks 2–5.
- Produces: deployable metadata, a favicon, reproducible local-preview instructions, passing structural checks, and desktop/tablet/mobile screenshots.

- [ ] **Step 1: Extend the audit for metadata and favicon**

```js
for (const pattern of [
  /<meta[^>]+name=["']description["']/i,
  /<meta[^>]+property=["']og:title["']/i,
  /<meta[^>]+property=["']og:description["']/i,
  /<link[^>]+rel=["']icon["']/i,
]) expect(pattern.test(html), `missing metadata: ${pattern}`);
expect(fs.existsSync(path.join(root, "assets/icons/favicon.svg")), "missing favicon asset");
```

- [ ] **Step 2: Run the audit and verify metadata assertions fail**

Run: `node tests/site-audit.mjs`

Expected: missing Open Graph metadata and favicon failures.

- [ ] **Step 3: Add metadata and a local favicon**

Add page title, description, Open Graph title/description/type, and favicon. Do not add a canonical URL or `og:url` until the final deployment URL is known. Build `favicon.svg` from the `J` wordmark with forward-blue and life-pink accents.

- [ ] **Step 4: Rewrite README preview and maintenance instructions**

Document `python -m http.server 8000 --bind 127.0.0.1`, the local URL, which HTML sections to edit, where to replace travel destinations and books, and the audit command.

- [ ] **Step 5: Run automated audit and HTTP resource checks**

Run:

```powershell
node tests/site-audit.mjs
curl.exe --silent --show-error --head http://127.0.0.1:8000/
```

Expected: audit prints PASS; HTTP returns `200 OK`.

- [ ] **Step 6: Render and inspect three browser sizes**

Render `1440x1000`, `768x1024`, and `390x844` after a 2500ms virtual-time budget. Confirm no page-level horizontal overflow, no text clipping, portrait/button separation, readable map labels, and visible contact controls.

- [ ] **Step 7: Check no-JavaScript and reduced-motion modes**

Disable JavaScript and confirm all sections, contacts, travel city names, and book titles remain readable. Emulate `prefers-reduced-motion: reduce` and confirm entrance and route animations complete immediately.

- [ ] **Step 8: Run final repository checks**

Run:

```bash
git diff --check
git status --short
node tests/site-audit.mjs
```

Expected: no whitespace errors; only intentional changes are present; audit passes.

- [ ] **Step 9: Commit documentation and release readiness**

```bash
git add index.html README.md assets/icons/favicon.svg tests/site-audit.mjs
git commit -m "docs: document preview and maintenance workflow"
```
