const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: 'light', deviceScaleFactor: 2 });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.waitForTimeout(900);
  const info = await page.evaluate(() => {
    const out = {};
    for (const b of document.querySelectorAll('.badge')) { const cs = getComputedStyle(b); const k = b.className + ' ' + cs.color + ' ' + cs.fontSize; out[k] = (out[k] || 0) + 1; }
    return out;
  });
  console.log(info);
  const card = page.locator('.feat', { has: page.locator('.badge.claimed, .badge.disputed') }).first();
  await card.screenshot({ path: __dirname + '/lay_feat-claimed-light.png' });
  const card2 = page.locator('.feat', { has: page.locator('.badge.verified') }).first();
  await card2.screenshot({ path: __dirname + '/lay_feat-verified-light.png' });
  await page.click('#src-summary');
  await page.waitForTimeout(200);
  await page.locator('#src-details').screenshot({ path: __dirname + '/lay_sources-1280-light.png' });
  await browser.close();
})();
