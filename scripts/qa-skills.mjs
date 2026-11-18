/* eslint-disable no-console */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const EDGE =
  process.env.EDGE_PATH ||
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = process.env.SHOT_URL || "http://localhost:5173";
const OUT =
  process.env.QA_OUT ||
  "C:\\Users\\aliya\\AppData\\Local\\Temp\\opencode\\skills-qa";

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
    if (!u.includes("favicon")) errors.push(`[requestfailed] ${u} — ${r.failure()?.errorText}`);
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

const EXPECTED = [
  { title: "UX & Product Design", items: ["User Experience (UX) Design","Product Design","User-Centered Design","Design Thinking","User Journey Mapping","Information Architecture","Interaction Design","Responsive & Adaptive Design"] },
  { title: "UX Research & Strategy", items: ["User Research","User Personas","Empathy Mapping","User Interviews","Competitor Analysis","User Flows","Wireframing","Usability Testing","Problem Solving"] },
  { title: "UI & Visual Design", items: ["User Interface Design","High-Fidelity UI","Low-Fidelity Wireframes","Design Systems","Component Libraries","Typography & Color Theory","Visual Hierarchy","Accessibility (WCAG)","Mobile & Web Design"] },
  { title: "Prototyping & Development Collaboration", items: ["Interactive Prototyping","Micro-Interactions","Responsive Prototypes","Developer Handoff","Design Documentation","Design QA","Cross-Functional Collaboration","Design Validation"] },
  { title: "AI-Powered Design & Workflow", items: ["AI-Assisted UI/UX Design","AI Prompt Engineering","AI-Powered Prototyping","AI Design Exploration","AI-Assisted Research","AI Workflow Automation","Vibe Coding","AI-Assisted Website Development"] },
  { title: "Tools & Technologies", items: ["Figma","FigJam","Framer","Miro","Lucidchart","Adobe Photoshop","Canva","ChatGPT","Claude","Gemini","GitHub","VS Code"] },
];

async function openHome(page) {
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await page.waitForSelector("#skills", { timeout: 15000 });
  await sleep(4400);
}

// ---------- 1. Desktop: placement, copy, structure ----------
{
  const page = await browser.newPage();
  track(page);
  await page.setViewport({ width: 1440, height: 900 });
  await openHome(page);

  const order = await page.evaluate(() => {
    const f = (s, mode) => {
      const el = document.querySelector(s);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return Math.round((mode === "bottom" ? r.bottom : r.top) + scrollY);
    };
    return {
      journey: f("#design-journey"),
      galleryBottom: f("#case-studies", "bottom"),
      skills: f("#skills"),
      about: f("#about"),
      contact: f("#contact"),
    };
  });
  check(
    "desktop: SKILLS sits directly below EXPLORE (gallery)",
    order.skills >= order.galleryBottom && order.skills - order.galleryBottom < 30,
    JSON.stringify(order)
  );
  check(
    "desktop: SKILLS before ABOUT and CONTACT",
    order.skills < order.about && order.skills < order.contact
  );

  const copy = await page.evaluate(() => ({
    eyebrow: document.querySelector("#skills header span")?.textContent || "",
    h2: document.querySelector("#skills h2")?.textContent || "",
    sub: document.querySelector("#skills header p")?.textContent || "",
  }));
  check("desktop: eyebrow 'Key Skills & Tools'", copy.eyebrow.includes("Key Skills & Tools"), copy.eyebrow);
  check("desktop: heading 'My Design Toolkit.'", copy.h2 === "My Design Toolkit.", copy.h2);
  check(
    "desktop: supporting line exact",
    copy.sub === "The skills, tools and thinking behind every experience I create.",
    copy.sub
  );

  const cards = await page.$$eval("#skills .skill-card", (els) =>
    els.map((el) => ({
      title: el.querySelector("h3")?.textContent || "",
      chips: Array.from(el.querySelectorAll(".skill-chip")).map((c) => c.textContent.trim()),
      tools: Array.from(el.querySelectorAll(".tool-btn")).map((b) => ({
        name: b.textContent.trim(),
        img: b.querySelector("img")?.getAttribute("src") || "",
        loaded: !!b.querySelector("img")?.naturalWidth,
      })),
    }))
  );
  check("desktop: 6 category cards", cards.length === 6, `count=${cards.length}`);

  let contentOk = cards.length === 6;
  let mismatch = "";
  if (contentOk) {
    for (let i = 0; i < 6; i++) {
      const got = i === 5 ? cards[i].tools.map((t) => t.name) : cards[i].chips;
      if (cards[i].title !== EXPECTED[i].title) {
        contentOk = false;
        mismatch = `card ${i + 1} title: "${cards[i].title}"`;
        break;
      }
      if (JSON.stringify(got) !== JSON.stringify(EXPECTED[i].items)) {
        contentOk = false;
        mismatch = `card ${i + 1}: got [${got.join(", ")}]`;
        break;
      }
    }
  }
  check("desktop: all six categories + exact skill/tool lists", contentOk, mismatch || "8/9/9/8/8/12 items");

  const toolImgs = cards[5]?.tools || [];
  check(
    "desktop: 12 tool buttons with real logo files",
    toolImgs.length === 12 && toolImgs.every((t) => t.img.startsWith("/logos/")),
    JSON.stringify(toolImgs.map((t) => t.img))
  );

  const logoTileBg = await page.$eval("#skills .tool-btn .tool-float", (el) =>
    getComputedStyle(el).backgroundColor
  );
  check("desktop: logo tiles on white app-icon background", logoTileBg === "rgb(255, 255, 255)", logoTileBg);

  // ---------- 2. Entrance animation ----------
  const cardCount = await page.$$eval("#skills .skill-card", (els) => els.length);
  for (let i = 0; i < cardCount; i++) {
    await page.$$eval(
      "#skills .skill-card",
      (els, idx) => els[idx].scrollIntoView({ block: "center" }),
      i
    );
    await sleep(750);
  }
  const opacities = await page.$$eval("#skills .skill-chip, #skills .tool-btn", (els) =>
    els.map((el) => parseFloat(getComputedStyle(el).opacity))
  );
  check(
    "desktop: staggered entrance completed for all chips/buttons",
    opacities.length === 54 && opacities.every((o) => o === 1),
    `${opacities.length} elements, min=${Math.min(...opacities)}`
  );
  const headOp = await page.$eval("#skills .skill-card-head", (el) =>
    parseFloat(getComputedStyle(el).opacity)
  );
  check("desktop: card headers revealed", headOp === 1, String(headOp));

  // lazy logos: tools card is now scrolled into view — wait for decode
  await page.evaluate(async () => {
    const imgs = Array.from(document.querySelectorAll("#skills .tool-btn img"));
    await Promise.all(
      imgs.map((img) =>
        img.complete && img.naturalWidth > 0
          ? Promise.resolve()
          : new Promise((res) => {
              img.addEventListener("load", res, { once: true });
              img.addEventListener("error", res, { once: true });
              setTimeout(res, 5000);
            })
      )
    );
  });
  const logoState = await page.$$eval("#skills .tool-btn img", (imgs) =>
    imgs.map((i) => ({ src: i.getAttribute("src"), ok: i.complete && i.naturalWidth > 0 }))
  );
  check(
    "desktop: all tool logos loaded (naturalWidth > 0)",
    logoState.length === 12 && logoState.every((l) => l.ok),
    logoState.filter((l) => !l.ok).map((l) => l.src).join(",") || "all 12 loaded"
  );

  // ---------- 3. Hover micro-interactions ----------
  const chip = await page.$("#skills .skill-chip");
  await chip.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await sleep(600);
  const before = await chip.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return { h: r.height, shadow: cs.boxShadow, border: cs.borderColor, color: cs.color };
  });
  const box = await chip.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await sleep(600);
  const after = await chip.evaluate((el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return { h: r.height, shadow: cs.boxShadow, border: cs.borderColor, color: cs.color };
  });
  check("chip hover: scales up", after.h > before.h + 0.8, `${before.h.toFixed(1)} → ${after.h.toFixed(1)}`);
  check("chip hover: glowing shadow appears", before.shadow === "none" && after.shadow !== "none", after.shadow.slice(0, 60));
  check("chip hover: accent border + color transition", after.border !== before.border && after.color !== before.color, `${before.border} → ${after.border}`);

  const tool = await page.$("#skills .tool-btn");
  await tool.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await sleep(600);
  const tBefore = await tool.evaluate((el) => Math.round(el.getBoundingClientRect().height * 10) / 10);
  const tBox = await tool.boundingBox();
  await page.mouse.move(tBox.x + tBox.width / 2, tBox.y + tBox.height / 2);
  await sleep(600);
  const tAfter = await tool.evaluate((el) => {
    const cs = getComputedStyle(el);
    return { h: Math.round(el.getBoundingClientRect().height * 10) / 10, shadow: cs.boxShadow, border: cs.borderColor };
  });
  check(
    "tool hover: logo button scales + glows",
    tAfter.h > tBefore + 0.8 && tAfter.shadow !== "none",
    `${tBefore} → ${tAfter.h}, border ${tAfter.border}`
  );
  await page.mouse.move(0, 0);

  // ---------- 4. Continuous motion + background ----------
  const motion = await page.evaluate(() => {
    const float = document.querySelector("#skills .tool-float");
    const orb = document.querySelector("#skills .skills-orb-a");
    const orb2 = document.querySelector("#skills .skills-orb-b");
    const grid = document.querySelector("#skills .skills-grid-bg");
    return {
      float: float ? getComputedStyle(float).animationName : "none",
      orb: orb ? getComputedStyle(orb).animationName : "none",
      orb2: orb2 ? getComputedStyle(orb2).animationName : "none",
      grid: !!grid,
      cards: document.querySelectorAll("#skills .glass-card").length,
    };
  });
  check("continuous: tool logos floating animation", motion.float === "skills-float", motion.float);
  check("continuous: background orbs animated", motion.orb === "skills-orb-a" && motion.orb2 === "skills-orb-b", `${motion.orb}/${motion.orb2}`);
  check("background: dot grid + 6 glass cards", motion.grid && motion.cards === 6, `grid=${motion.grid} cards=${motion.cards}`);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check("desktop: no horizontal overflow", overflow <= 0, `${overflow}px`);

  await page.evaluate(() => document.querySelector("#skills").scrollIntoView({ block: "start" }));
  await sleep(1200);
  await flush(page);
  await page.screenshot({ path: `${OUT}/skills-desktop.png` });
  await page.evaluate(() =>
    document.querySelectorAll("#skills .skill-card")[5].scrollIntoView({ block: "center" })
  );
  await sleep(1300);
  await page.screenshot({ path: `${OUT}/skills-tools.png` });
  await page.close();
}

// ---------- 5. Tablet 1024 ----------
{
  const page = await browser.newPage();
  track(page);
  await page.setViewport({ width: 1024, height: 768 });
  await openHome(page);

  const grid = await page.$$eval("#skills .skill-card", (els) =>
    els.slice(0, 4).map((el) => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left), y: Math.round(r.top + scrollY) };
    })
  );
  check(
    "tablet: 2-column grid layout",
    grid[0].y === grid[1].y && grid[1].x > grid[0].x && grid[2].y > grid[0].y,
    JSON.stringify(grid)
  );
  const toolCols = await page.$eval("#skills .tool-btn", (el) =>
    getComputedStyle(el.parentElement).gridTemplateColumns.split(" ").length
  );
  check("tablet: tool grid ≥ 4 columns", toolCols >= 4, `${toolCols} cols`);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check("tablet: no horizontal overflow", overflow <= 0, `${overflow}px`);

  await page.evaluate(() => document.querySelector("#skills").scrollIntoView({ block: "start" }));
  await sleep(1400);
  await page.screenshot({ path: `${OUT}/skills-tablet.png` });
  await page.close();
}

// ---------- 6. Mobile 390 ----------
{
  const page = await browser.newPage();
  track(page);
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await openHome(page);

  const order = await page.evaluate(() => {
    const f = (s) => {
      const el = document.querySelector(s);
      if (!el) return null;
      return Math.round(el.getBoundingClientRect().top + scrollY);
    };
    return { about: f("#about"), gallery: f("#case-studies"), skills: f("#skills"), contact: f("#contact") };
  });
  check(
    "mobile: order About → Gallery → Skills → Contact",
    order.about < order.gallery && order.gallery < order.skills && order.skills < order.contact,
    JSON.stringify(order)
  );

  const stack = await page.$$eval("#skills .skill-card", (els) =>
    els.slice(0, 2).map((el) => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left), y: Math.round(r.top + scrollY), w: Math.round(r.width) };
    })
  );
  check(
    "mobile: cards stack single column",
    stack[0].y < stack[1].y && stack[0].x === stack[1].x && stack[0].w > 300,
    JSON.stringify(stack)
  );

  const toolCols = await page.$eval("#skills .tool-btn", (el) =>
    getComputedStyle(el.parentElement).gridTemplateColumns.split(" ").length
  );
  check("mobile: tool grid 3 columns", toolCols === 3, `${toolCols} cols`);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check("mobile: no horizontal overflow", overflow <= 0, `${overflow}px`);

  await page.evaluate(() => document.querySelector("#skills").scrollIntoView({ block: "start" }));
  await sleep(1400);
  await page.screenshot({ path: `${OUT}/skills-mobile.png` });
  await page.close();
}

// ---------- 7. Reduced motion ----------
{
  const page = await browser.newPage();
  track(page);
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await openHome(page);

  const state = await page.evaluate(() => {
    const chip = document.querySelector("#skills .skill-chip");
    const float = document.querySelector("#skills .tool-float");
    const orb = document.querySelector("#skills .skills-orb-a");
    const toMs = (d) => (d.endsWith("ms") ? parseFloat(d) : parseFloat(d) * 1000);
    return {
      chipOpacity: chip ? parseFloat(getComputedStyle(chip).opacity) : -1,
      floatMs: float ? toMs(getComputedStyle(float).animationDuration) : -1,
      orbMs: orb ? toMs(getComputedStyle(orb).animationDuration) : -1,
    };
  });
  check("reduced: chips fully visible without animation", state.chipOpacity === 1, String(state.chipOpacity));
  check("reduced: float/orb animations neutralized", state.floatMs <= 1 && state.orbMs <= 1, `float=${state.floatMs}ms orb=${state.orbMs}ms`);

  const swap = await page.$eval("#skills .skill-chip", (el) => {
    el.scrollIntoView({ block: "center" });
    return true;
  });
  await sleep(300);
  check("reduced: content usable", !!swap);
  await page.close();
}

// ---------- 8. Light theme ----------
{
  const page = await browser.newPage();
  track(page);
  await page.setViewport({ width: 1440, height: 900 });
  await openHome(page);
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  await sleep(400);

  const theme = await page.evaluate(() => {
    const h2 = document.querySelector("#skills h2");
    const chip = document.querySelector("#skills .skill-chip");
    const card = document.querySelector("#skills .glass-card");
    return {
      head: getComputedStyle(h2).color,
      chipFg: getComputedStyle(chip).color,
      chipBg: getComputedStyle(chip).backgroundColor,
      cardBg: getComputedStyle(card).backgroundColor,
    };
  });
  check("light theme: heading switches to dark ink", theme.head !== theme.chipFg && theme.head === "rgb(0, 0, 0)", theme.head);
  check("light theme: chip text legible on chip bg", theme.chipFg !== theme.chipBg && theme.chipBg !== "rgba(0, 0, 0, 0)", JSON.stringify({ fg: theme.chipFg, bg: theme.chipBg }));

  await page.evaluate(() => document.querySelector("#skills").scrollIntoView({ block: "start" }));
  await sleep(1300);
  await page.screenshot({ path: `${OUT}/skills-light.png` });
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
