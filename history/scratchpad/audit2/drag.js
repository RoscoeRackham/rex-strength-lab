const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, touch] of [[1280, false], [390, true]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, hasTouch: touch });
    await ctx.addInitScript(() => localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'throw', angle: 45 })));
    const page = await ctx.newPage();
    await page.goto('file:///home/user/dino-strength-sim/dist/preview.html');
    await page.waitForTimeout(800);
    await page.locator('#angle').scrollIntoViewIfNeeded();
    const b = await page.locator('#angle').boundingBox();
    const y = b.y + b.height / 2;
    const x0 = b.x + b.width * 0.5, x1 = b.x + b.width * 0.1;
    const ref = await page.evaluateHandle(() => document.querySelector('#angle'));
    await page.mouse.move(x0, y); await page.mouse.down();
    for (let i = 1; i <= 20; i++) { await page.mouse.move(x0 + (x1 - x0) * i / 20, y); await page.waitForTimeout(25); }
    await page.mouse.up();
    await page.waitForTimeout(200);
    const st = await page.evaluate((r) => ({ angle: JSON.parse(localStorage.getItem('rex-lab-v1')).angle, label: document.querySelector('label[for=angle]').textContent, sameNode: r === document.querySelector('#angle'), inDom: r.isConnected }), ref);
    console.log(w, 'mouse drag from 45° toward ~9°:', JSON.stringify(st));
    // Show the math persistence
    await page.click('details.math summary');
    const open1 = await page.evaluate(() => document.querySelector('details.math').open);
    await page.evaluate(() => { const s = document.querySelector('#strength'); s.value = 3.5; s.dispatchEvent(new Event('input')); });
    await page.waitForTimeout(100);
    const open2 = await page.evaluate(() => document.querySelector('details.math').open);
    console.log(w, 'Show the math open after click:', open1, '| after strength slider move:', open2);
    await ctx.close();
  }
  await browser.close();
})();
