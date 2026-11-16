/* eslint-disable no-console */
import puppeteer from "puppeteer-core";

const EDGE =
  process.env.EDGE_PATH ||
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const URL = "http://localhost:5173";
const OUT = "C:\\Users\\aliya\\AppData\\Local\\Temp\\portfolio-shots";

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "shell",
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

const errors = [];
const page = await browser.newPage();
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(e.message));

// --- Desktop 1440 ---
await page.setViewport({ width: 1440, height: 900 });
await page.goto(URL, { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 4500));

// horizontal overflow check
const overflow = await page.evaluate(() => ({
  scrollW: document.documentElement.scrollWidth,
  clientW: document.documentElement.clientWidth,
}));
console.log("overflow desktop:", JSON.stringify(overflow));

// nav anchor: click Case Studies
await page.click('a[href="#case-studies"]');
await new Promise((r) => setTimeout(r, 1800));
const afterNav = await page.evaluate(() => ({
  y: Math.round(window.scrollY),
  top: Math.round(document.querySelector("#case-studies").getBoundingClientRect().top),
}));
console.log("nav case-studies:", JSON.stringify(afterNav));
await page.screenshot({ path: `${OUT}/nav-click-cases.png` });

// theme toggle
await page.click('button[aria-label*="light mode"]');
await new Promise((r) => setTimeout(r, 700));
const theme = await page.evaluate(() => document.documentElement.dataset.theme);
console.log("theme after toggle:", theme);
await page.evaluate(() => window.scrollTo(0, 0));
await new Promise((r) => setTimeout(r, 900));
await page.screenshot({ path: `${OUT}/light-hero.png` });
await page.evaluate(() => document.querySelector("#case-studies").scrollIntoView());
await new Promise((r) => setTimeout(r, 1200));
await page.screenshot({ path: `${OUT}/light-cases.png` });
// toggle back
await page.click('button[aria-label*="dark mode"]');
await new Promise((r) => setTimeout(r, 500));

// project card hover
await page.evaluate(() => document.querySelector("#case-studies").scrollIntoView());
await new Promise((r) => setTimeout(r, 1000));
const card = await page.$(".project-card a");
if (card) {
  await card.hover();
  await new Promise((r) => setTimeout(r, 700));
  await page.screenshot({ path: `${OUT}/hover-card.png` });
}

// links integrity
const links = await page.evaluate(() =>
  Array.from(document.querySelectorAll("a[href]")).map((a) => a.getAttribute("href"))
);
const badLinks = links.filter((h) => !h || h === "#" || h.startsWith("javascript"));
console.log("total links:", links.length, "bad:", JSON.stringify(badLinks));

// --- Mobile 390 ---
await page.setViewport({ width: 390, height: 844 });
await page.goto(URL, { waitUntil: "networkidle2" });
await new Promise((r) => setTimeout(r, 4500));
const overflowM = await page.evaluate(() => ({
  scrollW: document.documentElement.scrollWidth,
  clientW: document.documentElement.clientWidth,
}));
console.log("overflow mobile:", JSON.stringify(overflowM));

// open mobile menu
await page.waitForFunction(
  () => !document.querySelector(".preloader-text"),
  { timeout: 10000 }
).catch(() => {});
await new Promise((r) => setTimeout(r, 800));
await page.evaluate(() => {
  document.querySelector('button[aria-label="Open menu"]')?.click();
});
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: `${OUT}/mobile-menu.png` });

// click About in menu
const menuOpen = await page.evaluate(() =>
  Boolean(document.querySelector('a[href="#about"]'))
);
console.log("mobile menu open:", menuOpen);
if (menuOpen) {
  await page.evaluate(() => {
    document.querySelector('a[href="#about"]')?.click();
  });
  await new Promise((r) => setTimeout(r, 1800));
  const m = await page.evaluate(() => ({
    y: Math.round(window.scrollY),
    top: Math.round(document.querySelector("#about").getBoundingClientRect().top),
  }));
  console.log("mobile nav about:", JSON.stringify(m));
  await page.screenshot({ path: `${OUT}/mobile-about.png` });
}

// image load check
const imgs = await page.evaluate(() =>
  Array.from(document.images).map((i) => ({
    src: i.currentSrc || i.src,
    ok: i.complete && i.naturalWidth > 0,
  }))
);
const broken = imgs.filter((i) => !i.ok);
console.log("images:", imgs.length, "broken:", broken.length, JSON.stringify(broken, null, 1));

console.log("ERRORS:", errors.length ? errors.join("\n") : "none");
await browser.close();
