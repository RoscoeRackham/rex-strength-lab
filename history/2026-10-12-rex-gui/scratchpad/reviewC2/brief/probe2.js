const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const file = process.argv[2];
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(file).href);
  for (const [m, oM, gb] of [[1e21, 1e21, 4], [1e24, 1e24, 4], [1e26, 1e26, 4], [1e27, 1e27, 4], [1e30, 1e30, 4], [1e33, 1e33, 4], [1e36, 1e36, 4], [3e26, 3e26, 3.5]]) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), { action: 'punch', duoOpen: true, duoAction: 'collide', m, oM, colSrc: 'set', colGB: gb, oSame: false });
    await page.reload(); await page.waitForTimeout(2500);
    const r = await page.evaluate(() => { const b = document.getElementById('duo-bay'); const tiles = b ? Array.from(b.querySelectorAll('.tile')).map((t) => t.innerText.replace(/\s+/g, ' ')).filter((x) => /Energy freed/.test(x)) : ['no duo-bay']; return { tiles, sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }; });
    console.log(m, oM, gb, JSON.stringify(r));
  }
  console.log('errors', JSON.stringify(errs));
  await browser.close();
})();
