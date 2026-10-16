const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const ROOT = '/home/user/rex-strength-lab/rex-strength-lab';
(async () => {
  const prev = path.join(ROOT, 'dist', 'preview.html');
  const { settle } = require(path.join(ROOT, 'test', 'make-page-fixture.js'));
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  const soloTxt = (sel) => page.evaluate((s) => Array.from(document.querySelectorAll('#bay ' + s)).map((n) => n.textContent.replace(/\s+/g, ' ')).join(' / '), sel);
  for (const [st, allout] of [[{ action: 'throw', obj: 'person' }, false], [{ action: 'throw', obj: 'person', saveV: 3, keepForm: false, airAbsorb: 0, logKg: 8 }, true]]) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay');
    if (allout) { await page.selectOption('#effort', 'allout'); await page.waitForTimeout(400); await settle(page, 'bay'); }
    console.log('TILES', await soloTxt('.tiles'));
    console.log('HAPPENS', (await soloTxt('.happens')).match(/Safe passenger:.*$/)[0].slice(0, 900));
    console.log('HEAT', ((await soloTxt('.happens')).match(/At Mach[^/]*/) || ['none'])[0]);
  }
  await browser.close();
})();
