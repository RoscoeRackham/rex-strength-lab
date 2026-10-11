const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.waitForTimeout(900);
  const g = page.locator('#ladder-viz .mk[aria-label^="Captain America"]');
  await g.focus();
  await page.waitForTimeout(100);
  const wr = await page.locator('#ladder-viz').boundingBox();
  await page.screenshot({ path: __dirname + '/lay_ladder-tip-clipped-390.png', clip: { x: 0, y: wr.y + wr.height - 260, width: 390, height: 330 } });
  await browser.close();
})();
