const { open, waitDone, chromium } = require('./page.js');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await open(browser, { action: 'pull', obj: 'bus' });
  await page.selectOption('#effort', 'allout');
  await page.waitForTimeout(800);
  const t = await waitDone(page, '#bay');
  const s = t.indexOf('Custom (use the slider)');
  console.log(t.slice(s + 30, s + 2500));
  await browser.close();
})();
