const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const { settle } = require(process.argv[2] + '/test/make-page-fixture.js');
(async () => {
  const prev = path.join(process.argv[3], 'preview.html');
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const [W, H, scheme] of [[390, 844, 'light'], [390, 844, 'dark'], [1280, 900, 'light'], [1280, 900, 'dark']]) {
    const page = await browser.newPage({ viewport: { width: W, height: H }, colorScheme: scheme });
    await page.goto(pathToFileURL(prev).href);
    for (const [name, st, eff] of [['clap13', { action: 'clap', logKg: 13 }, 'allout'], ['punch1', { action: 'punch', logKg: 1 }, null], ['clap1', { action: 'clap', logKg: 1 }, null]]) {
      await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st);
      await page.reload(); await page.waitForTimeout(400); await settle(page, 'bay');
      if (eff) { await page.selectOption('#effort', eff); await page.waitForTimeout(300); await settle(page, 'bay'); }
      const tiles = await page.$('#bay .tiles');
      if (tiles) await tiles.screenshot({ path: path.join(process.argv[3], 'tiles-' + name + '-' + W + '-' + scheme + '.png') });
    }
    await page.close();
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
