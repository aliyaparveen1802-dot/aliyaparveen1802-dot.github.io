/* eslint-disable no-console */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const EDGE =
  process.env.EDGE_PATH ||
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = process.env.SHOT_URL || "http://localhost:5174";
const OUT =
  process.env.VERIFY_OUT ||
  "C:\\Users\\aliya\\AppData\\Local\\Temp\\opencode\\portfolio-verify";

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

const flush = (page) =>
  page.evaluate(
    () =>
      new Promise((r) => {
        let n = 0;
        const step = () => (++n > 6 ? r() : requestAnimationFrame(step));
        requestAnimationFrame(step);
      })
  );

async function shot(url, viewport, selector, name, preWait = 0) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.waitForSelector(selector, { timeout: 15000 });
  if (preWait) await new Promise((r) => setTimeout(r, preWait));
  await page.evaluate((s) => document.querySelector(s).scrollIntoView(), selector);
  await flush(page);
  if (preWait) await new Promise((r) => setTimeout(r, 400));
  await flush(page);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`${errors.length ? "ERRORS" : "ok"}  ${name}${errors.length ? " — " + errors.join(" | ") : ""}`);
  await page.close();
}

const D = { width: 1440, height: 900 };
const M = { width: 390, height: 844 };
const CASE = `${BASE}/projects/skyvoyage/ux-case-study`;

await shot(BASE, D, "#project", "qa-home-project-desktop-01");
await shot(CASE, D, "#solution", "qa-case-solution-desktop-01");
await shot(CASE, D, "#mapping", "qa-case-mapping-desktop-01");
await shot(CASE, D, "#ia", "qa-case-ia-desktop-01");
await shot(CASE, D, "#flows", "qa-case-flows-desktop-01");
await shot(CASE, D, "#final", "qa-case-final-desktop-01");
await shot(CASE, M, "#journey", "qa-case-journey-mobile-02");
await shot(BASE, M, "#project", "qa-home-project-mobile-02");

await browser.close();
console.log(`Screenshots: ${OUT}`);
