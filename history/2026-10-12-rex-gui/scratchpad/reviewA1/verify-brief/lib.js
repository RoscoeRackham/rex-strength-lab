const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const DIR = __dirname;
async function launch() { return chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
async function openPage(browser, which, saved, vp = { width: 1280, height: 900 }) {
  const ctx = await browser.newContext({ viewport: vp });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  if (saved) await ctx.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', s); } catch (e) {} }, JSON.stringify(saved));
  await page.goto('file://' + path.join(DIR, 'pages', which + '.html'));
  await page.waitForTimeout(500);
  return { ctx, page, errors };
}
async function waitIdle(page, sel, ms = 20000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const busy = await page.evaluate((s) => { const el = document.querySelector(s); return !el || /working it out|Working it out/i.test(el.innerText); }, sel);
    if (!busy) break;
    await page.waitForTimeout(250);
  }
  await page.waitForTimeout(300);
}
module.exports = { launch, openPage, waitIdle };
