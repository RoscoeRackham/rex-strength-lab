// Render the page with a saved state and return bay texts.
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB2/brief';
function wrap(distPath, name) {
  const html = fs.readFileSync(distPath, 'utf8');
  const out = path.join(S, 'pages', name + '.html');
  fs.writeFileSync(out, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  return pathToFileURL(out).href;
}
async function open(opts) {
  opts = opts || {};
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const url = wrap(opts.dist || path.join(S, 'repo/rex-strength-lab/dist/index.html'), opts.name || 'branch');
  const page = await browser.newPage({ viewport: { width: opts.w || 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(url);
  return { browser, page, errs, url };
}
async function load(ctx, state) {
  const { page } = ctx;
  await page.evaluate((s) => { localStorage.clear(); if (s) localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, state || null);
  await page.reload();
  await settle(page);
}
async function settle(page, ms) {
  const t0 = Date.now();
  await page.waitForTimeout(300);
  while (Date.now() - t0 < (ms || 60000)) {
    const busy = await page.evaluate(() => /working it out|Working out/i.test(document.body.innerText));
    if (!busy) break;
    await page.waitForTimeout(300);
  }
  await page.waitForTimeout(200);
}
async function texts(page) {
  return page.evaluate(() => { for (const d of document.querySelectorAll('#bay details, #duo-bay details')) d.open = true; return { solo: document.getElementById('bay').innerText, duo: document.getElementById('duo').open ? document.getElementById('duo-bay').innerText : null }; });
}
async function pickEffort(page, sel, value) {
  await page.selectOption(sel, value);
  await settle(page);
}
module.exports = { open, load, settle, texts, pickEffort, S };
