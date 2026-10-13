const { open, waitDone, chromium } = require('./page.js');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const lk of [8.20, 8.22]) {
    const page = await open(browser, { action: 'jump', surface: 'granite', logKg: 9 });
    await page.evaluate((v) => { const s = document.getElementById('effort-use'); s.value = String(v); s.dispatchEvent(new Event('input', { bubbles: true })); }, lk);
    await page.waitForTimeout(1500);
    const t = await waitDone(page, '#bay');
    const s = t.indexOf('Custom (use the slider)');
    console.log('=== effort log kg', lk);
    console.log(t.slice(s + 30, s + 1800));
    await page.close();
  }
  await browser.close();
})();
