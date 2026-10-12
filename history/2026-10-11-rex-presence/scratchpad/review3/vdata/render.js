// usage: node render.js '<state json>' [effort] [extra-js]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const body = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
const prev = path.join(__dirname, 'preview.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui}[hidden]{display:none!important}</style></head><body>' + body + '</body></html>');
(async () => {
  const st = JSON.parse(process.argv[2] || '{}');
  const effort = process.argv[3];
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); } catch (e) {} }, st);
  await page.goto(pathToFileURL(prev).href);
  await page.waitForTimeout(2500);
  if (effort) { await page.selectOption('#effort', effort); await page.waitForTimeout(3000); }
  if (process.argv[4]) { await page.evaluate(process.argv[4]); await page.waitForTimeout(3000); }
  // wait until not "working it out"
  for (let i = 0; i < 30; i++) { const t = await page.evaluate(() => document.body.innerText); if (!/working it out|Working out/i.test(t)) break; await page.waitForTimeout(1000); }
  const t = await page.evaluate(() => { const b = (document.querySelector('#bay') || document.body).cloneNode(true); b.querySelectorAll('script,style').forEach((x) => x.remove()); b.querySelectorAll('details').forEach(d=>d.open=true); return b.innerText || b.textContent; });
  const tc = await page.evaluate(() => { const b = (document.querySelector('#bay') || document.body).cloneNode(true); b.querySelectorAll('script,style').forEach((x) => x.remove()); return b.textContent; });
  console.log(tc.replace(/\s+\n/g, '\n'));
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
})();
