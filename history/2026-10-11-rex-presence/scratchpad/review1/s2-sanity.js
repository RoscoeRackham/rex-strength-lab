const { launch, open, AUDIT, OUT } = require('./lib');
(async () => {
  const b = await launch();
  for (const [scheme, theme] of [['light', null], ['light', 'dark'], ['dark', 'light'], ['dark', null]]) {
    const { ctx, page, errs } = await open(b, 360, 740, scheme);
    if (theme) await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    await page.addScriptTag({ content: AUDIT });
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    for (const tab of ['throw', 'walk']) {
      await page.click('#tab-' + tab); await page.waitForTimeout(900);
      const aud = await page.evaluate(() => __textAudit(document.querySelector('#bay')));
      const minFs = aud.reduce((a, x) => (x.fs < a.fs ? x : a));
      const minR = aud.filter((x) => x.ratio).reduce((a, x) => (x.ratio < a.ratio ? x : a));
      console.log(scheme, theme, bg, tab, aud.length, 'minFs', JSON.stringify(minFs), 'minRatio', JSON.stringify(minR));
      await page.locator('main.panel').screenshot({ path: OUT + `sanity-${tab}-${scheme}-${theme}.png` });
    }
    console.log(errs);
    await ctx.close();
  }
  await b.close();
})();
