const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const prev = path.join(__dirname, 'r9-preview.html');
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext();
  for (const lk of [+process.argv[2]]) {
    const page = await ctx.newPage();
    await page.goto('file://' + prev);
    await page.evaluate((s) => localStorage.setItem('rex-lab-v1', JSON.stringify(s)), { logKg: lk, inf: false, mode: process.argv[3]||'comic', surface: process.argv[4]||'concrete', groundHolds: false, anchor: 'friction', H: 2, m: 180, action: 'stomp', obj: 'car', angle: 45 });
    await page.reload();
    await page.waitForTimeout(5000);
    console.log(await page.$eval('main.panel', (e) => e.innerText));
    await page.close();
  }
  await browser.close();
})();
