const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
const body = fs.readFileSync(S + '/lab/dist/index.html', 'utf8');
const prev = S + '/preview.html';
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
async function open(browser, st, opts) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
  await page.reload();
  await page.waitForTimeout(1500);
  page.errs = errs;
  return page;
}
async function waitDone(page, sel) {
  for (let i = 0; i < 120; i++) {
    const t = await page.evaluate((s) => document.querySelector(s) ? document.querySelector(s).innerText : '', sel);
    if (!/working it out|Working out/i.test(t)) return t;
    await page.waitForTimeout(500);
  }
  return await page.evaluate((s) => document.querySelector(s).innerText, sel);
}
module.exports = { open, waitDone, chromium };
