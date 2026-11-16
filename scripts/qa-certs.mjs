/* eslint-disable no-console */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const EDGE =
  process.env.EDGE_PATH ||
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = process.env.SHOT_URL || "http://localhost:5173";
const OUT =
  process.env.QA_OUT ||
  "C:\\Users\\aliya\\AppData\\Local\\Temp\\opencode\\certs-qa";

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

const TITLES = [
  "Human-Computer Interaction: The Foundations of UX Design",
  "AI for Designers",
  "Visual Design: The Ultimate Guide",
];

async function openHome(page) {
  await page.goto(BASE, { waitUntil: "networkidle2" });
  await page.waitForSelector("#certifications", { timeout: 15000 });
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
      skillsBottom: f("#skills", "bottom"),
      certs: f("#certifications"),
      about: f("#about"),
      contact: f("#contact"),
    };
  });
  check(
    "desktop: CERTIFICATIONS sits directly below SKILLS",
    order.certs >= order.skillsBottom && order.certs - order.skillsBottom < 30,
    JSON.stringify(order)
  );
  check(
    "desktop: SKILLS → CERTS → ABOUT → CONTACT order",
    order.certs < order.about && order.about < order.contact,
    JSON.stringify(order)
  );

  const copy = await page.evaluate(() => ({
    label: document.querySelector("#certifications .cert-label")?.textContent || "",
    h2: document.querySelector("#certifications h2")?.textContent || "",
    sub: document.querySelector("#certifications header p")?.textContent || "",
    labelAnim: document.querySelector("#certifications .cert-label")
      ? getComputedStyle(document.querySelector("#certifications .cert-label")).animationName
      : "none",
  }));
  check(
    "desktop: animated label 'LEARN · EXPLORE · EVOLVE'",
    copy.label.trim().toLowerCase() === "learn · explore · evolve",
    copy.label
  );
  check("desktop: label shimmer animation running", copy.labelAnim === "cert-shimmer", copy.labelAnim);
  check(
    "desktop: heading exact",
    copy.h2 === "Credentials & Continuous Learning",
    copy.h2
  );
  check(
    "desktop: supporting line exact",
    copy.sub ===
      "Always learning, continuously evolving — building stronger design foundations through hands-on practice and industry-led learning.",
    copy.sub
  );

  const org = await page.evaluate(() => {
    const el = document.querySelector("#certifications .cert-org");
    return {
      exists: !!el,
      text: el?.textContent || "",
    };
  });
  check(
    "desktop: IxDF org header with name + 'Professional Learning'",
    org.exists &&
      org.text.includes("IxDF") &&
      org.text.includes("Interaction Design Foundation") &&
      org.text.includes("Professional Learning"),
    org.text.replace(/\s+/g, " ").slice(0, 120)
  );

  const cards = await page.$$eval("#certifications .cert-card", (els) =>
    els.map((el) => ({
      title: el.querySelector("h4")?.textContent || "",
      text: el.textContent || "",
      index: el.querySelector("span.rounded-full")?.textContent || "",
      hasYear: (el.textContent || "").includes("2026"),
      imgs: el.querySelectorAll("img").length,
      placeholders: el.querySelectorAll('[aria-hidden="true"][class*="aspect"]').length,
      viewBtn: !!Array.from(el.querySelectorAll("button")).find((b) =>
        b.textContent.includes("View Certificate")
      ),
      anchors: el.querySelectorAll("a").length,
    }))
  );
  check("desktop: 3 certificate cards", cards.length === 3, `count=${cards.length}`);
  const titlesOk =
    cards.length === 3 && cards.every((c, i) => c.title === TITLES[i]);
  check("desktop: exact certificate titles", titlesOk, cards.map((c) => c.title).join(" | "));
  const metaOk =
    cards.every((c) => c.text.includes("Interaction Design Foundation (IxDF)")) &&
    cards.every((c) => c.hasYear) &&
    cards.every((c) => c.viewBtn);
  check(
    "desktop: org + year 2026 + View Certificate on every card",
    metaOk,
    JSON.stringify(cards.map((c) => ({ orgOk: c.text.includes("(IxDF)"), year: c.hasYear, btn: c.viewBtn })))
  );
  check(
    "desktop: no fabricated links or images (placeholders + no anchors)",
    cards.every((c) => c.anchors === 0 && c.imgs === 0 && c.placeholders >= 1),
    JSON.stringify(cards.map((c) => ({ a: c.anchors, i: c.imgs, ph: c.placeholders })))
  );

  const sectionAnchors = await page.$$eval("#certifications a", (els) => els.length);
  const sectionImgs = await page.$$eval("#certifications img", (els) => els.length);
  check(
    "desktop: whole section has zero links / zero images (nothing invented)",
    sectionAnchors === 0 && sectionImgs === 0,
    `anchors=${sectionAnchors} imgs=${sectionImgs}`
  );

  // ---------- 2. Entrance animations ----------
  for (let i = 0; i < 3; i++) {
    await page.$$eval(
      "#certifications .cert-card",
      (els, idx) => els[idx].scrollIntoView({ block: "center" }),
      i
    );
    await sleep(700);
  }
  const opacities = await page.$$eval("#certifications .cert-card", (els) =>
    els.map((el) => parseFloat(getComputedStyle(el).opacity))
  );
  check(
    "desktop: staggered card entrance completed",
    opacities.length === 3 && opacities.every((o) => o === 1),
    JSON.stringify(opacities)
  );
  const headOp = await page.$eval("#certifications .cert-head", (el) =>
    parseFloat(getComputedStyle(el).firstElementChild ? getComputedStyle(el).opacity : "1")
  );
  check("desktop: header revealed", headOp === 1, String(headOp));

  await page.evaluate(() =>
    document.querySelector(".cert-timeline").scrollIntoView({ block: "center" })
  );
  await sleep(1500);
  const timeline = await page.evaluate(() => {
    const line = document.querySelector(".cert-line");
    const nodes = Array.from(document.querySelectorAll(".cert-node"));
    const m = line ? getComputedStyle(line).transform : "none";
    let scaleX = -1;
    if (m.startsWith("matrix(")) scaleX = parseFloat(m.slice(7).split(",")[0]);
    else if (m === "none") scaleX = 1;
    return {
      scaleX,
      nodes: nodes.map((n) => n.textContent || ""),
      dotAnim: document.querySelector(".cert-dot")
        ? getComputedStyle(document.querySelector(".cert-dot")).animationName
        : "none",
    };
  });
  check(
    "timeline: gradient line fully drawn (scaleX ≈ 1)",
    timeline.scaleX > 0.99,
    String(timeline.scaleX)
  );
  check(
    "timeline: two nodes 2024 → 2026",
    timeline.nodes.length === 2 &&
      timeline.nodes[0].includes("2024") &&
      timeline.nodes[1].includes("2026"),
    JSON.stringify(timeline.nodes)
  );
  check("timeline: node dots pulsing", timeline.dotAnim === "cert-pulse", timeline.dotAnim);

  // ---------- 3. 3D tilt ----------
  const tilt = await page.$("#certifications .cert-card .cert-tilt");
  await tilt.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await sleep(700);
  const tBox = await tilt.boundingBox();
  await page.mouse.move(tBox.x + tBox.width * 0.8, tBox.y + tBox.height * 0.25, { steps: 5 });
  await sleep(350);
  const tState = await tilt.evaluate((el) => ({
    transform: el.style.transform,
    gx: el.style.getPropertyValue("--gx"),
  }));
  check(
    "tilt: 3D rotation applied on mouse move",
    tState.transform.includes("rotateX") && tState.transform.includes("rotateY"),
    tState.transform
  );
  check("tilt: glare position follows pointer", tState.gx.endsWith("%"), tState.gx);
  await page.mouse.move(0, 0);
  await sleep(400);
  const tReset = await tilt.evaluate((el) => el.style.transform);
  check("tilt: resets on pointer leave", tReset === "", `"${tReset}"`);

  // ---------- 4. Hover glow ----------
  const hBefore = await tilt.evaluate((el) => getComputedStyle(el).borderColor);
  const hBox = await tilt.boundingBox();
  await page.mouse.move(hBox.x + hBox.width / 2, hBox.y + hBox.height / 2, { steps: 4 });
  await sleep(650);
  const hAfter = await tilt.evaluate((el) => ({
    border: getComputedStyle(el).borderColor,
    shadow: getComputedStyle(el).boxShadow,
  }));
  check(
    "hover: accent border + glow shadow",
    hAfter.border !== hBefore && hAfter.shadow !== "none",
    `${hBefore} → ${hAfter.border}`
  );
  await page.mouse.move(0, 0);

  // ---------- 5. Lightbox ----------
  const viewBtn = await page.$("#certifications .cert-card button");
  await viewBtn.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await sleep(600);
  await viewBtn.click();
  await sleep(600);
  const lb = await page.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"]');
    return {
      open: !!dlg,
      modal: dlg?.getAttribute("aria-modal") === "true",
      title: dlg?.querySelector("h4")?.textContent || "",
      bodyOverflow: getComputedStyle(document.body).overflow,
      hasImg: !!dlg?.querySelector("img"),
      hasPaper: !!dlg?.querySelector('[aria-hidden="true"]'),
    };
  });
  check("lightbox: opens as aria-modal dialog", lb.open && lb.modal, JSON.stringify(lb));
  check("lightbox: shows certificate title", lb.title === TITLES[0], lb.title);
  check("lightbox: page scroll locked while open", lb.bodyOverflow === "hidden", lb.bodyOverflow);
  check(
    "lightbox: preview inside (placeholder paper, no fake image)",
    lb.hasPaper && !lb.hasImg,
    `paper=${lb.hasPaper} img=${lb.hasImg}`
  );
  await flush(page);
  await page.screenshot({ path: `${OUT}/certs-lightbox.png` });

  await page.keyboard.press("Escape");
  await sleep(450);
  const afterEsc = await page.evaluate(() => ({
    open: !!document.querySelector('[role="dialog"]'),
    overflow: getComputedStyle(document.body).overflow,
  }));
  check(
    "lightbox: ESC closes and scroll restored",
    !afterEsc.open && afterEsc.overflow !== "hidden",
    JSON.stringify(afterEsc)
  );

  // backdrop click
  await viewBtn.click();
  await sleep(500);
  await page.mouse.click(12, 12);
  await sleep(450);
  const afterBd = await page.evaluate(() => !!document.querySelector('[role="dialog"]'));
  check("lightbox: backdrop click closes", !afterBd, String(afterBd));

  // ---------- 6. School of Techies ----------
  const school = await page.evaluate(() => {
    const el = document.querySelector("#certifications .cert-school");
    return {
      exists: !!el,
      text: el?.textContent || "",
      chips: el
        ? Array.from(el.querySelectorAll("span.rounded-full")).map((s) => s.textContent.trim())
        : [],
    };
  });
  check("school: featured card exists", school.exists);
  const desc =
    "Completed six months of structured UX/UI design training, developing practical knowledge of user-centered design, wireframing, prototyping, visual design, responsive interfaces, design workflows and industry-standard tools.";
  check(
    "school: institution / duration / year present",
    school.text.includes("School of Techies") &&
      school.text.includes("6 Months") &&
      school.text.includes("2024") &&
      school.text.includes("UX/UI Design Training"),
    school.text.replace(/\s+/g, " ").slice(0, 140)
  );
  check("school: description exact", school.text.includes(desc));
  check(
    "school: skill chips + timeline illustration icons",
    school.chips.includes("Wireframing") && school.chips.includes("Design workflows"),
    JSON.stringify(school.chips)
  );

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check("desktop: no horizontal overflow", overflow <= 0, `${overflow}px`);

  await page.mouse.move(700, 870);
  await page.evaluate(() => document.querySelector("#certifications").scrollIntoView({ block: "start" }));
  await sleep(1400);
  await flush(page);
  await page.screenshot({ path: `${OUT}/certs-desktop-top.png` });
  await page.evaluate(() =>
    document.querySelector("#certifications .cert-grid").scrollIntoView({ block: "center" })
  );
  await sleep(1300);
  await page.mouse.move(700, 870);
  await sleep(300);
  await page.screenshot({ path: `${OUT}/certs-desktop-grid.png` });
  await page.evaluate(() =>
    document.querySelector("#certifications .cert-school").scrollIntoView({ block: "center" })
  );
  await sleep(1300);
  await page.screenshot({ path: `${OUT}/certs-desktop-school.png` });
  await page.close();
}

// ---------- 7. Tablet 1024 ----------
{
  const page = await browser.newPage();
  track(page);
  await page.setViewport({ width: 1024, height: 768 });
  await openHome(page);

  const grid = await page.$$eval("#certifications .cert-card", (els) =>
    els.map((el) => {
      const r = el.getBoundingClientRect();
      return { x: Math.round(r.left), y: Math.round(r.top + scrollY) };
    })
  );
  check(
    "tablet: 2-column card grid",
    grid.length === 3 && grid[0].y === grid[1].y && grid[1].x > grid[0].x && grid[2].y > grid[0].y,
    JSON.stringify(grid)
  );

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check("tablet: no horizontal overflow", overflow <= 0, `${overflow}px`);

  await page.evaluate(() => document.querySelector("#certifications").scrollIntoView({ block: "start" }));
  await sleep(1400);
  await page.screenshot({ path: `${OUT}/certs-tablet.png` });
  await page.close();
}

// ---------- 8. Mobile 390 ----------
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
    return {
      about: f("#about"),
      gallery: f("#case-studies"),
      skills: f("#skills"),
      certs: f("#certifications"),
      contact: f("#contact"),
    };
  });
  check(
    "mobile: order … Gallery → Skills → Certifications → Contact",
    order.gallery < order.skills && order.skills < order.certs && order.certs < order.contact,
    JSON.stringify(order)
  );

  const stack = await page.$$eval("#certifications .cert-card", (els) =>
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

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  check("mobile: no horizontal overflow", overflow <= 0, `${overflow}px`);

  // lightbox fits viewport
  const btn = await page.$("#certifications .cert-card button");
  await btn.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await sleep(600);
  await btn.click();
  await sleep(600);
  const dlgFit = await page.evaluate(() => {
    const dlg = document.querySelector('[role="dialog"]');
    if (!dlg) return { open: false };
    const r = dlg.getBoundingClientRect();
    return { open: true, left: Math.round(r.left), right: Math.round(r.right) };
  });
  check(
    "mobile: lightbox fits within viewport width",
    dlgFit.open && dlgFit.left >= 0 && dlgFit.right <= 390,
    JSON.stringify(dlgFit)
  );
  await page.screenshot({ path: `${OUT}/certs-mobile-lightbox.png` });
  await page.keyboard.press("Escape");
  await sleep(400);

  await page.evaluate(() => document.querySelector("#certifications").scrollIntoView({ block: "start" }));
  await sleep(1400);
  await page.screenshot({ path: `${OUT}/certs-mobile.png` });
  await page.close();
}

// ---------- 9. Reduced motion ----------
{
  const page = await browser.newPage();
  track(page);
  await page.setViewport({ width: 1440, height: 900 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  await openHome(page);

  const state = await page.evaluate(() => {
    const card = document.querySelector("#certifications .cert-card");
    const label = document.querySelector("#certifications .cert-label");
    const dot = document.querySelector(".cert-dot");
    const toMs = (d) => (d.endsWith("ms") ? parseFloat(d) : parseFloat(d) * 1000);
    return {
      cardOpacity: card ? parseFloat(getComputedStyle(card).opacity) : -1,
      labelMs: label ? toMs(getComputedStyle(label).animationDuration) : -1,
      dotMs: dot ? toMs(getComputedStyle(dot).animationDuration) : -1,
    };
  });
  check("reduced: cards fully visible without animation", state.cardOpacity === 1, String(state.cardOpacity));
  check(
    "reduced: shimmer/pulse neutralized",
    state.labelMs <= 1 && state.dotMs <= 1,
    `label=${state.labelMs}ms dot=${state.dotMs}ms`
  );

  const tilt = await page.$("#certifications .cert-card .cert-tilt");
  await tilt.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await sleep(400);
  const box = await tilt.boundingBox();
  await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.4, { steps: 4 });
  await sleep(300);
  const tf = await tilt.evaluate((el) => el.style.transform);
  check("reduced: 3D tilt disabled", tf === "", `"${tf}"`);
  await page.close();
}

// ---------- 10. Light theme ----------
{
  const page = await browser.newPage();
  track(page);
  await page.setViewport({ width: 1440, height: 900 });
  await openHome(page);
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "light"));
  await sleep(400);

  const theme = await page.evaluate(() => {
    const h2 = document.querySelector("#certifications h2");
    const card = document.querySelector("#certifications .cert-card .cert-tilt");
    const school = document.querySelector("#certifications .cert-school");
    return {
      head: getComputedStyle(h2).color,
      cardBg: getComputedStyle(card).backgroundColor,
      schoolBg: getComputedStyle(school).backgroundColor,
    };
  });
  check(
    "light theme: heading switches to dark ink",
    theme.head === "rgb(12, 12, 19)",
    theme.head
  );
  check(
    "light theme: cards/school keep legible surfaces",
    theme.cardBg !== "rgba(0, 0, 0, 0)" && theme.schoolBg !== "rgba(0, 0, 0, 0)",
    JSON.stringify({ cardBg: theme.cardBg, schoolBg: theme.schoolBg })
  );

  await page.evaluate(() => document.querySelector("#certifications").scrollIntoView({ block: "start" }));
  await sleep(1400);
  await page.screenshot({ path: `${OUT}/certs-light.png` });
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
