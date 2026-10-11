const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const cases = [
    { name: 'Hulk feat', feat: 'Hulk and Thor: Class 100' },
    { name: 'bowling 10^1.5', st: { logKg: 1.5 + 1e-12, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'bowling', angle: 45 } },
    { name: 'car 15.8t', st: { logKg: Math.log10(15800), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'car', angle: 45 } },
    { name: 'jump 10^2.4', st: { logKg: 2.4, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'jump', obj: 'car', angle: 45 } },
    { name: 'kaiju punch 1e6', st: { logKg: 6, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 50, m: 180 * 25 ** 3, action: 'punch', obj: 'car', angle: 45 } },
  ];
  for (const cs of cases) {
    const page = await browser.newPage();
    await page.goto('file:///home/user/dino-strength-sim/dist/index.html');
    await page.evaluate((st) => { localStorage.clear(); if (st) localStorage.setItem('rex-lab-v1', JSON.stringify(st)); }, cs.st || null);
    await page.reload();
    await page.waitForTimeout(1500);
    if (cs.feat) {
      const card = page.locator('button.run').filter({ has: page.locator('xpath=..') });
      await page.evaluate((t) => {
        const art = [...document.querySelectorAll('article.feat')].find((a) => a.querySelector('.t').textContent === t);
        art.querySelector('button.run').click();
      }, cs.feat);
      await page.waitForTimeout(800);
    }
    const out = await page.evaluate(() => {
      const bay = document.querySelector('#bay');
      const verdict = bay.querySelector('.verdict') ? bay.querySelector('.verdict').textContent : '';
      const chips = [...bay.querySelectorAll('.status')].map((s) => s.textContent).join(' | ');
      const happens = [...bay.querySelectorAll('li')].map((s) => s.textContent).join(' || ');
      const eq = bay.querySelector('.math .eq') ? bay.querySelector('.math .eq').textContent : '';
      const dial = document.querySelector('#strength-readout, .readout, output') ? document.querySelector('#strength-readout, .readout, output').textContent : '';
      return { verdict, chips, happens, eq, dial, st: localStorage.getItem('rex-lab-v1') };
    });
    console.log('=== ' + cs.name); console.log(JSON.stringify(out, null, 1));
    await page.close();
  }
  await browser.close();
})();
