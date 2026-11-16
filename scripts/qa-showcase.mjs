/* eslint-disable no-console */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const EDGE =
  process.env.EDGE_PATH ||
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = process.env.SHOT_URL || "http://localhost:5173";
const CASE = "/projects/skyvoyage/ux-case-study";
const OUT =
  process.env.QA_OUT ||
  "C:\\Users\\aliya\\AppData\\Local\\Temp\\opencode\\showcase-qa";

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

const errors = [];
const results = [];
const check = (name, cond, detail = "") => {
  results.push(!!cond);
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
};

function track(page) {
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`[console] ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));
  page.on("requestfailed", (r) => {
    const u = r.url();
    if (!u.includes("favicon")) {
      errors.push(`[requestfailed] ${u} — ${r.failure()?.errorText}`);
    }
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const flush = (page) =>
  page.evaluate(
    () =>
      new Promise((r) => {
        let n = 0;
        const step = () => (++n > 6 ? r() : requestAnimationFrame(step));
        requestAnimationFrame(step);
      })
  );

async function openCase(page) {
  await page.goto(BASE + CASE, { waitUntil: "networkidle2" });
  await page.waitForSelector("#showcase", { timeout: 15000 });
  await sleep(4400);
}

const stageSrc = (page) =>
  page.$eval("#showcase .cs-swap img", (el) => el.getAttribute("src"));

const selectedThumb = (page) =>
  page.$$eval('#showcase [role="tab"]', (tabs) =>
    tabs.findIndex((t) => t.getAttribute("aria-selected") === "true")
  );

// ---------- 1. Desktop: structure, order, labels ----------
{
  const page = await browser.newPage();
  track(page);
  await page.setViewport({ width: 1440, height: 900 });
  await openCase(page);

  const order = await page.evaluate(() => {
    const f = (s) => {
      const el = document.querySelector(s);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return r.top + scrollY;
    };
    return { solution: f("#solution"), showcase: f("#showcase"), personas: f("#personas") };
  });
  check(
    "desktop: SHOWCASE sits between SOLUTION and PERSONAS",
    order.solution < order.showcase && order.showcase < order.personas,
    JSON.stringify(order)
  );

  const label = await page.$eval("#showcase p", (el) => el.textContent.trim());
  check(
    "desktop: label Section 04 — Interface Showcase",
    label.includes("Section 04") && label.includes("Interface Showcase"),
    label
  );

  const renumber = await page.evaluate(() => ({
    personas: document.querySelector("#personas p")?.textContent || "",
    final: document.querySelector("#final p")?.textContent || "",
  }));
  check("labels renumbered: personas = 05", renumber.personas.includes("Section 05"), renumber.personas);
  check("labels renumbered: final = 11", renumber.final.includes("Section 11"), renumber.final);

  const head = await page.$eval("#showcase h2", (el) => el.textContent.trim());
  check("desktop: heading copy", head === "Every screen, exactly as it ships.", head);

  const tabs = await page.$$eval('#showcase [role="tab"]', (els) => els.length);
  check("desktop: 8 screen thumbnails", tabs === 8, `count=${tabs}`);

  check("desktop: stage starts on onboarding", (await stageSrc(page)).includes("sv-onboarding"), await stageSrc(page));

  // ---------- 2. Interactive switching ----------
  await page.$$eval('#showcase [role="tab"]', (els) => els[3].click());
  await sleep(750);
  check("desktop: thumb 4 → results screen", (await stageSrc(page)).includes("sv-results"), await stageSrc(page));
  check("desktop: aria-selected follows click", (await selectedThumb(page)) === 3, `idx=${await selectedThumb(page)}`);

  const aside = await page.$eval("#showcase aside", (el) => ({
    title: el.querySelector("h3")?.textContent || "",
    counter: el.textContent.match(/\d\d \/ \d\d/)?.[0] || "",
  }));
  check("desktop: info panel title", aside.title === "Results & fare comparison", aside.title);
  check("desktop: counter 04 / 08", aside.counter === "04 / 08", aside.counter);

  const anim = await page.$eval("#showcase .cs-swap", (el) => getComputedStyle(el).animationName);
  check("desktop: swap runs cs-swap-in animation", anim === "cs-swap-in", anim);

  const imgOk = await page.$eval("#showcase .cs-swap img", (el) => el.complete && el.naturalWidth > 0);
  check("desktop: switched screen image fully loaded", imgOk);

  await page.click('#showcase aside button[aria-label="Next screen"]');
  await sleep(750);
  check("desktop: next → guide", (await stageSrc(page)).includes("sv-guide"), await stageSrc(page));

  await page.click('#showcase aside button[aria-label="Previous screen"]');
  await page.click('#showcase aside button[aria-label="Previous screen"]');
  await page.click('#showcase aside button[aria-label="Previous screen"]');
  await sleep(750);
  check("desktop: prev ×3 → dashboard", (await stageSrc(page)).includes("sv-dashboard"), await stageSrc(page));

  await page.$$eval('#showcase [role="tab"]', (els) => els[0].click());
  await sleep(400);
  await page.click('#showcase aside button[aria-label="Previous screen"]');
  await sleep(750);
  check("desktop: prev wraps to last screen (trip)", (await stageSrc(page)).includes("sv-trips"), await stageSrc(page));

  // ---------- 3. Phone frames ----------
  const phones = await page.$$eval("#showcase figure.group img", (els) =>
    els.map((e) => e.getAttribute("src"))
  );
  const expectPhones = ["sv-home-mobile", "sv-guide-mobile", "sv-map-mobile", "sv-tracking-mobile"];
  const phonesOk = expectPhones.every((n, i) => (phones[i] || "").includes(n));
  check("desktop: 4 phone-frame screens", phones.length === 4 && phonesOk, JSON.stringify(phones));

  const chrome = await page.$eval("#showcase figure.group", (el) => ({
    time: el.textContent.includes("9:41"),
    island: !!el.querySelector('span[aria-hidden="true"].rounded-full.bg-black'),
    home: !!el.querySelector('span.bg-white\\/60') || !!el.querySelector("div.flex.justify-center span"),
  }));
  check("desktop: phone status bar + island + home indicator", chrome.time && chrome.island && chrome.home, JSON.stringify(chrome));

  const offsets = await page.$$eval("#showcase figure.group", (els) =>
    els.map((e) => Math.round(e.getBoundingClientRect().top + scrollY))
  );
  check(
    "desktop: phone row staggered (alternating offsets)",
    Math.abs(offsets[1] - offsets[0]) > 30 && Math.abs(offsets[0] - offsets[2]) < 5,
    JSON.stringify(offsets)
  );

  // hover lift on phone
  await page.$eval("#showcase figure.group", (el) =>
    el.scrollIntoView({ block: "center" })
  );
  await sleep(1200);
  const fig = await page.$("#showcase figure.group");
  const box = await fig.boundingBox();
  const shellY = () =>
    page.$eval("#showcase figure.group > div", (el) => Math.round(el.getBoundingClientRect().top));
  const before = await shellY();
  await page.mouse.move(box.x + box.width / 2, box.y + 60);
  await sleep(700);
  const after = await shellY();
  check("desktop: phone hover lifts frame", after < before - 4, `y ${before} → ${after}`);

  // design tokens
  const tokens = await page.$$eval("#showcase .md\\:grid-cols-4 > div", (els) =>
    els.map((e) => ({
      label: e.querySelector("span span")?.textContent || "",
      bg: e.querySelector("span[style]")?.getAttribute("style") || "",
    }))
  );
  check("desktop: 4 design-system tokens", tokens.length === 4, `count=${tokens.length}`);
  check(
    "desktop: accent token #E6FF19",
    tokens.some((t) => t.bg.includes("230, 255, 25") || t.bg.includes("#E6FF19")),
    JSON.stringify(tokens[0] || {})
  );

  // ---------- 4. Reveal complete + overflow ----------
  await page.evaluate(() => document.querySelector("#showcase").scrollIntoView({ block: "start" }));
  await sleep(1400);
  const revealOp = await page.$eval("#showcase .cs-swap", (el) =>
    getComputedStyle(el.parentElement).opacity
  );
  check("desktop: entrance reveal completed (opacity 1)", parseFloat(revealOp) === 1, revealOp);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check("desktop: no horizontal overflow", overflow <= 0, `${overflow}px`);

  await page.evaluate(() => document.querySelector("#showcase").scrollIntoView({ block: "start" }));
  await flush(page);
  await page.screenshot({ path: `${OUT}/showcase-desktop.png` });
  await page.click('#showcase [role="tab"]:nth-child(6)');
  await sleep(800);
  await page.screenshot({ path: `${OUT}/showcase-desktop-switched.png` });
  await page.evaluate(() =>
    document.querySelector("#showcase figure.group").scrollIntoView({ block: "center" })
  );
  await sleep(1200);
  await page.screenshot({ path: `${OUT}/showcase-phones.png` });
  await page.close();
}

// ---------- 5. Mobile ----------
{
  const page = await browser.newPage();
  track(page);
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await openCase(page);

  const strip = await page.$eval("#showcase [role='tablist']", (el) => ({
    scrollable: el.scrollWidth > el.clientWidth,
    count: el.children.length,
  }));
  check("mobile: thumb strip scrollable with 8 tabs", strip.scrollable && strip.count === 8, JSON.stringify(strip));

  const tops = await page.$$eval("#showcase figure.group", (els) =>
    els.map((e) => Math.round(e.getBoundingClientRect().top))
  );
  check(
    "mobile: phone grid stacks 2×2",
    tops.length === 4 && tops[0] === tops[1] && tops[2] === tops[3] && tops[2] > tops[0],
    JSON.stringify(tops)
  );

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check("mobile: no horizontal overflow", overflow <= 0, `${overflow}px`);

  await page.evaluate(() => document.querySelector("#showcase").scrollIntoView({ block: "start" }));
  await sleep(1300);
  await page.screenshot({ path: `${OUT}/showcase-mobile.png` });
  await page.close();
}

// ---------- 6. Reduced motion ----------
{
  const page = await browser.newPage();
  track(page);
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await openCase(page);

  const visible = await page.$eval("#showcase .cs-swap", (el) =>
    getComputedStyle(el.parentElement).opacity
  );
  check("reduced: content fully visible", parseFloat(visible) === 1, visible);

  await page.$$eval('#showcase [role="tab"]', (els) => els[6].click());
  await sleep(300);
  check("reduced: screen switching still works", (await stageSrc(page)).includes("sv-tracking"), await stageSrc(page));

  const floatAnim = await page.$eval("#showcase figure.group > div", (el) => {
    const d = getComputedStyle(el).animationDuration;
    return d.endsWith("ms") ? parseFloat(d) : parseFloat(d) * 1000;
  });
  check("reduced: float animation neutralized", floatAnim <= 1, `${floatAnim}ms`);

  await page.close();
}

// ---------- 7. Light theme ----------
{
  const page = await browser.newPage();
  track(page);
  await page.setViewport({ width: 1440, height: 900 });
  await openCase(page);
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  await sleep(750);
  const theme = await page.evaluate(() => ({
    head: getComputedStyle(document.querySelector("#showcase h2")).color,
    chip: getComputedStyle(document.querySelector("#showcase aside")).backgroundColor,
  }));
  check(
    "light theme: section uses light palette",
    theme.head === "rgb(194, 65, 12)" && theme.chip === "rgb(255, 255, 255)",
    JSON.stringify(theme)
  );
  await page.screenshot({ path: `${OUT}/showcase-light.png` });
  await page.close();
}

await browser.close();

const passed = results.filter(Boolean).length;
console.log(`\n${passed}/${results.length} checks passed`);
if (errors.length) {
  console.log("\nConsole/page/request errors:");
  for (const e of errors) console.log("  " + e);
}
console.log(`Screenshots: ${OUT}`);
process.exit(errors.length || passed !== results.length ? 1 : 0);
