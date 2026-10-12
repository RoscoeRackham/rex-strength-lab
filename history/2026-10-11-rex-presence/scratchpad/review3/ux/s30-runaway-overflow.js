// Runaway growth: horizontal overflow at each width, and the element that causes it.
const { launch, open, OUT } = require('./lib');
(async () => {
  const b = await launch();
  for (const [w, h] of [[360, 740], [390, 844], [768, 1024], [1280, 900]]) {
    for (const absorb of ['gradual', 'instant', 'runaway']) {
      const { ctx, page } = await open(b, w, h, 'light', { storage: JSON.stringify({ group: 'solo', action: 'throw' }), wait: 800 });
      await page.evaluate(() => { document.querySelector('#comic-setup').open = true; });
      await page.selectOption('#absorb', absorb); await page.waitForTimeout(400);
      const r = await page.evaluate(() => {
        const ov = document.documentElement.scrollWidth - document.documentElement.clientWidth;
        const vw = document.documentElement.clientWidth;
        const wide = [...document.querySelectorAll('body *')].filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.right > vw + 1; }).map((e) => e.tagName + (e.id ? '#' + e.id : '') + ' right=' + Math.round(e.getBoundingClientRect().right)).slice(0, 4);
        const lab = document.querySelector('label[for="half-life"]'), panel = document.querySelector('#comic-setup');
        return { ov, wide, label: lab && lab.offsetParent ? Math.round(lab.getBoundingClientRect().width) : null, panel: Math.round(panel.getBoundingClientRect().width) };
      });
      console.log(w, absorb, JSON.stringify(r));
      if (absorb === 'runaway' && w <= 390) await page.screenshot({ path: OUT + 'runaway-' + w + '.png', fullPage: false, clip: await page.evaluate(() => { const r = document.querySelector('#half-row').getBoundingClientRect(); return { x: 0, y: Math.max(0, r.y + scrollY - 200), width: document.documentElement.scrollWidth, height: 320 }; }) }).catch((e) => console.log('shot', e.message));
      await ctx.close();
    }
  }
  await b.close();
})();
