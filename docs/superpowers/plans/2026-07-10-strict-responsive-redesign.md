# Strict Responsive Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every image appropriately sized and compressed, then rebuild the responsive layout so the Living Index remains coherent from 390px mobile to 1440px desktop.

**Architecture:** Keep the static HTML/CSS/JavaScript site and add reproducible asset generation plus stronger zero-dependency audits. HTML owns intrinsic media dimensions, CSS owns stable containers and type scales, and browser screenshots provide the final visual gate.

**Tech Stack:** Semantic HTML, CSS Grid/Flexbox, vanilla JavaScript, Node.js audit scripts, Pillow-based asset optimization, headless Microsoft Edge.

## Global Constraints

- Preserve the existing Living Index palette and all approved Chinese copy.
- Do not add a build framework or runtime dependency.
- Serve only local assets; no image hotlinks.
- Validate at 1440×900, 1024×768, 768×1024, and 390×844.
- Use test-first changes and commit each independently reviewable deliverable.

---

### Task 1: Lock the media contract with failing audits

**Files:**
- Modify: `tests/site-audit.mjs`
- Test: `tests/site-audit.mjs`

- [ ] Add assertions requiring intrinsic `width`/`height`, lazy decoding for non-hero images, portrait `srcset`, and referenced-image byte limits.
- [ ] Run `node tests/site-audit.mjs` and confirm failure messages identify the missing media contract.
- [ ] Commit the red test as `test: require responsive optimized media`.

### Task 2: Produce optimized responsive assets

**Files:**
- Create: `scripts/optimize-assets.py`
- Create: `assets/portrait/portrait-480.webp`
- Create: `assets/portrait/portrait-800.webp`
- Create: `assets/portrait/portrait-1200.webp`
- Create: optimized files under `assets/logos/`
- Modify: `index.html`

- [ ] Implement deterministic Pillow resizing that preserves alpha, removes transparent edge padding from logos, and writes WebP at documented quality.
- [ ] Run `python scripts/optimize-assets.py` and inspect dimensions and byte sizes.
- [ ] Replace image markup with intrinsic dimensions, responsive portrait sources, lazy loading, and asynchronous decoding.
- [ ] Run `node tests/site-audit.mjs` and confirm the media checks pass.
- [ ] Commit as `perf: optimize responsive image delivery`.

### Task 3: Rebuild the type and layout scale

**Files:**
- Modify: `tests/site-audit.mjs`
- Modify: `styles.css`

- [ ] Add failing assertions for the approved desktop/mobile title limits, content width, auto-height cards, and explicit map containment.
- [ ] Run the audit and confirm it fails on the old oversized values.
- [ ] Update the base grid, title clamps, card heights, work/logo proportions, bookshelf dimensions, and travel map container.
- [ ] Consolidate 768px and 520px overrides so later rules do not contradict earlier layout decisions.
- [ ] Run the audit and `git diff --check`; both must pass.
- [ ] Commit as `fix: stabilize responsive layout scale`.

### Task 4: Handle low-resolution book covers honestly

**Files:**
- Modify: `index.html`
- Modify: `styles.css`
- Modify: `tests/site-audit.mjs`

- [ ] Detect covers below 200px wide in the audit and confirm the current five 70px covers fail.
- [ ] Replace available covers with clearer local files; render unavailable titles with the approved typographic cover component instead of upscaling thumbnails.
- [ ] Confirm no raster cover is displayed beyond its acceptable source resolution.
- [ ] Commit as `fix: prevent low-resolution cover upscaling`.

### Task 5: Browser-based visual QA

**Files:**
- Modify: `README.md`
- Test: `tests/site-audit.mjs`

- [ ] Run `node tests/site-audit.mjs`, `node --check script.js`, and `git diff --check`.
- [ ] Capture fixed-viewport Edge screenshots at all four required dimensions and inspect hero, education, work, achievements, travel, reading, now, and contact.
- [ ] If a visual defect appears, add the smallest failing audit first, implement the fix, and recapture the affected viewport.
- [ ] Document image regeneration and visual QA commands in `README.md`.
- [ ] Commit as `docs: record strict visual verification workflow`.
