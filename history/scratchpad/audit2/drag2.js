const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  // touch drag on phone
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    await ctx.addInitScript(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'throw', angle: 45 })));
    const page = await ctx.newPage();
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(800);
    await page.locator('#angle').scrollIntoViewIfNeeded();
    const b = await page.locator('#angle').boundingBox();
    const y = b.y + b.height / 2, x0 = b.x + b.width * 0.5, x1 = b.x + b.width * 0.1;
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y }] });
    for (let i = 1; i <= 20; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + (x1 - x0) * i / 20, y }] }); await page.waitForTimeout(25); }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(200);
    console.log('390 touch drag 45° -> ~9°: label =', await page.textContent('label[for=angle]'));
    await ctx.close();
  }
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    await ctx.addInitScript(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'stomp' })));
    const page = await ctx.newPage();
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(800);
    await page.click('details.math summary'); await page.waitForTimeout(100);
    const open1 = await page.evaluate(() => document.querySelector('details.math').open);
    await page.evaluate(() => { const s = document.querySelector('#strength'); s.value = 3.5; s.dispatchEvent(new Event('input')); });
    await page.waitForTimeout(100);
    const open2 = await page.evaluate(() => document.querySelector('details.math').open);
    console.log('Show the math open after click:', open1, '| after strength slider move:', open2);
    // also scroll position / ladder tip
    await ctx.close();
  }
  await browser.close();
})();
