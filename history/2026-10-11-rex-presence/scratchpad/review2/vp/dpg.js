const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const url = 'file://' + path.resolve(__dirname, 'prev.html');
(async () => {
  const st = JSON.parse(process.argv[2]); const re = process.argv[3] ? new RegExp(process.argv[3], 'i') : null;
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; pg.on('pageerror', e => errs.push(e.message));
  await pg.goto(url);
  await pg.evaluate((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, st);
  await pg.reload(); await pg.waitForTimeout(12000);
  const t = await pg.evaluate(() => document.querySelector('#bay').innerText);
  for (const l of t.split('\n').filter(x => x.trim())) if (!re || re.test(l)) console.log('|', l);
  if (errs.length) console.log('ERRS', errs);
  await b.close();
})();
