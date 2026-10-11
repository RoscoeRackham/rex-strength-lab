const { chromium } = require('/opt/node22/lib/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const [w, h, touch] of [[1280, 900, false], [390, 844, true]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: touch, isMobile: touch });
    const page = await ctx.newPage();
    await page.addInitScript(() => { try { localStorage.setItem('rex-lab-v1', JSON.stringify({ action: 'throw', angle: 45 })); } catch (e) {} });
    await page.goto('file:///tmp/claude-0/-home-user/6435a7db-fe21-5f3b-bca9-e49ba2609387/scratchpad/audit2/preview_l04fix.html');
    await page.waitForTimeout(500);
    const frames = page.frames();
    let f = page;
    for (const fr of frames) { if (await fr.$('#angle')) { f = fr; break; } }
    const r = await f.$('#angle');
    await r.scrollIntoViewIfNeeded();
    const box = await r.boundingBox();
    console.log('viewport', w, 'box', JSON.stringify(box), 'frame is main?', f === page || f === page.mainFrame());
    await f.evaluate(() => { window.__orig = document.getElementById('angle'); });
    const y = box.y + box.height / 2;
    const x0 = box.x + box.width * 0.5; // 45 deg approx
    const x1 = box.x + box.width * 0.1; // ~9 deg
    if (!touch) {
      await page.mouse.move(x0, y);
      await page.mouse.down();
      for (let i = 1; i <= 20; i++) {
        await page.mouse.move(x0 + (x1 - x0) * i / 20, y);
        await page.waitForTimeout(15);
        if (i === 3) console.log('  after 3 moves (45ms): orig connected =', await f.evaluate(() => window.__orig.isConnected));
      }
      await page.mouse.up();
    } else {
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y }] });
      for (let i = 1; i <= 20; i++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + (x1 - x0) * i / 20, y }] });
        await page.waitForTimeout(15);
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    }
    await page.waitForTimeout(200);
    const res = await f.evaluate(() => ({ label: document.querySelector('label[for=angle]').textContent, val: document.getElementById('angle').value, origConnected: window.__orig.isConnected, stored: JSON.parse(localStorage.getItem('rex-lab-v1')).angle }));
    console.log('  result', JSON.stringify(res));
    await ctx.close();
  }
  await browser.close();
})();
