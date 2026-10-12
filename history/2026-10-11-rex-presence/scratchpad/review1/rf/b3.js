const { open, bay, select, range, check, click, close, grep } = require('./pwlib.js');
(async () => {
  for (const soft of [false, true]) {
    const p = await open('wt', { action: 'jump', group: 'solo', surface: 'sand', softLanding: soft });
    if (soft) await check(p, 'sw-soft', true);
    for (const [lbl, v] of [['custom 10 t', 4], ['all-out', 4.9577]]) {
      await range(p, 'effort-use', v);
      const t = await bay(p, 3500);
      console.log('=== soft ' + soft + ' ' + lbl + '\n' + grep(t, /Effort|Courtesy|Landing|land|sand can bear|punch|sink|Ground|rattle|feel|Soft/i));
    }
    console.log('errors', p._errs);
  }
  await close();
})();
