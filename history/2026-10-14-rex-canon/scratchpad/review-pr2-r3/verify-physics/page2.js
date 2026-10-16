const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { readResult, settle } = require(__dirname + '/repo/rex-strength-lab/test/make-page-fixture.js');
const which = process.argv[2];
const src = which === 'fix' ? __dirname + '/fix/repo/rex-strength-lab/dist/index.html' : __dirname + '/repo/rex-strength-lab/dist/index.html';
const f = path.join(__dirname, 'wrap2-' + which + '.html');
fs.writeFileSync(f, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + fs.readFileSync(src, 'utf8') + '</body></html>');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(pathToFileURL(f).href);
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ duoOpen: true, duoAction: 'catch', cObj: 'car', cStyle: 'easy', cLogD: Math.log10(30) })));
  await page.reload(); await page.waitForTimeout(1200); await settle(page, 'duo-bay');
  await page.evaluate(() => document.getElementById('o-own').click()); await page.waitForTimeout(500);
  await page.evaluate(() => { const r = document.getElementById('o-strength'); r.value = '3.301'; r.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForTimeout(1500); await settle(page, 'duo-bay');
  const opts = await page.evaluate(() => Array.from(document.querySelectorAll('#duo-effort option')).map(o => o.value)); console.log('options', opts);
  for (const p of (process.argv[3] ? process.argv[3].split(',') : ['least', 'allout'])) {
    if (p !== 'least') { await page.selectOption('#duo-effort', p); await page.waitForTimeout(500); await settle(page, 'duo-bay'); }
    const r = await readResult(page, 'duo-bay');
    console.log('=====', which, p, 'ollie dial:', await page.evaluate(() => document.getElementById('o-big').textContent));
    console.log(JSON.stringify(r, null, 1));
  }
  console.log('errors', errs);
  await b.close();
})();
