// my own harness (verify_claims)
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
const SRC = require('path').join(__dirname, 'head', 'index.html');
const PREV = path.join(__dirname, 'vpreview.html');
const body = fs.readFileSync(SRC, 'utf8');
fs.writeFileSync(PREV, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>body{margin:0;font:14px system-ui}[hidden]{display:none!important}</style></head><body>' + body + '</body></html>');
let browser;
async function open(state) {
  if (!browser) browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  page.errs = [];
  page.on('pageerror', (e) => page.errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') page.errs.push('CONSOLE ' + m.text()); });
  await page.goto(pathToFileURL(PREV).href);
  await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), state || {});
  await page.reload();
  await page.waitForTimeout(400);
  return page;
}
async function settle(page, ms = 90000) {
  const t0 = Date.now();
  await page.waitForTimeout(200);
  while (Date.now() - t0 < ms) {
    const t = await page.evaluate(() => document.querySelector('#bay').innerText);
    if (!/working it out|Working out/i.test(t)) return true;
    await page.waitForTimeout(250);
  }
  return false;
}
async function text(page) {
  await page.evaluate(() => document.querySelectorAll('#bay details').forEach((d) => { d.open = true; }));
  return page.evaluate(() => document.querySelector('#bay').innerText);
}
async function sel(page, id, v) { await page.selectOption(id, v); await page.waitForTimeout(200); await settle(page); }
async function check(page, id) { await page.evaluate(() => { document.querySelector('#comic-setup').open = true; }); await page.click(id); await page.waitForTimeout(200); await settle(page); }
async function close() { if (browser) await browser.close(); }
module.exports = { open, settle, text, sel, check, close };
