const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1800 } });
  const url = 'file:///home/user/dino-strength-sim/dist/preview.html';
  const cases = [
    { name: 'hulk-car-90', st: { logKg: Math.log10(90718.474), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'car', angle: 90 } },
    { name: 'hulk-car-89', st: { logKg: Math.log10(90718.474), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'car', angle: 89 } },
    { name: '1e3-baseball-90', st: { logKg: 3, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'baseball', angle: 90 } },
    { name: 'human-baseball-90', st: { logKg: Math.log10(511), inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'baseball', angle: 90 } },
    { name: 'hulk-car-90-real', st: { logKg: Math.log10(90718.474), inf: false, mode: 'real', surface: 'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'throw', obj: 'car', angle: 90 } },
  ];
  for (const c of cases) {
    await page.goto(url);
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), c.st);
    await page.goto(url);
    await page.waitForTimeout(1200);
    const txt = await page.evaluate(() => {
      const bay = document.querySelector('.verdict') ? document.querySelector('.verdict').closest('section, .bay, div') : null;
      const v = [...document.querySelectorAll('.verdict')].map(e => e.textContent);
      const tiles = [...document.querySelectorAll('.tile')].map(e => e.innerText.replace(/\n/g, ' | '));
      const st = [...document.querySelectorAll('.status')].map(e => e.textContent);
      const hp = [...document.querySelectorAll('.happens li')].map(e => e.textContent);
      const ticks = [...document.querySelectorAll('svg text')].map(e => e.textContent).filter(t => /mm|m$|km/.test(t)).slice(0, 20);
      const label = document.querySelector('label[for=angle]') ? document.querySelector('label[for=angle]').textContent : null;
      return { label, v, st, tiles, hp, ticks };
    });
    console.log('=== ' + c.name);
    console.log(JSON.stringify(txt, null, 1));
    await page.screenshot({ path: '/tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/m5/' + c.name + '.png', fullPage: false });
  }
  await browser.close();
})();
