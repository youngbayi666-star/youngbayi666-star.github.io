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
expect(/data-copy=["']youngbayia1129["']/.test(html), "missing WeChat copy control");
expect(/<svg[^>]+aria-labelledby=/s.test(html), "travel map lacks accessible name");

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
expect(/--mobile-book-columns:\s*2/.test(css), "missing explicit mobile bookshelf contract");
expect(!/\.education-card\s*\{[^}]*min-height:\s*520px/s.test(css), "education cards still force 520px height");
expect(!/@media\s*\([^)]*max-width:\s*768px[^}]*\}[\s\S]*?\.education-card[^}]*min-height:\s*470px/.test(css), "mobile education cards still force 470px height");
expect(/\.travel-map\s*\{[^}]*min-width:\s*760px/s.test(css), "travel map lacks controlled mobile canvas width");
expect(/\.hero__portrait-wrap\s+picture\s*\{[^}]*height:\s*100%[^}]*display:\s*grid/s.test(css), "portrait picture wrapper does not participate in the hero grid");

const js = read("script.js");
expect(/IntersectionObserver/.test(js), "missing section observer");
expect(/Escape/.test(js), "missing Escape menu handling");
expect(/navigator\.clipboard/.test(js), "missing clipboard enhancement");
expect(/querySelectorAll\(["']\[data-map-node\]["']\)/.test(js), "missing map focus enhancement");
expect((html.match(/data-map-node/g) ?? []).length === 28, "travel map must contain 28 nodes");

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
