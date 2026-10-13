const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
const body = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
const prev = path.join(S, 'page.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
async function open(state, opts) {
  opts = opts || {};
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: opts.w || 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate((st) => { localStorage.clear(); if (st) localStorage.setItem('rex-lab-v1', JSON.stringify(st)); }, state);
  await page.reload();
  await settle(page);
  return { browser, page, errs };
}
async function settle(page) {
  await page.waitForTimeout(800);
  for (let i = 0; i < 240; i++) {
    const busy = await page.evaluate(() => /working it out|Working out/.test(document.body.innerText));
    if (!busy) break;
    await page.waitForTimeout(500);
  }
  await page.waitForTimeout(300);
}
module.exports = { open, settle };
