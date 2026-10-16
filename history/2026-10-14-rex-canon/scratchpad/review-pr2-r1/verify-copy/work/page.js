// usage: node page.js '<json state>' [actions json]
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const W = '/tmp/claude-0/-home-user-rex-strength-lab/be83ea46-0fb6-5f45-86e4-061daa8f7429/scratchpad/review-pr2-r1/verify-copy';
const body = fs.readFileSync(W + '/repo/rex-strength-lab/dist/index.html', 'utf8');
const prev = W + '/work/preview.html';
fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
(async () => {
  const st = JSON.parse(process.argv[2] || '{}');
  const acts = JSON.parse(process.argv[3] || '[]');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({ saveV: 2 }, s))); }, st);
  await page.reload();
  const wait = async () => { for (let i = 0; i < 200; i++) { await page.waitForTimeout(300); const t = await page.evaluate(() => document.body.innerText); if (!/working it out|Working out/.test(t)) return; } };
  await wait();
  for (const a of acts) {
    if (a.select) await page.selectOption(a.select, a.value);
    if (a.slider) await page.evaluate(([id, v]) => { const s = document.getElementById(id); s.value = v; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); }, [a.slider, a.value]);
    if (a.click) await page.evaluate((s) => document.querySelector(s).click(), a.click);
    if (a.open) await page.evaluate((id) => { document.getElementById(id).open = true; }, a.open);
    await page.waitForTimeout(500);
    await wait();
  }
  const sel = process.argv[4] || '#duo-bay';
  const t = await page.evaluate((s) => { const n = document.querySelector(s); return n ? n.innerText : document.body.innerText; }, sel);
  console.log(t);
  if (errs.length) console.log('ERRORS', errs);
  await browser.close();
})();
