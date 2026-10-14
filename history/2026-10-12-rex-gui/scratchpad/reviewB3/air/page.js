// usage: node page.js '<json state>' [effort] [duoEffort] [duo] > out
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
const body = fs.readFileSync(path.join(S, 'lab', 'dist', 'index.html'), 'utf8');
const prev = path.join(S, 'preview.html');
if (!fs.existsSync(prev)) fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
module.exports = async function run(state, opts) {
  opts = opts || {};
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, state);
  await page.reload();
  await page.waitForTimeout(1500);
  const wait = async () => { for (let i = 0; i < 240; i++) { const t = await page.evaluate(() => document.body.innerText); if (!/working it out|Working out/i.test(t)) return; await page.waitForTimeout(500); } };
  await wait();
  if (opts.effort) { await page.selectOption('#effort', opts.effort); await page.waitForTimeout(300); await wait(); }
  if (opts.duo) { await page.evaluate(() => { const d = document.getElementById('duo'); if (!d.open) d.open = true; d.dispatchEvent(new Event('toggle')); }); await page.waitForTimeout(800); await wait(); }
  if (opts.duoEffort) { await page.selectOption('#duo-effort', opts.duoEffort); await page.waitForTimeout(300); await wait(); }
  if (opts.eval) { const r = await page.evaluate(opts.eval); console.log('EVAL', JSON.stringify(r)); }
  // open all details
  await page.evaluate(() => document.querySelectorAll('details').forEach((d) => { d.open = true; }));
  const solo = await page.evaluate(() => (document.getElementById('bay') || {}).innerText || '');
  const duo = await page.evaluate(() => (document.getElementById('duo-bay') || {}).innerText || '');
  if (opts.shot) await page.screenshot({ path: path.join(S, opts.shot), fullPage: true });
  await browser.close();
  return { solo, duo, errs };
};
