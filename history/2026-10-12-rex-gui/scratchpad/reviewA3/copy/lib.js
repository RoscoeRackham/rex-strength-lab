const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const HERE = __dirname;
function wrap(src, name) {
  const html = fs.readFileSync(src, 'utf8');
  const out = path.join(HERE, name);
  fs.writeFileSync(out, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  return pathToFileURL(out).href;
}
const NEW = () => wrap(path.join(HERE, 'lab/dist/index.html'), 'new.html');
const MAIN = () => wrap(path.join(HERE, 'main-index.html'), 'main.html');
async function open(browser, url, state, opts) {
  opts = opts || {};
  const page = await browser.newPage({ viewport: { width: opts.w || 1280, height: opts.h || 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(url);
  await page.evaluate((s) => { localStorage.clear(); if (s) localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, state || null);
  await page.reload();
  await page.waitForTimeout(opts.wait || 1500);
  page.errs = errs;
  return page;
}
async function waitSettled(page, sel, ms) {
  const t0 = Date.now();
  while (Date.now() - t0 < (ms || 20000)) {
    const t = await page.evaluate((s) => { const b = document.querySelector(s); return b ? b.innerText : ''; }, sel);
    if (t && !/Working it out|working it out/i.test(t)) { await page.waitForTimeout(300); return t; }
    await page.waitForTimeout(250);
  }
  return page.evaluate((s) => document.querySelector(s).innerText, sel);
}
module.exports = { chromium, CHROME, NEW, MAIN, open, waitSettled, HERE };
