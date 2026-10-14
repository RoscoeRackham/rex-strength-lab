const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
function wrap(which) {
  const html = fs.readFileSync(path.join(S, which, 'rex-strength-lab/dist/index.html'), 'utf8');
  const out = path.join(S, 'page-' + which + '.html');
  fs.writeFileSync(out, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  return 'file://' + out;
}
async function open(which, saved, opts) {
  opts = opts || {};
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: opts.width || 1280, height: 900 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(String(e)));
  const url = wrap(which);
  await page.goto(url);
  if (saved) {
    await page.evaluate((s) => { const old = JSON.parse(localStorage.getItem('rex-lab-v1') || '{}'); localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign(old, s))); }, saved);
    await page.goto(url);
  }
  await page.waitForTimeout(500);
  return { browser, page, errs };
}
async function settle(page, sel, ms) {
  const t0 = Date.now();
  while (Date.now() - t0 < (ms || 120000)) {
    const t = await page.evaluate((s) => (document.querySelector(s) || document.body).innerText, sel || 'body');
    if (!/working it out|Working out/.test(t)) return t;
    await page.waitForTimeout(500);
  }
  return 'TIMEOUT';
}
module.exports = { open, settle };
