const { open, bay, select, range, check, click, close, grep } = require('./pwlib.js');
(async () => {
  const run = async (lbl, st, eff) => {
    const p = await open('wt', Object.assign({ action: 'walk', group: 'solo' }, st));
    if (eff != null) await range(p, 'step-effort', eff);
    const t = await bay(p, 2000);
    const tiles = await p.evaluate(() => [...document.querySelectorAll('#bay .tile')].map((x) => x.innerText.replace(/\n/g, ' | ')));
    console.log('=== ' + lbl + '\n' + grep(t, /shake the ground|Plaster|stomp|Footprint|footprint|Presence stops|ripples with/i) + '\n' + tiles.join('\n'));
    if (p._errs.length) console.log('errors', p._errs);
    await p.close();
  };
  await run('rex concrete stamp', { surface: 'concrete' }, 1);
  await run('rex sand stamp', { surface: 'sand' }, 1);
  await run('rex softclay stamp', { surface: 'softclay' }, 1);
  await run('ollie softclay soft', { surface: 'softclay', walker: 'ollie' }, null);
  await run('rex sand soft', { surface: 'sand' }, null);
  await close();
})();
