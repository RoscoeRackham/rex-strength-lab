// usage: node page.js '<json state>' <bay: duo|solo> <effort id or ''> [custom js]
const fs = require('fs'), path = require('path');
const { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
const html = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
const prev = path.join(S, 'preview.html');
if (!fs.existsSync(prev)) fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
(async () => {
  const st = JSON.parse(process.argv[2] || '{}');
  const bay = process.argv[3] || 'duo';
  const eff = process.argv[4] || '';
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate((s) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
  await page.reload();
  await page.waitForTimeout(800);
  const id = bay === 'duo' ? '#duo-bay' : '#bay';
  const sel = bay === 'duo' ? '#duo-effort' : '#effort';
  const wait = async () => {
    for (let i = 0; i < 600; i++) {
      const t = await page.evaluate((id) => document.querySelector(id).innerText, id);
      if (!/working it out|Working out/.test(t)) return;
      await page.waitForTimeout(250);
    }
  };
  await wait();
  if (eff) { await page.selectOption(sel, eff); await page.waitForTimeout(300); await wait(); }
  if (process.argv[5]) { await page.evaluate(process.argv[5]); await page.waitForTimeout(300); await wait(); }
  const t = await page.evaluate((id) => document.querySelector(id).innerText, id);
  console.log(t);
  if (errs.length) console.log('ERRORS:', errs);
  await browser.close();
})();
