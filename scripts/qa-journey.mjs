/* eslint-disable no-console */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const EDGE =
  process.env.EDGE_PATH ||
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = process.env.SHOT_URL || "http://localhost:5173";
const OUT =
  process.env.QA_OUT ||
  "C:\\Users\\aliya\\AppData\\Local\\Temp\\opencode\\journey-qa";

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

const rectFn = `
  (s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { top: r.top + scrollY, bottom: r.bottom + scrollY, left: r.left, width: r.width };
  }
`;

// ---------- 1. Desktop 1440 (motion on): layout, entrance, continuous, hover ----------
{
  const page = await browser.newPage();
  track(page);
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await page.waitForSelector("#design-journey", { timeout: 15000 });
  await sleep(4300); // preloader

  const order = await page.evaluate((rf) => {
    const f = eval(rf);
    return {
      project: f("#project"),
      journey: f("#design-journey"),
      cases: f("#case-studies"),
    };
  }, rectFn);
  check(
    "desktop: JOURNEY sits directly below PROJECT",
    Math.abs(order.journey.top - order.project.bottom) < 3,
    `gap=${Math.round(order.journey.top - order.project.bottom)}px`
  );
  check(
    "desktop: JOURNEY directly above Case Studies",
    Math.abs(order.cases.top - order.journey.bottom) < 3,
    `gap=${Math.round(order.cases.top - order.journey.bottom)}px`
  );

  await page.evaluate(() =>
    document.querySelector("#design-journey").scrollIntoView({ block: "start" })
  );
  await sleep(3600); // entrance timeline (~2.9s) + margin
  await flush(page);

  const h2 = await page.$eval(
    "#design-journey h2",
    (el) => el.textContent.replace(/\s+/g, " ").trim()
  );
  check("desktop: heading MY DESIGN JOURNEY.", /MY DESIGN JOURNEY\./i.test(h2), h2);

  const lede = await page.$eval(
    "#design-journey h2 + p",
    (el) => el.textContent.replace(/\s+/g, " ").trim()
  );
  check(
    "desktop: supporting paragraph copy",
    lede.startsWith("Every meaningful digital experience begins with understanding people") &&
      lede.endsWith("intuitive solutions."),
    lede.slice(0, 48) + "…"
  );

  const stages = await page.$$eval(".journey-stage", (els) =>
    els.map((s) => {
      const r = s.getBoundingClientRect();
      return {
        title: s.querySelector(".jd-title").textContent.trim(),
        num: s.querySelector(".jd-num").textContent.trim(),
        x: Math.round(r.left),
        y: Math.round(r.top),
        w: Math.round(r.width),
      };
    })
  );
  check("desktop: four stages present", stages.length === 4, `count=${stages.length}`);
  check(
    "desktop: stages side by side (equal top, increasing x)",
    new Set(stages.map((s) => s.y)).size === 1 &&
      stages.every((s, i) => i === 0 || s.x > stages[i - 1].x),
    stages.map((s) => `${s.title}@${s.x}`).join(" ")
  );
  check(
    "desktop: stage titles + outlined numbers",
    stages.map((s) => s.title).join(",") === "DISCOVER,DEFINE,DESIGN,DELIVER" &&
      stages.map((s) => s.num).join(",") === "01,02,03,04"
  );

  const op = await page.evaluate(() => {
    const g = (s) => {
      const el = document.querySelector(s);
      return el ? parseFloat(getComputedStyle(el).opacity) : -1;
    };
    return {
      heading: g(".jd-heading"),
      lede: g(".jd-lede"),
      num: g(".jd-num"),
      icon: g(".jd-icon"),
      title: g(".jd-title"),
      desc: g(".jd-desc"),
      items: g(".jd-items"),
      travels: g(".jd-travels"),
    };
  });
  check(
    "animations: entrance reveals complete",
    Object.values(op).every((v) => v > 0.95),
    JSON.stringify(op)
  );

  const lineScale = await page.$eval(
    ".jd-line",
    (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a
  );
  check("animations: timeline line drawn left→right", lineScale > 0.95, `scaleX=${lineScale.toFixed(2)}`);

  const nodePos = await page.evaluate(() => {
    const lineY = document.querySelector(".jd-line").getBoundingClientRect().top;
    return Array.from(document.querySelectorAll(".journey-node")).map((n) => {
      const r = n.getBoundingClientRect();
      const stageLeft = n.closest(".journey-stage").getBoundingClientRect().left;
      return {
        dy: Math.abs(r.top + r.height / 2 - lineY),
        dx: Math.abs(r.left + r.width / 2 - stageLeft),
      };
    });
  });
  check(
    "timeline nodes sit on the line at each column start",
    nodePos.length === 4 && nodePos.every((p) => p.dy <= 2.5 && p.dx <= 1.5),
    JSON.stringify(nodePos.map((p) => ({ dy: +p.dy.toFixed(1), dx: +p.dx.toFixed(1) })))
  );

  const effects = await page.evaluate(() => ({
    pulse: getComputedStyle(document.querySelector(".journey-node"), "::after").animationName,
    float: getComputedStyle(document.querySelector(".journey-icon-float")).animationName,
    breathe: getComputedStyle(document.querySelector(".journey-num-fill")).animationName,
    travelA: getComputedStyle(document.querySelector(".journey-travel-a")).animationName,
    travelB: getComputedStyle(document.querySelector(".journey-travel-b")).animationName,
  }));
  check(
    "continuous: pulse / float / breathe / travel animations active",
    effects.pulse.includes("journey-pulse") &&
      effects.float.includes("journey-float") &&
      effects.breathe.includes("journey-breathe") &&
      effects.travelA.includes("journey-travel") &&
      effects.travelB.includes("journey-travel"),
    JSON.stringify(effects)
  );

  const t1 = await page.$eval(".journey-travel-a", (el) => el.getBoundingClientRect().left);
  await sleep(700);
  const t2 = await page.$eval(".journey-travel-a", (el) => el.getBoundingClientRect().left);
  check(
    "continuous: indicator travels along the line",
    Math.abs(t2 - t1) > 20,
    `moved ${Math.abs(t2 - t1).toFixed(1)}px`
  );

  // Hover on stage 2
  const stageEls = await page.$$(".journey-stage");
  const iconState = (handle) =>
    handle.evaluate((el) => {
      const cs = getComputedStyle(el.querySelector(".jd-icon"));
      return `t:${cs.transform} tr:${cs.translate} sc:${cs.scale}`;
    });
  const before = await stageEls[1].evaluate((el) => ({
    title: getComputedStyle(el.querySelector(".jd-title")).color,
    node: getComputedStyle(el.querySelector(".journey-node")).boxShadow,
  }));
  const iconBefore = await iconState(stageEls[1]);
  await stageEls[1].hover();
  await sleep(750);
  const after = await stageEls[1].evaluate((el) => ({
    title: getComputedStyle(el.querySelector(".jd-title")).color,
    node: getComputedStyle(el.querySelector(".journey-node")).boxShadow,
  }));
  const iconAfter = await iconState(stageEls[1]);
  check("hover: heading brightens", before.title !== after.title, `${before.title} → ${after.title}`);
  check("hover: timeline node highlights", before.node !== after.node, after.node.slice(0, 60) + "…");
  check("hover: icon animates subtly", iconBefore !== iconAfter, `${iconBefore} → ${iconAfter}`);

  // Scroll-reactive progress (towards section end)
  await page.evaluate(() => {
    const el = document.querySelector("#design-journey");
    window.scrollTo(0, el.getBoundingClientRect().top + scrollY + el.offsetHeight - 320);
  });
  await sleep(1400);
  const prog = await page.$eval(
    ".jd-progress",
    (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).a
  );
  check("animations: progress line reacts to scroll", prog > 0.85, `scaleX=${prog.toFixed(2)}`);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check("desktop: no horizontal overflow", overflow <= 1, `overflow=${overflow}px`);

  await page.evaluate(() =>
    document.querySelector("#design-journey").scrollIntoView({ block: "start" })
  );
  await sleep(900);
  await flush(page);
  const el = await page.$("#design-journey");
  await el.screenshot({ path: `${OUT}/journey-desktop.png` });
  await page.close();
}

// ---------- 2. Tablet 820 (reduced motion): 4-col still horizontal ----------
{
  const page = await browser.newPage();
  track(page);
  await page.setViewport({ width: 820, height: 1180 });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await page.waitForSelector("#design-journey", { timeout: 15000 });
  await flush(page);

  const stages = await page.$$eval(".journey-stage", (els) =>
    els.map((s) => {
      const r = s.getBoundingClientRect();
      return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width) };
    })
  );
  check(
    "tablet: four columns stay horizontal",
    stages.length === 4 &&
      new Set(stages.map((s) => s.y)).size === 1 &&
      stages.every((s, i) => i === 0 || s.x > stages[i - 1].x),
    stages.map((s) => `x=${s.x}`).join(" ")
  );
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check("tablet: no horizontal overflow", overflow <= 1, `overflow=${overflow}px`);

  await page.evaluate(() =>
    document.querySelector("#design-journey").scrollIntoView({ block: "start" })
  );
  await flush(page);
  const el = await page.$("#design-journey");
  await el.screenshot({ path: `${OUT}/journey-tablet.png` });
  await page.close();
}

// ---------- 3. Mobile 390: vertical timeline ----------
{
  const page = await browser.newPage();
  track(page);
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await page.waitForSelector("#design-journey", { timeout: 15000 });
  await flush(page);

  const order = await page.evaluate((rf) => {
    const f = eval(rf);
    return {
      project: f("#project"),
      journey: f("#design-journey"),
      about: f("#about"),
    };
  }, rectFn);
  check(
    "mobile: JOURNEY sits directly below PROJECT",
    Math.abs(order.journey.top - order.project.bottom) < 3,
    `gap=${Math.round(order.journey.top - order.project.bottom)}px`
  );
  check(
    "mobile: JOURNEY directly above About",
    Math.abs(order.about.top - order.journey.bottom) < 3,
    `gap=${Math.round(order.about.top - order.journey.bottom)}px`
  );

  const layout = await page.evaluate(() => {
    const stages = Array.from(document.querySelectorAll(".journey-stage"));
    const rect = (el) => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) };
    };
    return {
      stages: stages.map(rect),
      rails: stages.map((s) => ({
        node: getComputedStyle(s.querySelector(".journey-mnode")).display,
        dnode: getComputedStyle(s.querySelector(".journey-node")).display,
        line: s.querySelector(".journey-mline")
          ? Math.round(s.querySelector(".journey-mline").getBoundingClientRect().height)
          : 0,
      })),
      titles: stages.map((s) => s.querySelector(".jd-title").textContent.trim()),
    };
  });
  check(
    "mobile: stages stacked vertically",
    layout.stages.every((s, i) => i === 0 || s.y > layout.stages[i - 1].y),
    layout.stages.map((s) => `y=${s.y}`).join(" ")
  );
  check(
    "mobile: stages full width, aligned",
    layout.stages.every((s) => s.w > 320) &&
      layout.stages.every((s, i) => i === 0 || Math.abs(s.x - layout.stages[0].x) <= 2),
    layout.stages.map((s) => `w=${s.w}`).join(" ")
  );
  check(
    "mobile: vertical rails with nodes + connecting lines",
    layout.rails.every((r) => r.node !== "none" && r.dnode === "none") &&
      layout.rails.slice(0, 3).every((r) => r.line > 30) &&
      layout.rails[3].line === 0,
    JSON.stringify(layout.rails)
  );
  check(
    "mobile: all four stage titles",
    layout.titles.join(",") === "DISCOVER,DEFINE,DESIGN,DELIVER",
    layout.titles.join(",")
  );

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check("mobile: no horizontal overflow", overflow <= 1, `overflow=${overflow}px`);

  await page.evaluate(() =>
    document.querySelector("#design-journey").scrollIntoView({ block: "start" })
  );
  await flush(page);
  const el = await page.$("#design-journey");
  await el.screenshot({ path: `${OUT}/journey-mobile.png` });
  await page.close();
}

// ---------- 4. Reduced motion: content visible, travel dots hidden ----------
{
  const page = await browser.newPage();
  track(page);
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await page.waitForSelector("#design-journey", { timeout: 15000 });
  await flush(page);

  const state = await page.evaluate(() => {
    const q = (s) => document.querySelector(s);
    return {
      heading: parseFloat(getComputedStyle(q(".jd-heading")).opacity),
      title: parseFloat(getComputedStyle(q(".jd-title")).opacity),
      travel: getComputedStyle(q(".journey-travel-a")).display,
      line: new DOMMatrixReadOnly(getComputedStyle(q(".jd-line")).transform).a,
      num: parseFloat(getComputedStyle(q(".journey-num-fill")).opacity),
    };
  });
  check(
    "reduced motion: content fully visible without animation",
    state.heading === 1 && state.title === 1 && state.num === 1 && state.line === 1,
    JSON.stringify(state)
  );
  check("reduced motion: travel indicators hidden", state.travel === "none", state.travel);
  await page.close();
}

// ---------- 5. Light theme: palette tokens adapt ----------
{
  const page = await browser.newPage();
  track(page);
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await page.waitForSelector("#design-journey", { timeout: 15000 });
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  await sleep(700);
  await flush(page);

  const colors = await page.evaluate(() => {
    const h2 = document.querySelector("#design-journey h2");
    return {
      bg: getComputedStyle(document.body).backgroundColor,
      heading: getComputedStyle(h2).color,
      lede: getComputedStyle(document.querySelector("#design-journey h2 + p")).color,
    };
  });
  check(
    "light theme: section uses portfolio light palette",
    colors.bg === "rgb(245, 248, 253)" && colors.heading === "rgb(194, 65, 12)",
    JSON.stringify(colors)
  );

  await page.evaluate(() =>
    document.querySelector("#design-journey").scrollIntoView({ block: "start" })
  );
  await flush(page);
  const el = await page.$("#design-journey");
  await el.screenshot({ path: `${OUT}/journey-light.png` });
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
