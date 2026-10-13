const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
async function open(dist, opts = {}) {
  const body = fs.readFileSync(dist || path.join(S, 'repo/rex-strength-lab/dist/index.html'), 'utf8');
  const wrapped = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>';
  const f = path.join(S, 'page-' + (opts.tag || 'x') + '.html'); fs.writeFileSync(f, wrapped);
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(f).href);
  await page.evaluate((st) => { localStorage.clear(); if (st) localStorage.setItem('rex-lab-v1', JSON.stringify(st)); }, opts.state || null);
  await page.reload();
  await settle(page);
  return { browser, page, errs };
}
async function settle(page, ms = 120000) {
  const t0 = Date.now();
  await page.waitForTimeout(500);
  while (Date.now() - t0 < ms) {
    const busy = await page.evaluate(() => /working it out|Working out/i.test(document.body.innerText));
    if (!busy) return true;
    await page.waitForTimeout(300);
  }
  return false;
}
module.exports = { open, settle };
