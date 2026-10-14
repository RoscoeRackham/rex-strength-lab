// usage: node page.js '<json state>' '<effort>' [duoEffort] [outname]
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const dir = __dirname;
(async () => {
  const st = JSON.parse(process.argv[2] || '{}');
  const effort = process.argv[3] && process.argv[3] !== '-' ? process.argv[3] : null;
  const duoEffort = process.argv[4] && process.argv[4] !== '-' ? process.argv[4] : null;
  const outname = process.argv[5] || 'out';
  const html = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
  const f = path.join(dir, 'wrap.html');
  fs.writeFileSync(f, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 1600 } });
  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push(String(e)));
  await page.goto('file://' + f);
  await page.evaluate((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
  await page.goto('file://' + f);
  await page.waitForTimeout(500);
  if (effort) { await page.selectOption('#effort', effort); }
  if (duoEffort) { await page.selectOption('#duo-effort', duoEffort); }
  const t0 = Date.now();
  for (let i = 0; i < 240; i++) {
    const txt = await page.evaluate(() => document.body.innerText);
    if (!/working it out|Working out/.test(txt)) break;
    await page.waitForTimeout(500);
  }
  await page.waitForTimeout(300);
  const txt = await page.evaluate(() => document.body.innerText);
  fs.writeFileSync(path.join(dir, outname + '.txt'), txt);
  console.log('waited ms', Date.now() - t0, 'errors', errs);
  await browser.close();
})();
