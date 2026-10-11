const { open, close } = require('./h.js');
(async () => {
  for (const w of [320, 360, 390]) {
    const { page, ctx } = await open({ w, h: 800, state: {} });
    const r = await page.evaluate(() => [...document.querySelectorAll('[role=tab]')].map(t => t.textContent + ':' + (t.scrollWidth > t.clientWidth ? 'OVERFLOW ' + (t.scrollWidth - t.clientWidth) : 'ok')).join(' '));
    console.log(w, r, '| doc overflow', await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth));
    await page.locator('main').screenshot({ path: `tabs-${w}.png`, clip: undefined });
    await ctx.close();
  }
  await close();
})();
