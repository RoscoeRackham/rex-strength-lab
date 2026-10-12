// Confirms the injected overflow is real on the Walk tab and absent on the tabs shots.js measures (load, Collide).
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(pathToFileURL(__dirname + '/dist/preview.html').href);
  await page.waitForTimeout(2500);
  const ov = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  console.log('at load (tab', await page.evaluate(() => document.querySelector('[role=tab][aria-selected=true]').id), '): overflow', await ov());
  await page.click('#grp-solo'); await page.click('#tab-walk'); await page.waitForTimeout(500);
  console.log('walk tab: overflow', await ov());
  await page.click('#grp-duo'); await page.click('#tab-collide'); await page.waitForTimeout(900);
  console.log('collide tab (the last one shots.js visits): overflow', await ov());
  await browser.close();
})();
