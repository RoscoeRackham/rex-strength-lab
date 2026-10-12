const { launch, OUT, PREV } = require('./lib');
(async () => {
  const b = await launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(PREV); await page.waitForTimeout(1200);
  await page.evaluate(() => { document.querySelector('#comic-setup').open = true; });
  await page.locator('#absorb').screenshot({ path: OUT + 'absorb-1280.png' });
  await b.close();
})();
