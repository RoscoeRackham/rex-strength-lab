const fs = require('fs'), path = require('path');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const f = path.join(__dirname, 'wrap.html');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage();
  await page.goto('file://' + f);
  await page.evaluate(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'throw', obj: 'car', angle: 0, logKg: 9.870 })));
  await page.goto('file://' + f);
  await page.waitForTimeout(500);
  const t0 = Date.now();
  await page.selectOption('#effort', 'allout');
  const ms = await page.evaluate(() => new Promise(r => { const t = performance.now(); requestAnimationFrame(() => r(performance.now() - t)); }));
  console.log('select->next frame ms', Date.now() - t0);
  const v = await page.evaluate(() => { const D = window.DINO_DATA, P = window.DinoPhys; const car = D.objects.find(o => o.id === 'car'); const body = P.makeBody({ build: 'rex', H: 3.048, m: 3007 }); const t = performance.now(); const r = P.throwObject({ F: Math.pow(10, 9.87) * P.K.g, mode: 'comic', body, surface: D.surfaces.find(s => s.id === 'concrete'), anchor: 'friction', airAbsorb: 1, keepForm: true, unbreakable: true, ownRecoil: true, record: true }, car, 0); return [performance.now() - t, r.flight.timedOut]; });
  console.log('in-page throwObject(record) ms, timedOut', v);
  await browser.close();
})();
