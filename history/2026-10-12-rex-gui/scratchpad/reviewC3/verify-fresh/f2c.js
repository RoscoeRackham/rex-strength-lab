const path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage();
  // expose ctx by patching: evaluate inside page using the engine and a minimal context copy from the page's own test hook if any
  await page.goto(pathToFileURL(path.join(__dirname, 'prev-lab.html')).href);
  await page.waitForTimeout(3000);
  const has = await page.evaluate(() => Object.keys(window).filter((k) => /Dino|__/.test(k)));
  console.log(has);
  await browser.close();
})();
