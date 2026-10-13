const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const file = process.argv[2];
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errs = []; page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(pathToFileURL(file).href);
  for (const gb of [-8.48, -6, -4, -2, -1, 0]) {
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), { action: 'punch', duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: gb });
    await page.reload(); await page.waitForTimeout(2500);
    const r = await page.evaluate(() => { const b = document.getElementById('duo-bay'); const tiles = Array.from(b.querySelectorAll('.tile')); const t = tiles.find((x) => /Energy freed/.test(x.innerText)); return { t: t ? t.innerText.replace(/\s+/g, ' ') : 'none', ov: t ? [t.scrollWidth, t.clientWidth] : null, sw: document.documentElement.scrollWidth }; });
    console.log(gb, JSON.stringify(r));
    if (gb === -8.48) { const el = await page.$('#duo-bay'); const tl = await page.evaluateHandle(() => Array.from(document.querySelectorAll('#duo-bay .tile')).find((x) => /Energy freed/.test(x.innerText))); if (tl.asElement()) await tl.asElement().screenshot({ path: process.argv[3] }); }
  }
  console.log('errors', JSON.stringify(errs));
  await browser.close();
})();
