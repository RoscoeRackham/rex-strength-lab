const { BR, MAIN, open, launch, S } = require('./lib');
(async () => {
  const b = await launch();
  for (const [name, url, sel] of [['branch', BR, '#powers'], ['main', MAIN, '#comic-setup'], ['main-settings', MAIN, '#setup']]) {
    const { page, ctx } = await open(b, url, {}, { width: 1280, height: 900 });
    await page.waitForTimeout(2000);
    await page.evaluate((q) => { const d = document.querySelector(q); if (d) d.open = true; }, sel);
    await page.waitForTimeout(500);
    const r = await page.evaluate(() => {
      const out = {};
      document.querySelectorAll('[hidden]').forEach((e) => { const cs = getComputedStyle(e); const h = e.getBoundingClientRect().height; if (cs.display !== 'none' && h > 0) out[e.id || e.className || e.tagName] = cs.display + ' h=' + Math.round(h) + ' in ' + (e.closest('details') ? e.closest('details').id : '-'); });
      return { absorb: document.querySelector('#absorb').value, displayedHidden: out, growT_focusable: (() => { const x = document.querySelector('#grow-t'); x.focus(); return document.activeElement === x; })() };
    });
    console.log(name, JSON.stringify(r));
    if (name === 'branch') {
      const box = await page.evaluate(() => { const r = document.querySelector('#powers').getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height }; });
      await page.screenshot({ path: S + '/ux5-powers.png', clip: box, fullPage: true });
    }
    await ctx.close();
  }
  await b.close();
})();
