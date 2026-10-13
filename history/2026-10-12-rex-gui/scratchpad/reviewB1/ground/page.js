// usage: node page.js '<json state>' [selector-to-print] [waitSeconds]
const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const html = fs.readFileSync('/home/user/rex-strength-lab/rex-strength-lab/dist/index.html', 'utf8');
const wrap = path.join(__dirname, 'wrap.html');
fs.writeFileSync(wrap, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + html + '</body></html>');
(async () => {
  const st = JSON.parse(process.argv[2] || '{}');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push(String(e)));
  await page.addInitScript((s) => { try { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); } catch (e) {} }, st);
  await page.goto('file://' + wrap);
  const extra = process.argv[4] ? JSON.parse(process.argv[4]) : null;
  if (extra && extra.effort) { await page.waitForTimeout(500); await page.selectOption('#effort', extra.effort); }
  if (extra && extra.duoEffort) { await page.waitForTimeout(500); await page.selectOption('#duo-effort', extra.duoEffort); }
  for (let i = 0; i < 120; i++) {
    await page.waitForTimeout(500);
    const t = await page.evaluate(() => document.body.innerText);
    if (!/working it out|Working out/.test(t)) break;
  }
  const sel = process.argv[3] || 'body';
  const txt = await page.evaluate((s) => Array.from(document.querySelectorAll(s)).map((e) => e.innerText).join('\n-----\n'), sel);
  console.log(txt);
  if (errs.length) console.log('CONSOLE ERRORS:', errs);
  await page.screenshot({ path: path.join(__dirname, (process.argv[5] || 'shot') + '.png'), fullPage: false });
  await browser.close();
})();
