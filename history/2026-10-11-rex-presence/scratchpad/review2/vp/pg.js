const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const url = 'file://' + path.resolve(__dirname, 'prev.html');
// usage: node pg.js '<state json>' effortValue [grep regex] [extra js]
(async () => {
  const st = JSON.parse(process.argv[2]); const eff = process.argv[3]; const re = process.argv[4] ? new RegExp(process.argv[4], 'i') : null;
  const extra = process.argv[5];
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto(url);
  await pg.evaluate((s) => { const cur = JSON.parse(localStorage.getItem('rex-lab-v1') || '{}'); localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign(cur, s))); }, st);
  await pg.reload(); await pg.waitForTimeout(1500);
  if (eff) { await pg.selectOption('#effort', eff); }
  if (extra) await pg.evaluate(extra);
  await pg.waitForTimeout(4000);
  const t = await pg.evaluate(() => document.querySelector('#bay').innerText);
  const lines = t.split('\n').filter(x => x.trim());
  for (const l of lines) if (!re || re.test(l)) console.log('|', l);
  if (errs.length) console.log('ERRS', errs);
  await b.close();
})();
