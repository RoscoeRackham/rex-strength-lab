const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.waitForTimeout(800);
  const card = page.locator('.feat', { hasText: 'Atlas holds up the heavens' });
  await card.locator('.run').click();
  await page.waitForTimeout(600);
  console.log(await page.evaluate(() => ({ dial: document.querySelector('#dial-big').textContent, verdict: document.querySelector('.verdict').textContent, chips: [...document.querySelectorAll('#bay .status')].map(s => s.textContent) })));
  await page.locator('main.panel').screenshot({ path: __dirname + '/lay_atlas-simulate.png' });
  await browser.close();
})();
