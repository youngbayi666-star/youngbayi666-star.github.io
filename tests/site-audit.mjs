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

if (failures.length) {
  console.error(failures.map((item) => `FAIL: ${item}`).join("\n"));
  process.exit(1);
}

console.log("PASS: site structure and assets are valid");
