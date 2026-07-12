import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const html = read("index.html");
const css = read("styles.css");
const scriptPath = path.join(root, "script.js");
const failures = [];
const expect = (condition, message) => {
  if (!condition) failures.push(message);
};

for (const id of [
  "about",
  "education",
  "work",
  "achievements",
  "travel",
  "reading",
  "now",
  "contact",
]) {
  expect(new RegExp(`id=["']${id}["']`).test(html), `missing section #${id}`);
}

for (const content of [
  "往前走，别回头",
  "youngbayia@foxmail.com",
  "youngbayi666@gmail.com",
  "youngbayi666-star",
  "youngbayia1129",
]) {
  expect(html.includes(content), `missing public content: ${content}`);
}

expect(fs.existsSync(scriptPath), "missing script.js");
expect(/prefers-reduced-motion/.test(css), "missing reduced motion support");
expect(!/href=["']\s*["']/.test(html), "empty href found");
expect(!/<img[^>]+src=["']https?:\/\//i.test(html), "remote image source found");

for (const match of html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)) {
  expect(fs.existsSync(path.join(root, match[1])), `missing image: ${match[1]}`);
}

const imageTags = [...html.matchAll(/<img\b[^>]*>/gi)].map(([tag]) => tag);
for (const tag of imageTags) {
  const src = tag.match(/src=["']([^"']+)["']/i)?.[1] ?? "unknown";
  expect(/\bwidth=["']\d+["']/i.test(tag), `missing intrinsic width: ${src}`);
  expect(/\bheight=["']\d+["']/i.test(tag), `missing intrinsic height: ${src}`);
  expect(/\bdecoding=["']async["']/i.test(tag), `missing async decoding: ${src}`);
  if (!/hero__portrait/.test(tag)) {
    expect(/\bloading=["']lazy["']/i.test(tag), `missing lazy loading: ${src}`);
  }
}

for (const portrait of [
  "assets/portrait/portrait-480.webp",
  "assets/portrait/portrait-800.webp",
  "assets/portrait/portrait-1200.webp",
]) {
  expect(html.includes(portrait), `missing responsive portrait source: ${portrait}`);
  expect(fs.existsSync(path.join(root, portrait)), `missing responsive portrait asset: ${portrait}`);
}

const referencedRasterAssets = new Set(
  [...html.matchAll(/(?:src|srcset)=["']([^"']+)["']/gi)]
    .flatMap(([, value]) => value.split(","))
    .map((candidate) => candidate.trim().split(/\s+/)[0])
    .filter((candidate) => /\.(?:png|jpe?g|webp)$/i.test(candidate)),
);
for (const asset of referencedRasterAssets) {
  const absolute = path.join(root, asset);
  if (!fs.existsSync(absolute)) continue;
  expect(fs.statSync(absolute).size <= 300 * 1024, `referenced image exceeds 300KB: ${asset}`);
}

const bookCards = [...html.matchAll(/<article class=["']book["']>([\s\S]*?)<\/article>/gi)].map(([, card]) => card);
expect(bookCards.length === 8, "reading shelf must contain exactly eight book cards");
for (const card of bookCards) {
  const image = card.match(/<img\b[^>]*>/i)?.[0];
  expect(Boolean(image), "every book card must use a real raster cover");
  if (!image) continue;
  const src = image.match(/src=["']([^"']+)/i)?.[1] ?? "unknown";
  const width = Number(image.match(/\bwidth=["'](\d+)["']/i)?.[1] ?? 0);
  expect(src.startsWith("assets/books/"), `book cover must be a local book asset: ${src}`);
  expect(width >= 200, `book cover is too small to render as artwork: ${src}`);
  expect(/class=["'][^"']*book__cover-fallback/.test(card), `book cover lacks a text fallback: ${src}`);
}

const assetManifest = [
  "assets/portrait/portrait-cutout.png",
  "assets/portrait/portrait-480.webp",
  "assets/portrait/portrait-800.webp",
  "assets/portrait/portrait-1200.webp",
  "assets/logos/logo-hnu.png",
  "assets/logos/logo-hnu.webp",
  "assets/logos/logo-cuhksz.png",
  "assets/logos/logo-cuhksz.webp",
  "assets/logos/logo-pku-institute.png",
  "assets/logos/logo-pku-institute.webp",
  "assets/logos/logo-bytedance.png",
  "assets/logos/logo-bytedance.webp",
  "assets/books/evolutionary-psychology.jpg",
  "assets/books/the-world-i-see.jpg",
  "assets/books/life-is-a-sea.jpg",
];

for (const asset of assetManifest) {
  expect(fs.existsSync(path.join(root, asset)), `missing manifest asset: ${asset}`);
}

for (const content of [
  "我在鄱阳湖边的一座小镇长大",
  "湖南大学",
  "香港中文大学（深圳）",
  "北京大学长沙计算与数字经济研究院",
  "字节跳动",
  "28 destinations",
  "144 本",
  "522 天",
  "2434 条笔记",
]) {
  expect(html.includes(content), `missing approved copy: ${content}`);
}

expect(/data-menu-toggle/.test(html), "missing mobile menu control");
expect(/<span>2022<\/span><i><\/i><span>2028<\/span>/.test(html), "education route years must run from 2022 to 2028");
expect(/data-copy=["']youngbayia1129["']/.test(html), "missing WeChat copy control");
expect(/id=["']travel-globe["']/.test(html), "missing interactive travel globe mount");
expect(/class=["'][^"']*globe-status/.test(html), "missing globe loading/fallback status");
expect(/cdn\.jsdelivr\.net\/npm\/globe\.gl@/.test(html), "missing pinned Globe.gl CDN dependency");
expect(!/class=["'][^"']*city-index/.test(html), "legacy travel city table still exists");
expect(!/class=["'][^"']*(?:map-scroll|travel-map)/.test(html), "legacy static travel map still exists");

for (const token of ["#F3F6FA", "#101318", "#246BFD", "#FF4D8D", "#D8E1EC"]) {
  expect(css.toUpperCase().includes(token), `missing color token ${token}`);
}
expect(/@media\s*\([^)]*max-width:\s*768px/.test(css), "missing tablet/mobile breakpoint");
expect(/:focus-visible/.test(css), "missing visible keyboard focus");
expect(/overflow-x:\s*(clip|hidden)/.test(css), "missing page overflow guard");
expect(/--content-max:\s*1180px/.test(css), "missing strict 1180px content width token");
expect(/--hero-title-max:\s*7\.2rem/.test(css), "missing controlled hero title scale");
expect(/--section-title-max:\s*5\.2rem/.test(css), "missing controlled section title scale");
expect(/--mobile-title-max:\s*3\.6rem/.test(css), "missing controlled mobile title scale");
expect(/--mobile-contact-title-max:\s*2\.7rem/.test(css), "missing controlled mobile contact title scale");
expect(/--mobile-book-columns:\s*2/.test(css), "missing explicit mobile bookshelf contract");
expect(!/\.education-card\s*\{[^}]*min-height:\s*520px/s.test(css), "education cards still force 520px height");
expect(!/@media\s*\([^)]*max-width:\s*768px[^}]*\}[\s\S]*?\.education-card[^}]*min-height:\s*470px/.test(css), "mobile education cards still force 470px height");
expect(/\.globe-stage\s*\{/.test(css), "missing globe stage styling");
expect(/\.book:hover\s+\.book__cover-frame\s+img\s*\{[^}]*grayscale\(0\)[^}]*saturate\((?:1|1\.[0-9]+)\)/s.test(css), "book hover does not restore cover color directly on the image");
expect(/class=["'][^"']*travel-atlas/.test(html), "missing dual-map travel atlas");
expect(html.includes("抵达中国具体的地方"), "missing approved China map heading");
expect(/id=["']china-map["']/.test(html), "missing China destination map mount");
expect(/cdn\.jsdelivr\.net\/npm\/d3@7\.9\.0/.test(html), "missing pinned D3 dependency");
expect(/\.hero__portrait-wrap\s+picture\s*\{[^}]*height:\s*100%[^}]*display:\s*grid/s.test(css), "portrait picture wrapper does not participate in the hero grid");
expect(/\.hero__portrait-wrap\s+picture\s*\{[^}]*position:\s*absolute[^}]*inset:\s*0/s.test(css), "portrait picture wrapper is not bounded to the hero frame");
expect(/class=["'][^"']*work-chapter__logo--invert/.test(html), "white PKU logo lacks an explicit contrast class");
expect(/\.work-chapter__logo--invert\s+img\s*\{[^}]*filter:\s*brightness\(0\)/s.test(css), "white PKU logo lacks a dark display filter");
expect(/\.work-chapter:hover\s+\.work-chapter__logo--invert\s+img\s*\{[^}]*brightness\(0\)/s.test(css), "PKU logo loses contrast on hover");

const js = read("script.js");
expect(/IntersectionObserver/.test(js), "missing section observer");
expect(/Escape/.test(js), "missing Escape menu handling");
expect(/navigator\.clipboard/.test(js), "missing clipboard enhancement");
expect(/const\s+VISITED_COUNTRIES\s*=/.test(js), "missing visited-country data");
expect(/const\s+CHINA_DESTINATIONS\s*=/.test(js), "missing China destination data");
expect((js.match(/country:\s*["']/g) ?? []).length === 2, "world globe must contain exactly two visited countries");
expect((js.match(/region:\s*["']/g) ?? []).length === 27, "China map must contain exactly 27 destinations");
expect(/initTravelGlobe/.test(js), "missing globe initializer");
expect(/htmlElementsData\(VISITED_COUNTRIES\)/.test(js), "country labels must use browser HTML for CJK glyph support");
expect(!/\.labelsData\(VISITED_COUNTRIES\)/.test(js), "country labels still use the WebGL font layer without CJK glyphs");
expect(/initChinaMap/.test(js), "missing China map initializer");
expect(/rewindGeoJson/.test(js), "China GeoJSON rings are not normalized for D3 spherical winding");
expect(/prefers-reduced-motion:\s*reduce/.test(js), "globe does not respect reduced motion");

for (const [name, pattern] of [
  ["description", /<meta[^>]+name=["']description["']/i],
  ["og:title", /<meta[^>]+property=["']og:title["']/i],
  ["og:description", /<meta[^>]+property=["']og:description["']/i],
  ["favicon", /<link[^>]+rel=["']icon["']/i],
]) {
  expect(pattern.test(html), `missing metadata: ${name}`);
}
expect(fs.existsSync(path.join(root, "assets/icons/favicon.svg")), "missing favicon asset");

if (failures.length) {
  console.error(failures.map((item) => `FAIL: ${item}`).join("\n"));
  process.exit(1);
}

console.log("PASS: site structure and assets are valid");
