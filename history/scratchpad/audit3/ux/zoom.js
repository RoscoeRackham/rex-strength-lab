const { open, close } = require('./h.js');
(async () => {
  for (const [name, st, scheme] of [['default', {}, 'light'], ['default', {}, 'dark'], ['inf', { inf: true }, 'light']]) {
    const { page, ctx } = await open({ w: 390, h: 844, scheme, state: Object.assign({ action: 'throw' }, st), wait: 0, dpr: 3 });
    await page.waitForFunction(() => !document.querySelector('#ladder-never').textContent.includes('Working out'), null, { timeout: 30000 });
    await page.waitForTimeout(300);
    const box = await page.evaluate(() => { const r = document.querySelector("#ladder-viz svg").getBoundingClientRect(); return { x: r.x + scrollX, y: r.y + scrollY, width: r.width, height: r.height }; });
    await page.screenshot({ path: `zoom-${name}-${scheme}-bottom.png`, fullPage: true, clip: { x: box.x, y: box.y + box.height - 230, width: box.width, height: 230 } });
    await page.screenshot({ path: `zoom-${name}-${scheme}-top.png`, fullPage: true, clip: { x: box.x, y: box.y, width: box.width, height: 80 } });
    await ctx.close();
  }
  await close();
})();
