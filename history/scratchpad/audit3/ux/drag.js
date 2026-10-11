const { open, close } = require('./h.js');
(async () => {
  for (const [w, touch] of [[1280, false], [390, true]]) {
    const { page, ctx } = await open({ w, h: 900, touch, mobile: touch, state: { action: 'throw', angle: 45 } });
    await page.locator('#angle').scrollIntoViewIfNeeded();
    const b = await page.locator('#angle').boundingBox();
    const y = b.y + b.height / 2;
    const x0 = b.x + 8 + (b.width - 16) * 0.5, x1 = b.x + 8 + (b.width - 16) * 0.1;
    const ref = await page.evaluateHandle(() => document.querySelector('#angle'));
    // sample verdict opacity during drag
    if (!touch) {
      await page.mouse.move(x0, y); await page.mouse.down();
      for (let i = 1; i <= 20; i++) { await page.mouse.move(x0 + (x1 - x0) * i / 20, y); await page.waitForTimeout(40); }
      await page.mouse.up();
    } else {
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y }] });
      for (let i = 1; i <= 20; i++) { await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + (x1 - x0) * i / 20, y }] }); await page.waitForTimeout(40); }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    }
    await page.waitForTimeout(300);
    const st = await page.evaluate((r) => ({ angle: JSON.parse(localStorage.getItem('rex-lab-v1')).angle, label: document.querySelector('label[for=angle]').textContent, inputVal: document.querySelector('#angle').value, sameNode: r === document.querySelector('#angle'), connected: r.isConnected, verdict: document.querySelector('#bay .verdict').textContent }), ref);
    console.log(w, touch ? 'touch' : 'mouse', 'drag 45° toward ~9°:', JSON.stringify(st));
    // keyboard
    await page.focus('#angle'); for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(200);
    console.log('   after 5x ArrowRight:', await page.evaluate(() => [document.activeElement.id, document.querySelector('#angle').value, document.querySelector('label[for=angle]').textContent, JSON.parse(localStorage.getItem('rex-lab-v1')).angle]));
    // object change keeps focus?
    await ctx.close();
  }
  await close();
})();
