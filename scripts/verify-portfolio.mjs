/* eslint-disable no-console */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const EDGE =
  process.env.EDGE_PATH ||
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = process.env.SHOT_URL || "http://localhost:5173";
const OUT =
  process.env.VERIFY_OUT ||
  "C:\\Users\\aliya\\AppData\\Local\\Temp\\opencode\\portfolio-verify";
const LIVE = "https://skyvoyage-pi.vercel.app/";
const CASE_PATH = "/projects/skyvoyage/ux-case-study";

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--hide-scrollbars"],
});

const allErrors = [];
const results = [];

function check(name, cond, detail = "") {
  results.push({ name, ok: !!cond, detail });
  console.log(`${cond ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function makePage({ reduced = true, viewport = { width: 1440, height: 900 } } = {}) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  if (reduced) {
    await page.emulateMediaFeatures([
      { name: "prefers-reduced-motion", value: "reduce" },
    ]);
  }
  page.on("console", (m) => {
    if (m.type() === "error") allErrors.push(`[console] ${m.text()}`);
  });
  page.on("pageerror", (e) => allErrors.push(`[pageerror] ${e.message}`));
  page.on("requestfailed", (r) => {
    const u = r.url();
    if (!u.includes("favicon")) {
      allErrors.push(`[requestfailed] ${u} — ${r.failure()?.errorText}`);
    }
  });
  return page;
}

const flush = (page) =>
  page.evaluate(
    () =>
      new Promise((r) => {
        let n = 0;
        const step = () => (++n > 6 ? r() : requestAnimationFrame(step));
        requestAnimationFrame(step);
      })
  );

async function rect(page, sel) {
  return page.$eval(sel, (el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top + window.scrollY, bottom: r.bottom + window.scrollY };
  });
}

// ---------- 1. Desktop home: section order + card wiring ----------
{
  const page = await makePage();
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await page.waitForSelector("#project", { timeout: 15000 });
  await flush(page);

  const hero = await rect(page, "#hero");
  const project = await rect(page, "#project");
  const about = await rect(page, "#about");
  const cases = await rect(page, "#case-studies");

  check("desktop: PROJECT sits directly below hero", project.top >= hero.bottom - 2 && project.top - hero.bottom < 4, `gap=${Math.round(project.top - hero.bottom)}px`);
  check("desktop: PROJECT above Case Studies", project.bottom <= cases.top + 2, `project.bottom=${Math.round(project.bottom)} case.top=${Math.round(cases.top)}`);
  check("desktop: Case Studies before About", cases.top < about.top);

  const uxCard = await page.$('a[href="' + CASE_PATH + '"]');
  const uiCard = await page.$('a[href="' + LIVE + '"][target="_blank"]');
  check("UX card links to case-study route (internal)", !!uxCard);
  check("UI card links to live product in new tab", !!uiCard);

  await page.evaluate(() => document.querySelector("#project").scrollIntoView());
  await flush(page);
  await page.screenshot({ path: `${OUT}/01-home-project-desktop.png` });
  await page.close();
}

// ---------- 2. UX card navigates to case study ----------
{
  const page = await makePage();
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await page.waitForSelector("#project", { timeout: 15000 });
  await page.click('a[href="' + CASE_PATH + '"]');
  await page.waitForFunction((p) => location.pathname === p, { timeout: 10000 }, CASE_PATH);
  await page.waitForSelector("h1", { timeout: 10000 });
  await flush(page);

  const h1 = await page.$eval("h1", (el) => el.textContent.trim());
  check("case study: h1 is SkyVoyage", h1 === "SkyVoyage", h1);

  const sections = await page.$$eval("section[id]", (els) => els.map((e) => e.id));
  const required = ["top", "problem", "solution", "showcase", "personas", "journey", "mapping", "ia", "flows", "decisions", "final"];
  const missing = required.filter((id) => !sections.includes(id));
  check("case study: all 11 sections present", missing.length === 0, missing.length ? `missing: ${missing.join(",")}` : sections.join(","));

  const navText = await page.$eval("nav", (el) => el.textContent);
  check("case study nav: Back to Portfolio", navText.includes("Back to Portfolio"));
  check("case study nav: Back to Projects", navText.includes("Back to Projects"));
  check("case study nav: Live Product", navText.includes("Live Product"));

  const title = await page.title();
  check("case study: document title", title.includes("SkyVoyage"), title);

  const personaNote = await page.evaluate(() =>
    Array.from(document.querySelectorAll("p")).some((p) =>
      p.textContent.includes("illustrative personas")
    )
  );
  check("case study: personas carry illustrative disclaimer", personaNote);

  await page.evaluate(() => window.scrollTo(0, 0));
  await flush(page);
  await page.screenshot({ path: `${OUT}/02-case-study-hero-desktop.png` });

  await page.evaluate(() => document.querySelector("#journey").scrollIntoView());
  await flush(page);
  await page.screenshot({ path: `${OUT}/03-case-study-journey-desktop.png` });

  await page.close();
}

// ---------- 3. Back to Projects returns home and scrolls to #project ----------
{
  const page = await makePage();
  await page.goto(BASE + CASE_PATH, { waitUntil: "networkidle2" });
  await page.waitForSelector('a[href="/#project"]', { timeout: 15000 });
  await page.click('a[href="/#project"]');
  await page.waitForFunction((p) => location.pathname === p, { timeout: 10000 }, "/");
  await page.waitForSelector("#project", { timeout: 10000 });
  await new Promise((r) => setTimeout(r, 700));
  await flush(page);

  const pos = await page.evaluate(() => {
    const el = document.querySelector("#project");
    return Math.abs(el.getBoundingClientRect().top);
  });
  check("Back to Projects lands on #project", pos < 120, `offset=${Math.round(pos)}px`);
  await page.close();
}

// ---------- 4. UI card opens live product in a new tab ----------
{
  const page = await makePage();
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await page.waitForSelector("#project", { timeout: 15000 });

  const [popup] = await Promise.all([
    browser.waitForTarget((t) => t.url().startsWith(LIVE), { timeout: 15000 }),
    page.click('a[href="' + LIVE + '"]'),
  ]);
  check("UI card opens live product in new tab", !!popup, popup ? popup.url() : "no target");
  await page.close();
}

// ---------- 5. Mobile order ----------
{
  const page = await makePage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await page.waitForSelector("#project", { timeout: 15000 });
  await flush(page);

  const hero = await rect(page, "#hero");
  const project = await rect(page, "#project");
  const about = await rect(page, "#about");
  const cases = await rect(page, "#case-studies");

  check("mobile: PROJECT sits directly below hero", project.top >= hero.bottom - 2 && project.top - hero.bottom < 4, `gap=${Math.round(project.top - hero.bottom)}px`);
  check("mobile: About before Case Studies (unchanged)", about.top < cases.top);

  await page.evaluate(() => document.querySelector("#project").scrollIntoView());
  await flush(page);
  await page.screenshot({ path: `${OUT}/04-home-project-mobile.png` });

  const cards = await page.$$eval(".proj-card", (els) => els.length);
  check("mobile: both project cards render", cards === 2, `count=${cards}`);
  await page.close();
}

// ---------- 6. Case study mobile ----------
{
  const page = await makePage({ viewport: { width: 390, height: 844 } });
  await page.goto(BASE + CASE_PATH, { waitUntil: "networkidle2" });
  await page.waitForSelector("#top", { timeout: 15000 });
  await flush(page);
  await page.screenshot({ path: `${OUT}/05-case-study-hero-mobile.png` });

  await page.evaluate(() => document.querySelector("#journey").scrollIntoView());
  await flush(page);
  await page.screenshot({ path: `${OUT}/06-case-study-journey-mobile.png` });

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check("case study mobile: no horizontal page overflow", overflow <= 1, `overflow=${overflow}px`);
  await page.close();
}

// ---------- 7. Animation sanity (motion enabled) ----------
{
  const page = await makePage({ reduced: false });
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await page.waitForSelector("#project", { timeout: 15000 });
  await new Promise((r) => setTimeout(r, 4200)); // preloader
  await page.evaluate(() => document.querySelector("#project").scrollIntoView());
  await new Promise((r) => setTimeout(r, 1600));
  await flush(page);

  const opacity = await page.$eval(".proj-card", (el) => parseFloat(getComputedStyle(el).opacity));
  check("animations: .proj-card revealed after scroll", opacity > 0.9, `opacity=${opacity}`);
  await page.close();
}

await browser.close();

const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (allErrors.length) {
  console.log("\nConsole/page errors:");
  for (const e of allErrors) console.log("  " + e);
} else {
  console.log("No console/page/request errors.");
}
console.log(`Screenshots: ${OUT}`);
process.exit(failed.length || allErrors.length ? 1 : 0);
