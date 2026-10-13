const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const ROOT = process.env.ROOT;
const body = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
const prev = path.join(process.env.S, 'preview.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}img{max-width:100%}</style></head><body>' + body + '</body></html>');
const { settle } = require(path.join(ROOT, 'test', 'make-page-fixture.js'));
module.exports = async function open(w, scheme) {
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: w || 1280, height: 900 }, colorScheme: scheme || 'light' });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  const load = async (st, allout) => {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(600); await settle(page, 'bay');
    if (allout) { await page.selectOption('#effort', 'allout'); await page.waitForTimeout(400); await settle(page, 'bay'); }
  };
  const bayText = () => page.evaluate(() => document.getElementById('bay').innerText);
  const tiles = () => page.evaluate(() => Array.from(document.querySelectorAll('#bay .tile')).map((t) => [(t.querySelector('.k') || {}).textContent, (t.querySelector('.v') || {}).textContent, (t.querySelector('.s, .sub') || {}).textContent].join(' | ')));
  return { browser, page, errs, load, bayText, tiles, settle };
};
