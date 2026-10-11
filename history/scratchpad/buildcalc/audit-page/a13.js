const { chromium, CHROME, open } = require('./lib.js');
(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const scheme of ['light', 'dark']) {
    const { ctx, p } = await open(browser, 1280, 900, scheme, { dpr: 1 });
    await p.focus('#showBeyond');
    await p.keyboard.press('Tab'); // svg
    await p.keyboard.press('Tab'); // chest li
    await p.keyboard.press('Tab'); // waist li
    await p.mouse.move(5, 5);
    const el = await p.$('.chart-grid');
    await el.screenshot({ path: `focus-li-${scheme}.png` });
    await ctx.close();
  }
  await browser.close();
})();
