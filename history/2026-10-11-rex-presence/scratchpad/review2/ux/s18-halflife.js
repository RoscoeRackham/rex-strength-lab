const { launch, open } = require('./lib');
(async () => {
  const b = await launch();
  for (const chip of [null, 'w-chip-neutronstar', 'w-chip-bh']) {
    const { ctx, page, errs } = await open(b, 1280, 900, 'light', { storage: JSON.stringify({ group: 'solo', action: 'weight' }), wait: 1200 });
    await page.evaluate(() => { document.querySelector('#comic-setup').open = true; });
    if (chip) { await page.click('#' + chip); await page.waitForTimeout(1500); }
    await page.selectOption('#absorb', 'runaway'); await page.waitForTimeout(400);
    await page.click('#grow-what-sun'); await page.waitForTimeout(800);
    const t1 = await page.evaluate(() => (document.querySelector('.growth-whatif') || document.querySelector('#bay')).innerText);
    await page.fill('#half-life', '1000'); await page.dispatchEvent('#half-life', 'change'); await page.waitForTimeout(800);
    const t2 = await page.evaluate(() => (document.querySelector('.growth-whatif') || document.querySelector('#bay')).innerText);
    const loop = (t2.match(/Runaway loop[^\n]*/) || [''])[0];
    console.log(chip || 'canon body', '| half-life changes the text:', t1 !== t2, '|', loop.slice(0, 330));
    if (errs.length) console.log(errs);
    await ctx.close();
  }
  await b.close();
})();
