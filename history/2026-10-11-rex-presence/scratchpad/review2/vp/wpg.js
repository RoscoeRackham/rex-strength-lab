const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const url = 'file://' + path.resolve(__dirname, 'prev.html');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const pg = await b.newPage({ viewport: { width: 1280, height: 900 } });
  await pg.goto(url);
  for (const sid of ['sand', 'stiffclay']) {
    await pg.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'walk', group: 'solo', surface: s, walker: 'rex', pace: 'walk' })), sid);
    await pg.reload(); await pg.waitForTimeout(1200);
    for (const v of ['0', '1']) {
      await pg.$eval('#step-effort', (e, v) => { e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, v);
      await pg.waitForTimeout(800);
      const t = await pg.evaluate(() => document.querySelector('#bay').innerText);
      console.log(sid, 'effort', v, t.split('\n').filter(l => /footprint|sinks|stuck|breaks the surface|Effort per step/i.test(l)).join(' || '));
    }
  }
  await b.close();
})();
