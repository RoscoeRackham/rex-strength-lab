const { launch, open, OUT } = require('./lib');
(async () => {
  const b = await launch();
  for (const [w, h] of [[360, 740], [1280, 900]]) {
    const { ctx, page } = await open(b, w, h, 'light', { storage: JSON.stringify({ group: 'solo', action: 'throw' }), wait: 800 });
    await page.evaluate(() => { document.querySelector('#comic-setup').open = true; });
    await page.selectOption('#absorb', 'runaway'); await page.waitForTimeout(400);
    await page.evaluate(() => { document.querySelector('#half-row').scrollIntoView({ block: 'center' }); });
    await page.waitForTimeout(200);
    const r = await page.evaluate(() => { const l = document.querySelector('label[for="half-life"]').getBoundingClientRect(), i = document.querySelector('#half-life').getBoundingClientRect(), p = document.querySelector('#comic-setup').getBoundingClientRect(); const bay = document.querySelector('main.panel').getBoundingClientRect(); return { label: [l.left, l.right].map(Math.round), input: [i.left, i.right].map(Math.round), panel: [p.left, p.right].map(Math.round), bay: [bay.left, bay.right].map(Math.round), scrollX: scrollX, ov: document.documentElement.scrollWidth - document.documentElement.clientWidth }; });
    console.log(w, JSON.stringify(r));
    await page.screenshot({ path: OUT + 'runaway-' + w + '.png' });
    await ctx.close();
  }
  await b.close();
})();
