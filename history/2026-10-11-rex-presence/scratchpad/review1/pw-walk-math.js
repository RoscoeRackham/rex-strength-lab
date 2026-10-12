const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const st of [{ action: 'walk' }, { action: 'walk', H: 50, m: 3007 * Math.pow(50 / 3.048, 3) }, { action: 'walk', build: 'human', H: 2, m: 180 }]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript((st) => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('rex-lab-v1', JSON.stringify(st)); sessionStorage.setItem('seeded', '1'); } }, st);
    await page.goto(pathToFileURL(process.argv[2]).href); await page.waitForTimeout(2500);
    await page.evaluate(() => { const d = [...document.querySelectorAll('#bay details')]; d.forEach((x) => (x.open = true)); });
    const t = await page.evaluate(() => document.querySelector('#bay').textContent);
    const i = t.indexOf('The landing adds a pulse');
    console.log(JSON.stringify(st), '\n   ', t.slice(i, i + 260));
    await page.close();
  }
  await browser.close();
})();
