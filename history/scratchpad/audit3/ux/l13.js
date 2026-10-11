const { open, close } = require('./h.js');
(async () => {
  for (const scheme of ['light', 'dark']) {
    const { page, ctx } = await open({ w: 1280, h: 900, scheme, state: { action: 'lift' }, wait: 0, dpr: 2 });
    await page.waitForFunction(() => !document.querySelector('#ladder-never').textContent.includes('Working out'), null, { timeout: 30000 });
    await page.waitForTimeout(300);
    await page.focus('#ladder-viz .mk[data-key="L:cap"]');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    const a = await page.evaluate(() => [document.activeElement.getAttribute('data-key') || document.activeElement.tagName, document.querySelector('#dial-big').textContent]);
    await page.keyboard.press('Tab');
    const b = await page.evaluate(() => document.activeElement.getAttribute('data-key') || document.activeElement.tagName);
    console.log(scheme, 'after Enter on Captain America: focus =', a[0], 'dial =', a[1], '| next Tab ->', b);
    await page.keyboard.press('Shift+Tab');
    await page.waitForTimeout(100);
    const g = page.locator('#ladder-viz .mk[data-key="L:cap"]');
    const bb = await g.locator('circle').boundingBox();
    await page.screenshot({ path: `l13-focus-${scheme}.png`, clip: { x: bb.x - 220, y: bb.y - 140, width: 520, height: 260 } });
    // threshold marker: Enter, then is it still focused even though ladder rerenders
    await page.focus('#ladder-viz .mk[data-key="R:boom"]');
    await page.keyboard.press(' ');
    await page.waitForTimeout(400);
    console.log(scheme, 'after Space on R:boom: focus =', await page.evaluate(() => document.activeElement.getAttribute('data-key') || document.activeElement.tagName));
    await ctx.close();
  }
  await close();
})();
