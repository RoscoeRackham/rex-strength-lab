const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const logKg of [17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28]) {
    await page.addInitScript((s) => { localStorage.setItem('rex-lab-v1', JSON.stringify(s)); }, { logKg, inf: false, action: 'stomp' });
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(400);
    const res = await page.evaluate(() => {
      const t = [...document.querySelectorAll('.tile')].find(x => x.querySelector('.k')?.textContent.includes('He gets launched'));
      return t ? [...t.children].map(c => c.textContent) : null;
    });
    console.log(logKg, JSON.stringify(res));
  }
  await browser.close();
})();
