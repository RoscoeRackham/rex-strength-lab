const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const S = __dirname;
function wrap(src, name) {
  const body = fs.readFileSync(src, 'utf8');
  const out = path.join(S, name);
  fs.writeFileSync(out, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}[hidden]{display:none!important}</style></head><body>' + body + '</body></html>');
  return pathToFileURL(out).href;
}
async function open(url, state, opts = {}) {
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: opts.w || 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  if (opts.init) await page.addInitScript(opts.init, opts.initArg);
  await page.goto(url);
  await page.evaluate((s) => { localStorage.clear(); if (s) localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, state);
  await page.reload();
  await page.waitForTimeout(opts.wait || 3000);
  return { browser, page, errs };
}
module.exports = { wrap, open, S };
