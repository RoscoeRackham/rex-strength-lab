const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { settle } = require('/home/user/rex-strength-lab/rex-strength-lab/test/make-page-fixture.js');
const DIR = process.argv[2];
(async () => {
  const prev = path.join(DIR, 'probe.html');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  for (const st of [{ action: 'weight', H: 500, m: 9e28 }, { action: 'weight', H: 3.048, m: 5.5e26 }]) {
    await page.evaluate((x) => localStorage.setItem('rex-lab-v1', JSON.stringify(x)), st); await page.reload(); await page.waitForTimeout(800); await settle(page, 'bay');
    const t = await page.evaluate(() => document.getElementById('bay').textContent.replace(/ /g, ' ').replace(/\s+/g, ' '));
    console.log(JSON.stringify(st)); for (const m of t.match(/For this Rex that’s.{0,160}/g) || []) console.log('  ', m);
    for (const m of t.match(/Energy released[^·]*·[^A-Z]*/g) || []) console.log('  tile:', m.slice(0, 160));
  }
  await browser.close();
})();
