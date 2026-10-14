const path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(path.join(__dirname, 'prev-lab.html')).href);
  for (const lk of [Math.log10(8e23), Math.log10(8e23 * 33.5)]) {
    await page.evaluate((l) => { localStorage.clear(); localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'punch', logKg: l })); }, lk);
    await page.reload(); await page.waitForTimeout(3000);
    const t = await page.evaluate(() => document.getElementById('bay').innerText.replace(/ /g, ' '));
    console.log(lk.toFixed(3), (t.match(/[^\n]*(J|TNT)[^\n]*/g) || []).slice(0, 4).join(" || "));
  }
  await browser.close();
})();
