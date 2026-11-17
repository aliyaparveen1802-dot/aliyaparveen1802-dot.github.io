/* eslint-disable no-console */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const EDGE =
  process.env.EDGE_PATH ||
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = process.env.SHOT_URL || "http://localhost:5173";
const OUT =
  process.env.QA_OUT ||
  "C:\\Users\\aliya\\AppData\\Local\\Temp\\opencode\\gallery-qa";

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

// ---------- 1. Desktop 1440 (motion on): structure, animation, links, hover ----------
{
  const page = await browser.newPage();
  track(page);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await page.waitForSelector("#case-studies", { timeout: 15000 });
  await sleep(4300); // preloader

  // Before scrolling: gallery offscreen → marquee paused (performance)
  const pausedAtLoad = await page.$eval(
    ".gal-track",
    (el) => getComputedStyle(el).animationPlayState
  );
  check("perf: marquee paused while offscreen", pausedAtLoad === "paused", pausedAtLoad);

  const head = await page.evaluate(() => {
    const h2 = document.querySelector("#case-studies h2");
    const sub = document.querySelector("#case-studies .gal-sub");
    const eyebrow = document.querySelector("#case-studies .gal-eyebrow");
    return {
      heading: h2 ? h2.textContent.replace(/\s+/g, " ").trim() : "",
      sub: sub ? sub.textContent.replace(/\s+/g, " ").trim() : "",
      eyebrow: eyebrow ? eyebrow.textContent.replace(/\s+/g, " ").trim() : "",
      align: h2 ? getComputedStyle(h2.parentElement).textAlign : "",
    };
  });
  check(
    "heading EXPLORE WHAT I’VE BUILT. centered",
    head.heading.toUpperCase() === "EXPLORE WHAT I’VE BUILT." && head.align === "center",
    `${head.heading} [${head.align}]`
  );
  check(
    "subtitle copy exact",
    head.sub.startsWith("A curated collection of my design projects, digital experiences and creative solutions") &&
      head.sub.endsWith("brought to life."),
    head.sub.slice(0, 50) + "…"
  );
  check("eyebrow reference element", head.eyebrow.includes("01 — 09"), head.eyebrow);

  // Heading should sit on a single line at desktop widths (reference composition)
  const headBox = await page.$eval("#case-studies h2", (el) => {
    const r = el.getBoundingClientRect();
    return { h: Math.round(r.height), fs: Math.round(parseFloat(getComputedStyle(el).fontSize)) };
  });
  check(
    "desktop: heading renders on one line",
    headBox.h < headBox.fs * 1.4,
    `height=${headBox.h}px fontSize=${headBox.fs}px`
  );

  // Old section removed
  const oldGone = await page.evaluate(
    () =>
      document.querySelector(".project-grid") === null &&
      document.querySelector(".project-card") === null
  );
  check("old Case Studies grid removed", oldGone);

  await page.evaluate(() =>
    document.querySelector("#case-studies").scrollIntoView({ block: "start" })
  );
  await sleep(3400); // entrance timeline + margin
  await flush(page);

  const state = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll(".gal-row"));
    return {
      rowCount: rows.length,
      tracks: rows.map((r) => {
        const t = r.querySelector(".gal-track");
        const kids = t.children;
        const n = kids.length / 2;
        return {
          cards: kids.length,
          name: getComputedStyle(t).animationName,
          state: getComputedStyle(t).animationPlayState,
          seam: kids[n].offsetLeft - kids[0].offsetLeft,
          half: t.scrollWidth / 2,
        };
      }),
      heading: parseFloat(getComputedStyle(document.querySelector(".gal-heading")).opacity),
      sub: parseFloat(getComputedStyle(document.querySelector(".gal-sub")).opacity),
      rowOp: Array.from(document.querySelectorAll(".gal-row")).map((r) =>
        parseFloat(getComputedStyle(r).opacity)
      ),
    };
  });
  check(
    "two rows × 14 cards (7 unique doubled)",
    state.rowCount === 2 && state.tracks.every((t) => t.cards === 14),
    JSON.stringify(state.tracks.map((t) => t.cards))
  );
  check(
    "row 1 animates right→left, row 2 left→right",
    state.tracks[0].name.includes("gal-marquee") &&
      !state.tracks[0].name.includes("reverse") &&
      state.tracks[1].name.includes("gal-marquee-reverse"),
    `${state.tracks[0].name} | ${state.tracks[1].name}`
  );
  check(
    "seamless loop: duplicated copy offset equals half track",
    state.tracks.every((t) => Math.abs(t.seam - t.half) <= 1),
    JSON.stringify(state.tracks.map((t) => ({ seam: t.seam, half: Math.round(t.half) })))
  );
  check(
    "animations: header + rows entrance complete",
    state.heading > 0.95 && state.sub > 0.95 && state.rowOp.every((o) => o > 0.95),
    JSON.stringify({ h: state.heading, s: state.sub, r: state.rowOp })
  );
  check(
    "marquee running while section visible",
    state.tracks.every((t) => t.state === "running"),
    JSON.stringify(state.tracks.map((t) => t.state))
  );

  // Opposite scroll directions (sample track positions over time)
  const l1 = await page.$eval(".gal-track", (el) => el.getBoundingClientRect().left);
  const l2 = await page.$$eval(".gal-track", (els) => els[1].getBoundingClientRect().left);
  await sleep(900);
  const m1 = await page.$eval(".gal-track", (el) => el.getBoundingClientRect().left);
  const m2 = await page.$$eval(".gal-track", (els) => els[1].getBoundingClientRect().left);
  const d1 = m1 - l1;
  const d2 = m2 - l2;
  check(
    "continuous motion in opposite directions",
    d1 < -15 && d2 > 15,
    `row1 Δ=${d1.toFixed(1)}px, row2 Δ=${+d2.toFixed(1)}px`
  );

  // Links
  const links = await page.$$eval("#case-studies .gal-card", (els) =>
    els.map((a) => ({
      href: a.getAttribute("href"),
      target: a.getAttribute("target"),
      label: a.getAttribute("aria-label"),
    }))
  );
  const internal = links.filter((l) => l.href?.includes("/projects/skyvoyage/ux-case-study"));
  const external = links.filter((l) => l.href?.startsWith("https://www.behance.net"));
  check(
    "every card is a real link (28 total)",
    links.length === 28 && links.every((l) => l.href && l.href.length > 3),
    `total=${links.length}`
  );
  check(
    "SkyVoyage cards prominent + internal (12, no _blank)",
    internal.length === 12 && internal.every((l) => l.target === null),
    `internal=${internal.length}`
  );
  check(
    "project cards open Behance externally (16, _blank)",
    external.length === 16 && external.every((l) => l.target === "_blank"),
    `external=${external.length}`
  );
  const firstCard = await page.$eval(
    ".gal-track .gal-card",
    (a) => a.getAttribute("href") + " | " + a.getAttribute("aria-label")
  );
  check(
    "first card is SkyVoyage (prominent lead)",
    firstCard.includes("/projects/skyvoyage/ux-case-study") && firstCard.includes("SkyVoyage"),
    firstCard
  );

  // Hover
  const card = await page.$(".gal-row .gal-card");
  const before = await card.evaluate((a) => {
    const img = a.querySelector("img");
    const arrow = a.querySelector("svg");
    return {
      scale: getComputedStyle(img).scale,
      arrow: getComputedStyle(arrow).translate,
      border: getComputedStyle(a).borderColor,
    };
  });
  await card.hover();
  await sleep(700);
  const after = await card.evaluate((a) => {
    const img = a.querySelector("img");
    const arrow = a.querySelector("svg");
    return {
      scale: getComputedStyle(img).scale,
      arrow: getComputedStyle(arrow).translate,
      border: getComputedStyle(a).borderColor,
    };
  });
  check(
    "hover: image zoom + arrow motion + border shift",
    after.scale !== before.scale && after.arrow !== before.arrow && after.border !== before.border,
    JSON.stringify({ before, after })
  );

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check("desktop: no horizontal overflow", overflow <= 1, `overflow=${overflow}px`);

  await page.evaluate(() =>
    document.querySelector("#case-studies").scrollIntoView({ block: "start" })
  );
  await sleep(900);
  await flush(page);
  const el = await page.$("#case-studies");
  await el.screenshot({ path: `${OUT}/gallery-desktop.png` });

  // Pause again when scrolled far away
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(700);
  const pausedAgain = await page.$eval(
    ".gal-track",
    (el2) => getComputedStyle(el2).animationPlayState
  );
  check("perf: marquee re-pauses when offscreen", pausedAgain === "paused", pausedAgain);
  await page.close();
}

// ---------- 2. Mobile 390 (reduced motion): layout + visibility ----------
{
  const page = await browser.newPage();
  track(page);
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await page.waitForSelector("#case-studies", { timeout: 15000 });
  await flush(page);

  const state = await page.evaluate(() => {
    const tracks = Array.from(document.querySelectorAll(".gal-track"));
    return {
      rows: document.querySelectorAll(".gal-row").length,
      cards: tracks[0]?.children.length ?? 0,
      anim: tracks.map((t) => getComputedStyle(t).animationName),
      heading: parseFloat(getComputedStyle(document.querySelector(".gal-heading")).opacity),
      transform: tracks.map((t) => getComputedStyle(t).transform),
      cardW: Math.round(document.querySelector(".gal-card").getBoundingClientRect().width),
    };
  });
  check(
    "reduced motion: marquee disabled, content visible",
    state.anim.every((a) => a === "none") && state.heading === 1,
    JSON.stringify(state)
  );
  check(
    "mobile: two rows of cards render",
    state.rows === 2 && state.cards === 14,
    `rows=${state.rows} cards=${state.cards}`
  );
  check(
    "mobile: card width sane (240–360px)",
    state.cardW >= 240 && state.cardW <= 360,
    `w=${state.cardW}px`
  );

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check("mobile: no horizontal overflow", overflow <= 1, `overflow=${overflow}px`);

  await page.evaluate(() =>
    document.querySelector("#case-studies").scrollIntoView({ block: "start" })
  );
  await flush(page);
  const el = await page.$("#case-studies");
  await el.screenshot({ path: `${OUT}/gallery-mobile.png` });
  await page.close();
}

// ---------- 3. Light theme (reduced): palette adapts ----------
{
  const page = await browser.newPage();
  track(page);
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await page.waitForSelector("#case-studies", { timeout: 15000 });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  await sleep(700);
  await page.evaluate(() =>
    document.querySelector("#case-studies").scrollIntoView({ block: "start" })
  );
  await sleep(500);
  await flush(page);

  const colors = await page.evaluate(() => {
    const sec = document.querySelector("#case-studies");
    const h2 = sec.querySelector("h2");
    return {
      bg: getComputedStyle(document.body).backgroundColor,
      heading: getComputedStyle(h2).color,
    };
  });
  check(
    "light theme: gallery uses portfolio palette",
    colors.bg === "rgb(245, 248, 253)" && colors.heading === "rgb(6, 6, 8)",
    JSON.stringify(colors)
  );
  const el = await page.$("#case-studies");
  await el.screenshot({ path: `${OUT}/gallery-light.png` });
  await page.close();
}

await browser.close();

const failed = results.filter((r) => !r).length;
console.log(`\n${results.length - failed}/${results.length} checks passed`);
if (errors.length) {
  console.log("\nConsole/page errors:");
  for (const e of errors) console.log("  " + e);
} else {
  console.log("No console/page/request errors.");
}
console.log(`Screenshots: ${OUT}`);
process.exit(failed || errors.length ? 1 : 0);
