const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const { settle } = require(process.argv[2] + '/test/make-page-fixture.js');
(async () => {
  const prev = path.join(process.argv[3], 'preview.html');
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  for (const mode of ['gradual', 'instant']) for (const g of ['krakatoa', 'chicxulub', 'sun']) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), { action: 'weight' });
    await page.reload(); await page.waitForTimeout(400); await settle(page, 'bay');
    await page.evaluate(() => { document.getElementById('powers').open = true; });
    await page.selectOption('#absorb', mode); await page.waitForTimeout(300); await settle(page, 'bay');
    await page.click('#grow-what-' + g); await page.waitForTimeout(400); await settle(page, 'bay');
    const t = await page.evaluate(() => document.querySelector('#bay .growth-whatif').innerText);
    console.log('=== ' + mode + ' ' + g + '\n' + t);
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
