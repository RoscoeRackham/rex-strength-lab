// Shared harness: wrap a build in a page and open it with a given saved state.
const fs = require('fs');
const path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
function wrap(src, out) {
  const html = fs.readFileSync(src, 'utf8');
  fs.writeFileSync(out, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  return 'file://' + out;
}
const NEW = wrap(path.join(S, 'proj/rex-strength-lab/dist/index.html'), path.join(S, 'new.html'));
const OLD = wrap(path.join(S, 'main.html'), path.join(S, 'old.html'));
async function launch() { return chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
async function open(browser, url, saved, width) {
  const ctx = await browser.newContext({ viewport: { width: width || 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript((s) => { try { localStorage.clear(); if (s) localStorage.setItem('rex-lab-v1', JSON.stringify(s)); } catch (e) {} }, saved || null);
  await page.goto(url);
  await page.waitForTimeout(400);
  page.errs = errs;
  return page;
}
async function settle(page, sel, ms) {
  const t0 = Date.now();
  while (Date.now() - t0 < (ms || 30000)) {
    const busy = await page.evaluate((s) => { const b = document.querySelector(s); return !b || /working it out/i.test(b.textContent); }, sel || '#bay');
    if (!busy) return true;
    await page.waitForTimeout(250);
  }
  return false;
}
module.exports = { NEW, OLD, launch, open, settle, S };
