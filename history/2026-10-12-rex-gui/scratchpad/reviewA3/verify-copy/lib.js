const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const DIR = __dirname;
function wrap(src, out) {
  const html = fs.readFileSync(path.join(DIR, src), 'utf8');
  fs.writeFileSync(path.join(DIR, out), '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  return 'file://' + path.join(DIR, out);
}
const URLS = { branch: wrap('branch-dist.html', 'branch.html'), main: wrap('main-dist.html', 'main.html') };
async function open(browser, which, st, opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.addInitScript((s) => { if (!sessionStorage.getItem('done')) { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); sessionStorage.setItem('done', '1'); } }, st);
  await page.goto(URLS[which]);
  await page.waitForTimeout(800);
  page.errs = errs;
  return { ctx, page };
}
async function settle(page, sel, ms = 600) {
  let last = '', same = 0;
  for (let i = 0; i < 200; i++) {
    const t = await page.evaluate((s) => (document.querySelector(s) || {}).innerText || '', sel);
    if (t === last && t.length > 0) { if (++same >= 3) return t; } else same = 0;
    last = t; await page.waitForTimeout(ms / 3);
  }
  return last;
}
module.exports = { chromium, open, settle, launch: () => chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }) };
