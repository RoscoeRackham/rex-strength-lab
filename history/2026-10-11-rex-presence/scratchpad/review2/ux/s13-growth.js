// Growth modes and comic switches at phone width: overflow, broken numbers, what each switch visibly changes.
const { launch, open, OUT } = require('./lib');
(async () => {
  const b = await launch();
  const busy = (page) => page.evaluate(() => /working it out|Working out/.test(document.querySelector('#bay').innerText));
  for (const absorb of ['gradual', 'instant', 'runaway']) {
    for (const what of ['krakatoa', 'chicxulub', 'sun']) {
      const { ctx, page, errs } = await open(b, 360, 740, 'dark', { storage: JSON.stringify({ group: 'solo', action: 'weight' }), wait: 1200 });
      await page.evaluate(() => { document.querySelector('#comic-setup').open = true; });
      await page.selectOption('#absorb', absorb); await page.waitForTimeout(300);
      await page.click('#grow-what-' + what); await page.waitForTimeout(500);
      const r = await page.evaluate(() => {
        const box = document.querySelector('.growth-whatif');
        const t = box ? box.innerText : '';
        return { ov: document.documentElement.scrollWidth - document.documentElement.clientWidth, bad: (document.body.innerText.match(/NaN|undefined|(?<![∞\w])Infinity/g) || []), wide: [...document.querySelectorAll('.growth-whatif *')].filter((e) => e.getBoundingClientRect().right > box.getBoundingClientRect().right + 1).map((e) => e.tagName + '.' + e.className).slice(0, 3), words: t.split(/\s+/).length, sample: t.slice(t.indexOf('Gradual growth,') >= 0 ? t.indexOf('Gradual growth,') : t.indexOf('growth,'), 99999).slice(0, 1400) };
      });
      console.log('==', absorb, what, JSON.stringify({ ov: r.ov, bad: r.bad, wide: r.wide, words: r.words }));
      if (what === 'chicxulub') console.log(r.sample);
      if (errs.length) console.log('errs', errs);
      if (what === 'chicxulub') await page.locator('.growth-whatif').screenshot({ path: OUT + 'growth-' + absorb + '-360d.png' });
      await ctx.close();
    }
  }
  await b.close();
})();
