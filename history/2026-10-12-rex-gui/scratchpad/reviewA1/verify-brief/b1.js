const { launch, openPage, waitIdle } = require('./lib');
(async () => {
  const b = await launch();
  const cases = [
    ['wrestle push both bolted inf concrete', { anchor: 'bolted', oAnchor: 'bolted', inf: true, duoAction: 'wrestle', wrestleMove: 'push', duoOpen: true, surface: 'concrete' }],
    ['collide, Ollie charges at light speed, Rex bolted', { anchor: 'bolted', oAnchor: 'friction', duoAction: 'collide', colMode: 'charge', colWho: 'ollie', colSrc: 'set', colGB: 0, duoOpen: true }],
    ['collide, Ollie charges 3000 km/s, Rex bolted', { anchor: 'bolted', oAnchor: 'friction', duoAction: 'collide', colMode: 'charge', colWho: 'ollie', colSrc: 'set', colGB: Math.log10(3e6 / 299792458), duoOpen: true }],
  ];
  for (const [name, s] of cases) {
    const { page, errors, ctx } = await openPage(b, 'branch', s);
    await waitIdle(page, '#duo-bay', 30000);
    const v = await page.evaluate(() => { const bay = document.querySelector('#duo-bay'); const vd = bay.querySelector('.verdict'); return { verdict: vd ? vd.innerText : null, boltRex: document.querySelector('#bolt-rex').checked, boltOllie: document.querySelector('#bolt-ollie').checked }; });
    console.log('== ' + name, JSON.stringify(v), errors.length ? 'ERR ' + errors.join(';') : '');
    await ctx.close();
  }
  // the hint itself
  const { page, ctx } = await openPage(b, 'branch', null);
  console.log('HINT:', await page.evaluate(() => document.querySelector('#bolt-rex').closest('.field').querySelector('.hint').innerText));
  await ctx.close();
  await b.close();
})();
