// usage: node page.js '<state json>' [effortValue] [duoEffortValue] [sel]
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const R = '/tmp/claude-0/-home-user-rex-strength-lab/70d4d2aa-c3a8-5eb5-9c7c-1c92e3162d09/scratchpad/reviewB1/verify-copy/repo/rex-strength-lab';
const W = path.join(__dirname, 'wrap.html');
if (!fs.existsSync(W) || fs.statSync(W).mtimeMs < fs.statSync(R + '/dist/index.html').mtimeMs)
  fs.writeFileSync(W, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(R + '/dist/index.html', 'utf8') + '</body></html>');
async function run(state, opts = {}) {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); page.on('pageerror', e => errs.push(String(e)));
  await page.addInitScript((s) => { if (!sessionStorage.getItem('done')) { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); sessionStorage.setItem('done', '1'); } }, state);
  await page.goto('file://' + W);
  await page.waitForTimeout(500);
  const waitDone = async () => { for (let i = 0; i < 600; i++) { const t = await page.evaluate(() => document.body.innerText); if (!/working it out|Working out/.test(t)) return; await page.waitForTimeout(250); } };
  await waitDone();
  if (opts.effort) { await page.selectOption('#effort', opts.effort); await page.waitForTimeout(300); await waitDone(); }
  if (opts.duoEffort) { await page.selectOption('#duo-effort', opts.duoEffort); await page.waitForTimeout(300); await waitDone(); }
  if (opts.eval) await page.evaluate(opts.eval);
  await page.waitForTimeout(300); await waitDone();
  const out = {};
  for (const sel of (opts.sel || ['#bay', '#duo-bay'])) out[sel] = await page.evaluate((s) => { const e = document.querySelector(s); return e ? e.innerText : null; }, sel);
  out.errs = errs;
  await browser.close();
  return out;
}
module.exports = { run };
if (require.main === module) {
  const st = JSON.parse(process.argv[2]); const opts = process.argv[3] ? JSON.parse(process.argv[3]) : {};
  run(st, opts).then(o => { for (const k of Object.keys(o)) { console.log('=== ' + k); console.log(typeof o[k] === 'string' ? o[k] : JSON.stringify(o[k])); } });
}
