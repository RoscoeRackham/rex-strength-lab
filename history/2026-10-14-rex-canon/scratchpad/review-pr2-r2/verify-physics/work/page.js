const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const R='/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r2/verify-physics/repo/rex-strength-lab';
const html = fs.readFileSync(R + '/dist/index.html', 'utf8');
const prev = path.join(__dirname, 'page.html');
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
(async () => {
  const st = JSON.parse(process.argv[2] || '{}');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); page.on('pageerror', e => errs.push(e.message));
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), st);
  await page.reload();
  for (let i = 0; i < 300; i++) { await page.waitForTimeout(200); const t = await page.evaluate(() => document.body.innerText); if (!/working it out|Working out/i.test(t)) break; }
  const sel = process.argv[3] || '#bay';
  const t = await page.evaluate(([sel, tc]) => { const e = document.querySelector(sel) || document.body; if (!tc) return e.innerText; return [...e.querySelectorAll("li,p,div.effort-read,summary")].map(x=>x.textContent).join("\n"); }, [sel, !!process.env.TC]);
  console.log(t);
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
})();
