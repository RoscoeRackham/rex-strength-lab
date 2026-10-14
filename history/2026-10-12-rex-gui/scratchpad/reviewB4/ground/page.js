// usage: node page.js '<json state>' [effort] [duo] -> prints bay text
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB4/ground/';
module.exports = async function show(state, opts = {}) {
  const body = fs.readFileSync(S + 'copy/rex-strength-lab/dist/index.html', 'utf8');
  const prev = S + 'preview.html';
  if (!fs.existsSync(prev)) fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate((st) => { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); }, state);
  await page.reload();
  await page.waitForTimeout(1500);
  if (opts.effort) { await page.selectOption('#effort', opts.effort); }
  if (opts.duoEffort) { await page.selectOption('#duo-effort', opts.duoEffort); }
  for (let i = 0; i < 120; i++) {
    const t = await page.evaluate(() => document.body.innerText);
    if (!/working it out|Working out/.test(t)) break;
    await page.waitForTimeout(1000);
  }
  await page.waitForTimeout(500);
  const sel = opts.sel || (opts.duo ? '#duo-bay' : '#bay');
  const text = await page.evaluate((s) => { const n = document.querySelector(s); return n ? n.innerText : document.body.innerText; }, sel);
  const eff = await page.evaluate(() => { const n = document.querySelector('#effort-box, .effort-box, #effort-readout'); return n ? n.innerText : ''; });
  if (opts.shot) await page.screenshot({ path: S + opts.shot, fullPage: true });
  await browser.close();
  return { text, eff, errs };
};
