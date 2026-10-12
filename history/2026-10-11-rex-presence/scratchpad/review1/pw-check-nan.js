const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(pathToFileURL(process.argv[2]).href); await page.waitForTimeout(2000);
  console.log(await page.evaluate(() => { const t = document.body.innerText; const i = t.indexOf('NaN'); return i >= 0 ? 'visible: ' + JSON.stringify(t.slice(i - 30, i + 60)) + ' inside #bay: ' + document.querySelector('#bay').innerText.includes('NaN') : 'not visible'; }));
  await browser.close();
})();
