/* eslint-disable no-console */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const EDGE =
  process.env.EDGE_PATH ||
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

const URL = process.env.SHOT_URL || "http://localhost:5173";
const OUT = process.env.SHOT_OUT || "C:\\Users\\aliya\\AppData\\Local\\Temp\\portfolio-shots";

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "shell",
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

const page = await browser.newPage();
const errors = [];
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`[console] ${msg.text()}`);
});
page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`));
page.on("requestfailed", (req) =>
  errors.push(`[requestfailed] ${req.url()} — ${req.failure()?.errorText}`)
);

async function scrollThrough() {
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.6);
    const max = document.body.scrollHeight;
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 220));
    }
    window.scrollTo(0, max);
    await new Promise((r) => setTimeout(r, 600));
  });
}

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "mobile", width: 390, height: 844 },
];

for (const vp of viewports) {
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 4500));
  await page.screenshot({ path: `${OUT}/${vp.name}-top.png` });

  await scrollThrough();
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: `${OUT}/${vp.name}-full.png`, fullPage: true });

  // section shots (desktop only)
  if (vp.name === "desktop") {
    for (const id of ["case-studies", "about", "contact"]) {
      await page.evaluate((sel) => {
        document.querySelector(sel)?.scrollIntoView({ block: "start" });
      }, `#${id}`);
      await new Promise((r) => setTimeout(r, 900));
      await page.screenshot({ path: `${OUT}/section-${id}.png` });
    }
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((r) => setTimeout(r, 900));
    await page.screenshot({ path: `${OUT}/section-footer.png` });
  }
}

console.log("ERRORS:", errors.length ? "\n" + errors.join("\n") : "none");
await browser.close();
