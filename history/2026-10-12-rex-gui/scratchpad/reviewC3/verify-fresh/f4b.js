const path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async () => {
  const prev = path.join(__dirname, 'prev-lab.html');
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate(() => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'weight' })); });
  await page.reload(); await page.waitForTimeout(3000);
  const rows = await page.evaluate(() => Array.from(document.querySelectorAll('#src-table tr')).map((tr) => tr.textContent.replace(/ /g, ' ')));
  console.log('rows', rows.length);
  console.log(rows.filter((t) => /time it takes|harmless durations|1,540 m\/s/i.test(t)).join('\n----\n'));
  await browser.close();
})();
