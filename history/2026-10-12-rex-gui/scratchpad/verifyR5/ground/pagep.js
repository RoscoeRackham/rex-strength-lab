// usage: node page.js '<state json>' [effort] [grep regex] [duo]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname, html = fs.readFileSync(path.join(S, 'labp/dist/index.html'), 'utf8');
const file = path.join(S, 'pagep.html');
if (!fs.existsSync(file)) fs.writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
(async () => {
  const st = JSON.parse(process.argv[2] || '{}'), effort = process.argv[3], re = process.argv[4] ? new RegExp(process.argv[4], 'i') : null, duo = process.argv[5] === 'duo';
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); }); page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(pathToFileURL(file).href);
  await page.evaluate((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
  await page.reload();
  const bay = duo ? '#duo-bay' : '#bay';
  const wait = async () => { for (let i = 0; i < 300; i++) { const t = await page.evaluate((b) => (document.querySelector(b) || document.body).textContent, bay); if (!/working it out/i.test(t)) return; await page.waitForTimeout(200); } };
  await page.waitForTimeout(600); await wait();
  if (effort) { const sel = duo ? '#duo-effort' : '#effort'; await page.selectOption(sel, effort); await page.waitForTimeout(400); await wait(); }
  const text = await page.evaluate((b) => (document.querySelector(b) || document.body).innerText, bay);
  const lines = text.split(/\n+/).filter((l) => !re || re.test(l));
  console.log(lines.join('\n'));
  const bad = text.match(/.{0,80}(NaN|undefined|Infinity).{0,40}/g);
  if (bad) console.log('BAD TOKENS:', bad);
  if (errs.length) console.log('CONSOLE ERRORS:', errs);
  await browser.close();
})();
