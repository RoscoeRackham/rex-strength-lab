const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url'), path = require('path');
const U = (n) => pathToFileURL(path.join(__dirname, n + '.html')).href;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(U('pr3'));
  // toggle via UI rather than reload for speed
  await page.evaluate(() => { document.getElementById('powers').open = true; });
  const res = [];
  for (let i = 0; i < 32; i++) {
    const want = { unbreakable: !!(i & 1), ownRecoil: !!(i & 2), keepForm: !!(i & 4), safePassenger: !!(i & 8), air: (i & 16) ? 1 : 0 };
    const s = await page.evaluate((w) => {
      const set = (id, v) => { const e = document.getElementById(id); if (e.checked !== v) { e.checked = v; e.dispatchEvent(new Event('change')); } };
      set('sw-unbreakable', w.unbreakable); set('sw-recoil', w.ownRecoil); set('sw-keep', w.keepForm); set('sw-passenger', w.safePassenger);
      const sl = document.getElementById('air-absorb'); sl.value = String(sl.max == '1' ? w.air : w.air * Number(sl.max)); sl.dispatchEvent(new Event('input')); sl.dispatchEvent(new Event('change'));
      return document.getElementById('powers-sum').textContent + ' || ' + JSON.parse(localStorage.getItem('rex-lab-v1')).airAbsorb;
    }, want);
    res.push(JSON.stringify(want) + ' -> ' + s);
  }
  console.log(res.join('\n'));
  console.log(await page.evaluate(() => { const sl = document.getElementById('air-absorb'); return [sl.min, sl.max, sl.step, sl.value].join(); }));
  console.log('errors', errs);
  await browser.close();
})();
