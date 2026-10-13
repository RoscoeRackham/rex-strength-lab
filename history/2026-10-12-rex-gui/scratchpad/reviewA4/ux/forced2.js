const { launch, url } = require('./h.js');
(async () => {
  const browser = await launch();
  for (const fc of ['none', 'active']) {
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 }, forcedColors: fc });
    const page = await ctx.newPage();
    await page.goto(url(process.argv[2] || 'branch.html')); await page.evaluate(() => localStorage.clear()); await page.reload(); await page.waitForTimeout(2500);
    await page.evaluate(() => window.scrollTo(0, 400)); await page.waitForTimeout(300);
    const r = await page.evaluate(() => { const c = document.getElementById('more-below'); const cs = getComputedStyle(c); const b = c.getBoundingClientRect(); return { bg: cs.backgroundImage.slice(0, 60), bgc: cs.backgroundColor, forced: matchMedia('(forced-colors: active)').matches, rect: { x: b.x, y: b.y - 40, width: b.width, height: b.height + 40 } }; });
    console.log(fc, JSON.stringify(r));
    await page.screenshot({ path: __dirname + '/shots/forced-' + (process.argv[2] ? 'fix-' : '') + fc + '.png', clip: r.rect });
    await ctx.close();
  }
  await browser.close();
})();
