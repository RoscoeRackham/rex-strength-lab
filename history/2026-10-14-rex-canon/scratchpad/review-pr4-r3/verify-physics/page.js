// usage: node page.js '<state json>' '<ollieLogKg or "">' '<effort>' [extra js]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const st = JSON.parse(process.argv[2] || '{}'), oLog = process.argv[3], effort = process.argv[4] || 'least', extra = process.argv[5] || '';
  const html = fs.readFileSync(path.join(__dirname, 'repo/rex-strength-lab/dist/index.html'), 'utf8');
  const f = path.join(__dirname, 'wrap.html');
  fs.writeFileSync(f, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const p = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto(pathToFileURL(f).href);
  await p.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ saveV: 3, duoOpen: true }, s))); }, st);
  await p.reload(); await p.waitForTimeout(1500);
  if (oLog) { await p.evaluate(() => document.getElementById('o-own').click()); await p.waitForTimeout(300); await p.evaluate((v) => { const s = document.getElementById('o-strength'); s.value = v; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, oLog); }
  if (effort !== 'least') { await p.evaluate((v) => { const s = document.getElementById('duo-effort'); s.value = v; s.dispatchEvent(new Event('change', { bubbles: true })); }, effort); }
  if (extra) await p.evaluate(extra);
  for (let i = 0; i < 120; i++) { await p.waitForTimeout(500); const t = await p.evaluate(() => document.getElementById('duo-bay').innerText); if (!/working it out|Working out/i.test(t)) break; }
  const t = await p.evaluate(() => document.getElementById('duo-bay').innerText);
  console.log(t);
  if (errs.length) console.log('ERRORS', errs);
  await b.close();
})();
