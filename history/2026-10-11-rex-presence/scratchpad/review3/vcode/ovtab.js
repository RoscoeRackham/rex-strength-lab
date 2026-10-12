const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(pathToFileURL(__dirname + '/shotsmut/dist/preview.html').href);
  await page.waitForTimeout(2500);
  const ov = () => page.evaluate(() => [document.querySelector('#bay').getAttribute('aria-labelledby'), document.documentElement.scrollWidth - document.documentElement.clientWidth]);
  console.log('at load', await ov());
  for (const tab of ['walk', 'lift', 'throw']) { await page.click('#grp-solo'); await page.click('#tab-' + tab); await page.waitForTimeout(400); console.log(tab, await ov()); }
  for (const tab of ['arm', 'collide']) { await page.click('#grp-duo'); await page.click('#tab-' + tab); await page.waitForTimeout(900); console.log(tab, await ov()); }
  await browser.close();
})();
