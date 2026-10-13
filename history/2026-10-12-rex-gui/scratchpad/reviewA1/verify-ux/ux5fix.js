const { BR, open, launch } = require('./lib');
(async () => {
  const b = await launch();
  for (const absorb of ['ocean', 'gradual', 'instant']) {
    const { page, ctx } = await open(b, BR, {}, { width: 1280, height: 900 });
    await page.addStyleTag({ content: '[hidden] { display: none !important; }' });
    await page.waitForTimeout(1500);
    await page.evaluate(() => { document.querySelector('#powers').open = true; });
    await page.selectOption('#absorb', absorb); await page.waitForTimeout(800);
    console.log(absorb, JSON.stringify(await page.evaluate(() => ['grow-fields', 'grow-t-row'].map((id) => { const e = document.getElementById(id); return id + ':' + (e.hidden ? 'hidden' : 'shown') + '/' + getComputedStyle(e).display; }))));
    await ctx.close();
  }
  await b.close();
})();
