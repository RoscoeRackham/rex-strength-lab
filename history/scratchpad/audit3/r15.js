const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  const cases = process.argv.slice(2).length ? JSON.parse(process.argv[2]) : [{ logKg: 16.91, obj: 'pyramid', anchor: 'bolted', angle: 45, action: 'throw' }];
  for (const cs of cases) {
    await page.evaluate((cs) => { const cur = JSON.parse(localStorage.getItem('rex-lab-v1') || '{}'); localStorage.setItem('rex-lab-v1', JSON.stringify(Object.assign({}, cur, { inf: false, mode: 'comic', surface: undefined, groundHolds: false, H: 2, m: 180 }, cs))); }, cs);
    await page.reload();
    await page.waitForTimeout(5000);
    await page.click('#tab-' + cs.action);
    await page.waitForTimeout(300);
    const txt = await page.evaluate(() => document.querySelector('main.panel').innerText);
    console.log('=== ' + JSON.stringify(cs) + '\n' + txt.slice(0, 3000));
  }
  console.log('errors', errs);
  await browser.close();
})();
