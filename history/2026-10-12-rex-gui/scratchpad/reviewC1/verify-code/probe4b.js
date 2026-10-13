const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const ROOT = process.argv[2];
const { settle } = require(path.join(ROOT, 'test/make-page-fixture.js'));
(async () => {
  const prev = path.join(__dirname, 'probe4-preview.html');
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  const tiles = (bay) => page.evaluate((bay) => Array.from(document.querySelectorAll('#' + bay + ' .tile')).filter((t) => /Energy/.test(t.textContent)).map((t) => t.textContent.replace(/\s+/g, ' ').trim()), bay);
  const cases = [];
  for (const [m, gb, H] of [[1e22, 4, 3.048], [5e22, 4, 3.048], [1e23, 4, 3.048], [3e23, 4, 3.048], [1e24, 4, 500], [1e25, 4, 500], [5e26, 4, 500], [5e28, 4, 500]]) cases.push({ duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: gb, m, oM: m, H, oH: H, mode: 'comic' });
  for (const st of cases) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
    await page.reload(); await page.waitForTimeout(1200); await settle(page, 'duo-bay');
    const saved = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('rex-lab-v1')); return { m: s.m, oM: s.oM, colGB: s.colGB, colSrc: s.colSrc }; });
    console.log(JSON.stringify(saved), '|', (await tiles('duo-bay')).join(' ; ') || '(no energy tile)');
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
