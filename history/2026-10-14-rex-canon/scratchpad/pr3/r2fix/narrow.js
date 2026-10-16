// the new texts' states at 390 px, light and dark: no sideways scroll, no NaN/undefined/Infinity, no page errors
const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = '/home/user/rex-strength-lab/rex-strength-lab';
const states = [
  { saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, logKg: 16, cLogD: 4.5, airAbsorb: 0.999, __e: 'allout' },
  { saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, inf: true, cLogD: 4.5, __e: 'allout' },
  { saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, logKg: 34, cLogD: 4.5, __e: 'allout' },
  { saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'easy', cMiss: true, logKg: 7, cLogD: 3.5, __e: 'least' },
  { saveV: 3, duoOpen: true, duoAction: 'catch', cObj: 'person', cStyle: 'hard', cMiss: true, logKg: 16, cLogD: 4.5, __e: 'allout' },
  { saveV: 3, action: 'throw', obj: 'person', logKg: 9.15, surface: 'granite', __e: 'allout' },
  { saveV: 3, action: 'throw', obj: 'person', logKg: 9.15, surface: 'ice', __e: 'allout' },
  { saveV: 3, action: 'throw', obj: 'person', surface: 'steel', __e: 'least' },
  { saveV: 3, action: 'throw', obj: 'person', logKg: 5.5, angle: 0, __e: 'allout' },
];
(async () => {
  const body = fs.readFileSync(path.join(ROOT, 'dist', 'index.html'), 'utf8');
  const prev = path.join(__dirname, 'narrow2.html');
  fs.writeFileSync(prev, '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body>' + body + '</body></html>');
  const { settle } = require(path.join(ROOT, 'test', 'make-page-fixture.js'));
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  let bad = 0;
  for (const scheme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, colorScheme: scheme });
    const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto(pathToFileURL(prev).href);
    for (const st0 of states) {
      const { __e, ...st } = st0;
      await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay');
      const duo = !!st.duoOpen; if (duo) await settle(page, 'duo-bay');
      await page.selectOption(duo ? '#duo-effort' : '#effort', __e); await page.waitForTimeout(400); await settle(page, duo ? 'duo-bay' : 'bay');
      const t = await page.evaluate(() => document.body.innerText), ov = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      const b = (t.match(/NaN|undefined|Infinity/g) || []);
      console.log(scheme, JSON.stringify(st).slice(0, 90), 'overflow', ov, 'bad', b.length);
      if (ov > 0 || b.length) bad++;
    }
    if (errs.length) { bad++; console.log('errors', errs); }
    await page.close();
  }
  await browser.close();
  console.log(bad ? 'PROBLEMS ' + bad : 'all clean');
})();
