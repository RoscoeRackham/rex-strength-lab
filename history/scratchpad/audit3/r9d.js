const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const prev = path.join(__dirname, 'r9-preview.html');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext();
  const [obj, lk, angle, anchor] = [process.argv[2], +process.argv[3], +process.argv[4], process.argv[5] || 'bolted'];
  const page = await ctx.newPage();
  await page.goto('file://' + prev);
  await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), { logKg: lk, inf: false, mode: 'comic', surface: 'concrete', groundHolds: false, anchor, H: 2, m: 180, action: 'throw', obj, angle });
  await page.reload();
  await page.waitForTimeout(3000);
  const t = await page.$eval('main.panel', (e) => e.innerText);
  console.log(t.split('\n').filter(l => /rater|Impact|planet/.test(l)).join('\n'));
  await browser.close();
})();
