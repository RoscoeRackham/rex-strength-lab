const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
  await page.waitForTimeout(900);
  for (const name of ['Spider-Man', 'Hulk & Thor', 'Strongest human']) {
    // reset to 10 kg-ish so a change is visible
    await page.evaluate(() => { const s = document.querySelector('#strength'); s.value = 1.5; s.dispatchEvent(new Event('input')); });
    await page.waitForTimeout(300);
    const c = page.locator(`#ladder-viz .mk[aria-label^="${name},"] circle`);
    await c.scrollIntoViewIfNeeded();
    const b = await c.boundingBox();
    await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2);
    await page.waitForTimeout(300);
    console.log('tap the', name, 'dot -> dial:', await page.textContent('#dial-big'), '|', await page.textContent('#dial-who'));
  }
  await browser.close();
})();
