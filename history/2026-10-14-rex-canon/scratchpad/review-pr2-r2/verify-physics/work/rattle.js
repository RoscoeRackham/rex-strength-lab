const fs = require('fs'), path = require('path'), { pathToFileURL } = require('url');
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const prev = path.join(__dirname, 'page.html');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(pathToFileURL(prev).href);
  await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), JSON.parse(process.argv[2]));
  await page.reload();
  const wait = async () => { for (let i = 0; i < 300; i++) { await page.waitForTimeout(200); const t = await page.evaluate(() => document.body.innerText); if (!/working it out|Working out/i.test(t)) break; } };
  await wait();
  const sel = page.locator('select:has(option[value="rattle"])').first();
  await sel.selectOption('rattle'); await wait();
  const t = await page.evaluate(() => document.querySelector('#bay').innerText);
  console.log(t.split('\n').filter(l => /rattle|Effort|all-out/i.test(l)).join('\n'));
  await browser.close();
})();
