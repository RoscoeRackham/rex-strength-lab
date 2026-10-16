const { open } = require('./page.js');
(async () => {
  const p = await open();
  for (const frac of [0.001, 0.0101]) {
    const gb = frac / Math.sqrt(1 - frac * frac);
    await p.load({ duoOpen: true, duoAction: 'collide', colSrc: 'set', colGB: Math.log10(gb) }); await p.pick('allout');
    const a = await p.all();
    console.log('== ' + frac * 100 + '% c');
    console.log('VERDICT', await p.txt('.verdict'));
    console.log('STATUS', await p.txt('.status-row'));
    console.log('air/heat/fireball:', (a.match(/[^.]*(real air|fireball|heat near)[^.]*\./g) || []).slice(0, 5));
    console.log('EFFORT', (await p.txt('.effort-read')).slice(0, 400));
  }
  console.log('errors', p.errs);
  await p.browser.close();
})();
