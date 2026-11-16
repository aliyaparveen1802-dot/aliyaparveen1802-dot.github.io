/* eslint-disable no-console */
import puppeteer from "puppeteer-core";
import { mkdirSync } from "node:fs";

const EDGE =
  process.env.EDGE_PATH ||
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const BASE = "https://skyvoyage-pi.vercel.app";
const OUT = "C:\\Users\\aliya\\OneDrive\\Desktop\\vs code\\portfolio\\public\\screenshots";

mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: true,
  args: ["--no-sandbox", "--hide-scrollbars"],
});

const errors = [];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// --- authentication (localStorage is shared across tabs in this context) ---
const authPage = await browser.newPage();
authPage.on("pageerror", (e) => errors.push(`[pageerror] ${e.message}`));
await authPage.setViewport({ width: 1440, height: 900 });
await authPage.goto(`${BASE}/login`, { waitUntil: "domcontentloaded", timeout: 60000 });
await wait(3000);
await authPage.evaluate(() => {
  const btn = Array.from(document.querySelectorAll("button, a")).find((el) =>
    /demo account/i.test(el.textContent || "")
  );
  btn?.click();
});
await wait(5000);
const loggedIn = await authPage.evaluate(() =>
  Boolean(localStorage.getItem("skyvoyage_token"))
);
console.log("logged in:", loggedIn);
await authPage.close();

async function shot(name, url, opts = {}) {
  const {
    scroll = 0,
    width = 1440,
    height = 900,
    waitMs = 3500,
    action = null,
    expect = null,
  } = opts;

  // a fresh tab per screenshot avoids stale compositor frames
  const page = await browser.newPage();
  page.on("pageerror", (e) => errors.push(`[${name}] ${e.message}`));
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(`${BASE}${url}`, { waitUntil: "domcontentloaded", timeout: 60000 });

  let settled = false;
  for (let i = 0; i < 40; i++) {
    await wait(500);
    const state = await page.evaluate(() => ({
      path: window.location.pathname,
      login: /Welcome back/.test(document.body.innerText || ""),
      len: (document.body.innerText || "").length,
    }));
    if (!/^\/login/.test(state.path) && !state.login && state.len > 400) {
      settled = true;
      break;
    }
  }
  if (!settled) console.log("  !! settle timeout for", name);
  await wait(waitMs);

  if (action) {
    const ok = await page.evaluate(action);
    console.log(`  action(${name}):`, ok);
    await wait(3000);
  }

  if (scroll) {
    await page.evaluate((y) => window.scrollTo(0, y), scroll);
    await wait(1400);
  }

  const finalUrl = page.url();
  if (/\/login/.test(finalUrl)) {
    console.log("  !! on login for", name, "- skipped");
    await page.close();
    return;
  }

  if (expect) {
    let ok = false;
    for (let i = 0; i < 20; i++) {
      const text = await page.evaluate(() => document.body.innerText || "");
      if (expect.test(text)) {
        ok = true;
        break;
      }
      await wait(700);
    }
    if (!ok) console.log(`  !! content mismatch for ${name}:`, expect);
  }

  const heading = await page.evaluate(() => {
    const h = document.querySelector("h1, h2");
    return (h?.textContent || "").trim().replace(/\s+/g, " ").slice(0, 70);
  });

  await page.evaluate(
    () =>
      new Promise((res) =>
        requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(res, 200)))
      )
  );
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log("saved", name, "->", finalUrl, "| heading:", heading);
  await page.close();
}

// Desktop
await shot("sv-home", "/", { expect: /Your Journey Starts Here/ });
await shot("sv-search", "/search", { expect: /Trending routes/ });
await shot("sv-results", "/", {
  expect: /Flexible on dates/,
  action: () => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) =>
      /search flights/i.test(b.textContent || "")
    );
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  },
  waitMs: 4000,
});
await shot("sv-guide", "/airport-guide", { expect: /Waiting time & airport information/ });
await shot("sv-guide-scroll", "/airport-guide", {
  scroll: 780,
  expect: /Explore your airport/,
});
await shot("sv-map", "/airport-explorer", { expect: /Airport explorer/ });
await shot("sv-map-scroll", "/airport-explorer", { scroll: 700, expect: /Airport explorer/ });
await shot("sv-tracking", "/flight-tracking", { expect: /Flight tracking/ });
await shot("sv-tracking-scroll", "/flight-tracking", { scroll: 750, expect: /Flight tracking/ });
await shot("sv-dashboard", "/dashboard");
await shot("sv-trips", "/my-trips/DEMO7A", { expect: /Outbound/ });
await shot("sv-route", "/airport-guide", {
  waitMs: 4000,
  expect: /Explore your airport/,
  action: () => {
    const link = Array.from(document.querySelectorAll("a, button")).find((el) =>
      /^Directions/i.test((el.textContent || "").trim())
    );
    if (link) {
      link.click();
      return true;
    }
    return false;
  },
});
await shot("sv-onboarding", "/onboarding");

// Mobile
await shot("sv-home-mobile", "/", { width: 390, height: 844, expect: /Your Journey Starts Here/ });
await shot("sv-search-mobile", "/search", { width: 390, height: 844, expect: /Trending routes/ });
await shot("sv-guide-mobile", "/airport-guide", {
  width: 390,
  height: 844,
  expect: /Waiting time/,
});
await shot("sv-map-mobile", "/airport-explorer", {
  width: 390,
  height: 844,
  expect: /Airport explorer/,
});
await shot("sv-tracking-mobile", "/flight-tracking", {
  width: 390,
  height: 844,
  expect: /Flight tracking/,
});

console.log("ERRORS:", errors.length ? errors.join("\n") : "none");
await browser.close();
