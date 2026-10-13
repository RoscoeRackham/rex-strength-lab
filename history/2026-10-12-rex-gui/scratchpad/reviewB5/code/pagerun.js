// node pagerun.js '<json state>' [selectEffort] [duo] : loads the page with the state, prints the bay text
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const S = __dirname;
const html = fs.readFileSync(process.env.PAGE || '/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
const file = path.join(S, 'page.html');
fs.writeFileSync(file, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(file).href);
  const st = JSON.parse(process.argv[2]);
  const duo = process.argv[4] === 'duo';
  await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
  await page.reload(); await page.waitForTimeout(800);
  const bay = duo ? 'duo-bay' : 'bay';
  const settle = async () => { for (let i = 0; i < 240; i++) { const busy = await page.evaluate((id) => /working it out|Working out/i.test(document.getElementById(id).textContent), bay); if (!busy) return; await page.waitForTimeout(250); } console.log('STILL BUSY'); };
  await settle();
  if (process.argv[3] && process.argv[3] !== '-') { await page.selectOption(duo ? '#duo-effort' : '#effort', process.argv[3]); await page.waitForTimeout(400); await settle(); }
  const t = await page.evaluate((id) => { const b = document.getElementById(id); b.querySelectorAll('details').forEach((d) => d.open = true); return b.innerText; }, bay);
  console.log(t);
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
})();
