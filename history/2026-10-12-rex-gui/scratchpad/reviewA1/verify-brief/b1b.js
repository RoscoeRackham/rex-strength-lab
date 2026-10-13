const { launch, openPage, waitIdle } = require('./lib');
(async () => {
  const b = await launch();
  const { page, ctx } = await openPage(b, 'branch', null);
  console.log('HINT:', await page.evaluate(() => document.querySelector('#bolt-rex').closest('.field').querySelector('.hint').textContent));
  await ctx.close();
  // default strength (100 t dial), both bolted, wrestle push on concrete, default least effort; and Arm tab
  for (const s of [{ anchor: 'bolted', oAnchor: 'bolted', duoAction: 'wrestle', wrestleMove: 'push', duoOpen: true }, { anchor: 'bolted', oAnchor: 'bolted', duoAction: 'arm', duoOpen: true, logKg: 9 }]) {
    const { page, ctx } = await openPage(b, 'branch', s);
    await waitIdle(page, '#duo-bay', 30000);
    const t = await page.evaluate(() => document.querySelector('#duo-bay').innerText);
    const lines = t.split('\n').filter((l) => /bolt/i.test(l));
    console.log('== ' + JSON.stringify(s) + '\n' + lines.join('\n'));
    await ctx.close();
  }
  await b.close();
})();
